// Vendor
import gsap from 'gsap';

// Components
import ArrowDown from '@/assets/icons/arrow-down.svg?inline';
import CursorCensorship from '@/assets/icons/cursor-censorship.svg?inline';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import DragManager from '@/utils/DragManager';
import math from '@/utils/math';

export default {
    props: ['scene', 'label1', 'label2', 'max-range'],

    data() {
        return {
            // Submit
            isSubmitting: false,
            isSent: false,
            allowSubmit: false,
            // Censorship
            newCensorshipFactor: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            censorshipDelta: this.$store.state.data.scenes[this.scene.id].censorshipDelta || 0,
            // Drag
            dragRelativePosition: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            dragPosition: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            clampedDragPosition: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            minFactor: math.clamp((this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor) - this.maxRange, 0, 1),
            maxFactor: math.clamp((this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor) + this.maxRange, 0, 1),
            // Visual
            isOffRange: false,
            // Content
            lang: this.$i18n.locale,
            validationInstruction: {
                fr: 'Appuyez sur entrer pour valider',
                en: 'Press enter to validate',
            },
            submitErrorMessage: {
                fr: 'Il y a eu une erreur, réessayer plus tard',
                en: 'Something went wrong please try again later',
            },
            submitSuccessMessage: {
                fr: 'La censure de ce contenu a bien été prise en compte',
                en: 'The censorship of this content has been updated successfully',
            },
            successMessage: {
                fr: 'Choix validé',
                en: 'Choice confirmed',
            },
        };
    },

    mounted() {
        this.getBounds();
        this.setupEventListeners();
        this.initDragPosition();
        this.throw();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineOut?.kill();

            this.timelineIn = new gsap.timeline();

            this.timelineIn.to(this.$el, { duration: 0.1, alpha: 1 });

            this.timelineIn.call(() => {
                this.$store.dispatch('setInstructions', this.scene.instruction);
                this.allowSubmit = true;
            }, null, 0);

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineIn?.kill();

            this.timelineOut = new gsap.timeline();

            this.timelineOut.to(this.$el, { duration: 0.1, alpha: 0 });

            this.timelineOut.call(() => {
                // this.$store.dispatch('setInstructions', '');
                this.allowSubmit = false;
            }, null, 0);

            return this.timelineOut;
        },

        setComplete() {
            const timelineComplete = new gsap.timeline();

            timelineComplete.to(this.$refs.range, { duration: 0.1, autoAlpha: 0 }, 0);
            timelineComplete.to(this.$el, { duration: 0.3, y: '-100%', ease: 'power2.out' }, 0.2);
            timelineComplete.to(this.$refs.successMessage, { duration: 0.1, alpha: 1 }, 0.5);

            timelineComplete.call(() => {
                this.$parent.stepCompleteHandler({ id: 0 });
            }, null);
        },

        /**
         * Private
         */
        getBounds() {
            this._width = WindowResizeObserver.width;
            this.rangeBounds = this.$refs.range.getBoundingClientRect();
            this.rangeLimitBounds = this.$refs.rangeLimit.getBoundingClientRect();
        },

        initCensorship() {
            this.$root.webglApp.debugSceneManager?.scene.setCensorship(this.newCensorshipFactor);
        },

        initDragPosition() {
            this.dragPosition = this.dragRelativePosition * this.rangeBounds.width;
            this.dragRelativePosition = math.clamp(this.dragPosition / this.rangeBounds.width, this.minFactor, this.maxFactor);
            this.clampedDragPosition = this.dragRelativePosition * this.rangeBounds.width;
        },

        updateDragPosition(mousePositionX) {
            // Drag position is clamped to full range bounds
            this.dragPosition = math.clamp(mousePositionX - this.rangeBounds.x, 0, this.rangeBounds.width - 2);

            // Relative Drag position is clamped to min and max values
            this.dragRelativePosition = math.clamp(this.dragPosition / this.rangeBounds.width, this.minFactor, this.maxFactor);

            // Clamped drag position clamped to min and max values
            this.clampedDragPosition = this.dragRelativePosition * this.rangeBounds.width;

            this.watchOffRange();
            this.updateCensorshipFactor();
            this.updateCensorshipDelta();
        },

        watchOffRange() {
            if (this.dragPosition < (this.rangeLimitBounds.x - this.rangeBounds.x - 1) || this.dragPosition > this.rangeLimitBounds.width + (this.rangeLimitBounds.x - this.rangeBounds.x + 1)) {
                this.isOffRange = true;
            } else {
                this.isOffRange = false;
            }
        },

        updateCensorshipFactor() {
            this.newCensorshipFactor = this.dragRelativePosition;

            // console.log(this.$root.webglApp.sceneManager?.scenes[this.scene.id]);
            if (this.$root.webglApp.debugSceneManager?.scene.setCensorship) {
                this.$root.webglApp.debugSceneManager.scene.setCensorship(this.newCensorshipFactor);
            }

            if (this.$root.webglApp.sceneManager?.scenes[this.scene.id].setCensorship) {
                this.$root.webglApp.sceneManager.scenes[this.scene.id].setCensorship(this.newCensorshipFactor);
            }
        },

        updateCensorshipDelta() {
            this.censorshipDelta = this.newCensorshipFactor - this.scene.censorshipFactor;

            if (this.hasStartedDraging) return;
            if (this.censorshipDelta !== 0) {
                this.hasStartedDraging = true;
                this.$parent.showMessages();
                this.$store.dispatch('setInstructions', this.validationInstruction[this.lang]);
            }
        },

        throw() {
            this.throwTween = gsap.to(this, {
                inertia: {
                    duration: { max: 1 },
                    resistance: 0,
                    dragPosition: {
                        velocity: 0,
                        min: this.minFactor * this.rangeBounds.width,
                        max: (this.maxFactor * this.rangeBounds.width) - 2.5,
                    },
                },
                onUpdate: this.watchOffRange,
            });
        },

        submit() {
            if (this.isSubmitting || this.isSent) return;
            this.isSubmitting = true;

            this.$api
                .updateSceneCensorship(this.scene.sysId, this.newCensorshipFactor)
                .then(() => {
                    this.isSent = true;
                    this.isSubmitting = false;

                    this.$store.dispatch('setInstructions', this.submitSuccessMessage[this.lang]);

                    // Update store
                    this.updateStore();

                    // Set Step Complete
                    this.setComplete();
                })
                .catch(() => {
                    this.isSubmitting = false;
                    this.$store.dispatch('setInstructions', this.submitErrorMessage[this.lang]);
                    throw new Error('Something went wrong while updating censorship data');
                });
        },

        updateStore() {
            // Store
            this.$store.dispatch('data/setSceneCensorshipFactor', { id: this.scene.id, value: this.newCensorshipFactor });
            this.$store.dispatch('data/setSceneCensorshipDelta', { id: this.scene.id, value: this.censorshipDelta });
            this.$store.dispatch('data/setSceneComplete', { id: this.scene.id, value: true });

            // Cookies
            this.$cookies.set('data', this.$store.state.data, {
                // One month
                expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
                maxAge: 1000 * 3600 * 24 * 30,
            });
        },

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);

            // Drag
            // this.dragManager = new DragManager({ el: this.$refs.rangeLimit });
            this.dragManager = new DragManager({ el: this.$refs.range });
            this.dragManager.addEventListener('dragstart', this.dragstartHandler);
            this.dragManager.addEventListener('drag', this.dragHandler);
            this.dragManager.addEventListener('dragend', this.dragendHandler);
            this.dragManager.addEventListener('tap', this.tapHandler);

            // Submit
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
            window.removeEventListener('keydown', this.keydownHandler);

            // Remove drag events
            this.dragManager.close();
        },

        resizeHandler(e) {
            this._width = e.width;

            this.getBounds();
            this.throw();
            this.initDragPosition();
            this.initCensorship();
        },

        keydownHandler(e) {
            if (!this.allowSubmit) return;
            if (e.key === 'Enter') this.submit();
        },

        dragstartHandler(e) {
            this.throwTween?.kill();

            this.updateDragPosition(e.position.x);
        },

        dragHandler(e) {
            this.updateDragPosition(e.position.x);
        },

        dragendHandler(e) {
            this.throw();
        },

        tapHandler(e) {
            this.throwTween?.kill();
            this.updateDragPosition(e.position.x);
            this.throw();
        },
    },

    components: {
        ArrowDown,
        CursorCensorship,
    },
};
