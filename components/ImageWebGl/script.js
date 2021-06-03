// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import { mapGetters } from 'vuex';

export default {
    props: ['name', 'side'],

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
        }),
    },

    watch: {
        isReady(isReady) {
            if (isReady) this.createWebGLImage();
        },
    },

    mounted() {
        this.getBounds();
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
            this.webglImage?.transitionIn();
        },

        transitionOut() {
            this.webglImage?.transitionOut();
        },

        /**
         * Private
         */
        getBounds() {
            this.containerBounds = this.$el.parentNode.getBoundingClientRect();
        },

        createWebGLImage() {
            this.webglImage = this.$root.webglApp.sceneManager.UILayer.createImage({
                name: this.name,
                side: this.side,
                containerBounds: this.containerBounds,
            });
        },

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        resizeHandler() {
            this.getBounds();
            this.webglImage.resize(this.containerBounds);
        },
    },
};
