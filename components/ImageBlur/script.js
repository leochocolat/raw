import gsap from 'gsap';
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

    watch: {},

    beforeDestroy() {},

    mounted() {
        this.blurElm = {
            cursor: this.$refs.cursor,
            cursorPos: 0,
            containerSize: this.$refs.container.getBoundingClientRect().width,
            blurValue: this.blurValue,
        };

        this.setupEventListener();
        this.setCursorPosition();
    },

    methods: {
        setCursorPosition() {
            this.blurElm.cursorPos = this.blurElm.blurValue * this.blurElm.containerSize;
            this.blurElm.cursor.style.transform = `translate3D(${this.blurElm.cursorPos}px, 0px, 0px)`;
        },

        updateCursorPos(event) {
            this.blurElm.cursorPos -= event.delta.x;
            this.blurElm.cursor.style.transform = `translate3D(${clamp(this.blurElm.cursorPos, 0, this.blurElm.containerSize)}px, 0px, 0px)`;
        },

        updateBlurValue() {
            this.blurElm.blurValue = this.blurElm.cursorPos / this.blurElm.containerSize;
            console.log(this.blurElm.blurValue);
        },

        dragHandler(event) {
            this.updateCursorPos(event);
        },

        dragEndHandler() {
            this.updateBlurValue();
        },

        setupEventListener() {
            const dragManager = new DragManager({ el: this.blurElm.cursor });
            dragManager.addEventListener('drag', this.dragHandler);
            dragManager.addEventListener('dragend', this.dragEndHandler);
        },
    },
};
