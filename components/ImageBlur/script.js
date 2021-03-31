// Vendor
import { mapGetters } from 'vuex';

// Utils
import DragManager from '@/utils/DragManager';
import clamp from '@/utils/math/clamp';

export default {
    computed: {
        ...mapGetters({
            blurValue: 'data/blurValue',
        }),
    },

    mounted() {
        this.containerSize = this.$refs.container.getBoundingClientRect().width;
        this.cursorPosition = 0;

        this.setupEventListener();
        this.setCursorPosition();
    },

    beforeDestroy() {
        this.removeEventListener();
    },

    methods: {
        setCursorPosition() {
            this.cursorPosition = this.blurValue * this.containerSize;
            this.$refs.cursor.style.transform = `translate3D(${this.cursorPosition}px, 0px, 0px)`;
        },

        updateCursorPos(event) {
            this.cursorPosition -= event.delta.x;
            this.$refs.cursor.style.transform = `translate3D(${clamp(this.cursorPosition, 0, this.containerSize - 10)}px, 0px, 0px)`;
        },

        updateBlurValue() {
            const blurValue = clamp(this.cursorPosition / this.containerSize, 0.01, 0.99).toFixed(2);
            this.$refs.image.style.filter = `blur(${blurValue * 10}px)`;
            this.$store.dispatch('data/setBlurValue', blurValue);
        },

        /**
         * Events
         */
        setupEventListener() {
            this.dragManager = new DragManager({ el: this.$refs.cursor });
            this.dragManager.addEventListener('drag', this.dragHandler);
        },

        removeEventListener() {
            this.dragManager.close();
        },

        /**
         * Handlers
         */
        dragHandler(event) {
            this.updateCursorPos(event);
            this.updateBlurValue();
        },

        clickSubmitHandler() {
            this.$api.createEntry('blurValue', {
                title: {
                    [this.$i18n.localeProperties.name]: 'Value',
                },
                value: {
                    [this.$i18n.localeProperties.name]: parseFloat(this.blurValue),
                },
            });
        },
    },
};
