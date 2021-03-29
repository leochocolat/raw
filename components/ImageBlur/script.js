import gsap from 'gsap';
// Vendor
import { mapGetters } from 'vuex';

// Utils
import DragManager from '@/utils/DragManager';
import clamp from '@/utils/math/clamp';

export default {
    data() {
        return {
            blurElm: {
                blurValue: 0,
            },
        };
    },
    computed: {
        ...mapGetters({
            blurValue: 'data/blurValue',
        }),
    },

    watch: {},

    beforeDestroy() {},

    mounted() {
        this.ui = {
            image: this.$refs.image,
            blurElm: {
                cursor: this.$refs.cursor,
                cursorPos: 0,
                containerSize: this.$refs.container.getBoundingClientRect().width,
                blurValue: this.blurValue,
            },
        };

        this.setupEventListener();
        this.setCursorPosition();
    },

    methods: {
        setCursorPosition() {
            this.ui.blurElm.cursorPos = this.blurElm.blurValue * this.ui.blurElm.containerSize;
            this.ui.blurElm.cursor.style.transform = `translate3D(${this.ui.blurElm.cursorPos}px, 0px, 0px)`;
        },

        updateCursorPos(event) {
            this.ui.blurElm.cursorPos -= event.delta.x;
            this.ui.blurElm.cursor.style.transform = `translate3D(${clamp(this.ui.blurElm.cursorPos, 0, this.ui.blurElm.containerSize - 10)}px, 0px, 0px)`;
        },

        updateBlurValue() {
            this.blurElm.blurValue = clamp(this.ui.blurElm.cursorPos / this.ui.blurElm.containerSize, 0.01, 0.99).toFixed(2);
            this.ui.image.style.filter = `blur(${this.blurElm.blurValue * 10}px)`;
        },

        dragHandler(event) {
            this.updateCursorPos(event);
            this.updateBlurValue();
        },

        async submitVoteHandler() {
            const newPost = await this.$api.createEntry('blurValue', {
                title: {
                    [this.$i18n.localeProperties.name]: 'Value',
                },
                value: {
                    [this.$i18n.localeProperties.name]: this.blurElm.blurValue,
                },
            });
        },

        setupEventListener() {
            const dragManager = new DragManager({ el: this.ui.blurElm.cursor });
            dragManager.addEventListener('drag', this.dragHandler);
            dragManager.addEventListener('dragend', this.dragEndHandler);

            this.$refs.submitVoteBtn.addEventListener('click', this.submitVoteHandler);
        },
    },
};
