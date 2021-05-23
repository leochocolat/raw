// Vendor
import gsap from 'gsap';

// Components
import ArrowDown from '@/assets/icons/arrow-down.svg?inline';

export default {
    props: ['scene', 'label1', 'label2'],

    data() {
        return {
            // Submit
            isSubmitting: false,
            isSent: false,
            allowSubmit: false,
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
                fr: 'Votre message a bien été enregistré',
                en: 'Your message has been sent successfully',
            },
            // Input
            message: '',
        };
    },

    mounted() {
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timeline = new gsap.timeline();

            timeline.to(this.$el, { duration: 0.5, alpha: 1 });
            timeline.call(this.focus, null, 0.5);
            timeline.call(() => {
                this.$store.dispatch('setInstructions', this.scene.instruction2);
                this.allowSubmit = true;
            }, null, 0.5);

            return timeline;
        },

        transitionOut() {
            const timeline = new gsap.timeline();

            timeline.call(() => {
                // this.$store.dispatch('setInstructions', '');
                this.allowSubmit = false;
            }, null, 0);

            return timeline;
        },

        /**
         * Private
         */
        focus() {
            this.$refs.textarea.focus();
        },

        submit() {
            if (this.isSubmitting || this.isSent) return;
            this.isSubmitting = true;

            const message = {
                delta: this.$store.state.data.scenes[this.scene.id].censorshipDelta || 0,
                content: this.message,
            };

            this.$api
                .addSceneCensorshipMessage(this.scene.sysId, message)
                .then(() => {
                    this.isSent = true;
                    this.isSubmitting = false;

                    this.$store.dispatch('setInstructions', this.submitSuccessMessage[this.lang]);

                    // Update store
                    this.updateStore();

                    // Set Step Complete
                    this.setComplete();

                    // Redirect to home
                    // this.$router.push(this.localePath('prototype'));
                })
                .catch(() => {
                    this.isSubmitting = false;
                    this.$store.dispatch('setInstructions', this.submitErrorMessage[this.lang]);
                    throw new Error('Something went wrong while updating censorship data');
                });
        },

        updateStore() {
            // Store
            this.$store.dispatch('data/setSceneCensorshipMessage', { id: this.scene.id, message: this.message });

            // Cookies
            this.$cookies.set('data', this.$store.state.data, {
                // One month
                expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
                maxAge: 1000 * 3600 * 24 * 30,
            });
        },

        setComplete() {
            const timelineComplete = new gsap.timeline();

            timelineComplete.call(() => {
                this.$parent.stepCompleteHandler({ id: 1 });
            }, null);
        },

        setupEventListeners() {
            // Submit
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            // Submit
            window.addEventListener('keydown', this.keydownHandler);
        },

        inputHandler() {
            const value = this.$refs.textarea.value;
            this.message = value;

            if (this.hasStartedWriting) return;
            this.hasStartedWriting = true;

            this.$store.dispatch('setInstructions', this.validationInstruction[this.lang]);
        },

        keydownHandler(e) {
            if (!this.allowSubmit) return;
            if (e.key === 'Enter' && !e.shiftKey) {
                this.submit();
            }
        },

        textareaKeydownHandler(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                // prevent new line
                e.preventDefault();
            }
        },
    },

    components: {
        ArrowDown,
    },
};
