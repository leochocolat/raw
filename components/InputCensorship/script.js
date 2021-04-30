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
            isSubmitting: false,
            isSent: false,
            // Censorship
            newCensorshipFactor: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            censorshipDelta: this.$store.state.data.scenes[this.scene.id].censorshipDelta || 0,
            // Drag
            dragRelativePosition: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            dragPosition: this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor,
            minFactor: math.clamp((this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor) - this.maxRange, 0, 1),
            maxFactor: math.clamp((this.$store.state.data.scenes[this.scene.id].censorshipFactor || this.scene.censorshipFactor) + this.maxRange, 0, 1),
            // Visual
            isOffRange: false,
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

        /**
         * Private
         */
        getBounds() {
            this._width = WindowResizeObserver.width;
            this.rangeBounds = this.$refs.range.getBoundingClientRect();
            this.rangeLimitBounds = this.$refs.rangeLimit.getBoundingClientRect();
        },

        initDragPosition() {
            this.dragPosition = this.dragRelativePosition * this.rangeBounds.width;
        },

        updateDragPosition(mousePositionX) {
            this.dragPosition = math.clamp(mousePositionX - this.rangeBounds.x, 0, this.rangeBounds.width);
            this.dragRelativePosition = math.clamp(this.dragPosition / this.rangeBounds.width, this.minFactor, this.maxFactor);

            this.watchOffRange();
            this.updateCensorshipFactor();
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

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);

            // Drag
            // this.dragManager = new DragManager({ el: this.$refs.rangeLimit });
            this.dragManager = new DragManager({ el: this.$refs.range });
            this.dragManager.addEventListener('dragstart', this.dragstartHandler);
            this.dragManager.addEventListener('drag', this.dragHandler);
            this.dragManager.addEventListener('dragend', this.dragendHandler);
            this.dragManager.addEventListener('tap', this.tapHandler);
        },

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);

            // Remove drag events
            this.dragManager.close();
        },

        resizeHandler(e) {
            this._width = e.width;

            this.getBounds();
            this.throw();
            this.initDragPosition();
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
