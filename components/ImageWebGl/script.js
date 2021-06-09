// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import { mapGetters } from 'vuex';

export default {
    props: ['name', 'side', 'scale'],

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
        }),
    },

    watch: {
        isReady(isReady) {
            // On First load
            if (isReady) this.createWebGLImage();
        },
    },

    mounted() {
        this.getBounds();
        this.setupEventListeners();

        // On Full complete
        if (this.isReady) this.createWebGLImage();
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
                scale: this.scale,
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
            this.webglImage?.resize(this.containerBounds);
        },
    },
};
