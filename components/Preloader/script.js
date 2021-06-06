// Vendor
import gsap from 'gsap';

// Data
import resources from '@/resources/index';

// Utils
import { WebGLRenderer } from 'three';
import { ResourceLoader } from '@/utils/resource-loader';
import { ThreeGltfDracoLoader, ThreeBasisTextureLoader, ThreeTextureLoader, FontLoader, ThreeVideoTextureLoader, PizzicatoAudioLoader } from '@/utils/loaders';

export default {
    data() {
        return {
            isDisable: false,
        };
    },

    computed: {
        lang() {
            return this.$i18n.locale;
        },
    },

    mounted() {
        this.setupResources();
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        disable() {
            this.isDisable = true;
            this.$refs.preloaderScreens.disable();
        },

        /**
         * Private
         */
        setupResources() {
            ResourceLoader.basePath = '';
            ResourceLoader.registerLoader(ThreeGltfDracoLoader, 'gltf', { decoderPath: '/libs/draco/' });
            ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');
            ResourceLoader.registerLoader(FontLoader, 'font');
            ResourceLoader.registerLoader(ThreeVideoTextureLoader, 'video-texture');
            ResourceLoader.registerLoader(ThreeBasisTextureLoader, 'basis', { decoderPath: '/libs/basis/', renderer: new WebGLRenderer() });
            ResourceLoader.registerLoader(PizzicatoAudioLoader, 'audio');

            this.resources = resources;
            this.resourceLoader = new ResourceLoader();
            this.resourceLoader.add({ resources, preload: false });
            this.resourceLoader.preload();

            // Start preloader
            this.showLoadingMessage();

            this.$store.dispatch('preloader/start');
            this.$refs.preloaderScreens.start();
        },

        start() {
            this.$store.dispatch('preloader/setReady');
            this.removePreloader();
            this.hideLoadingMessage();
        },

        showLoadingMessage() {
            const timeline = new gsap.timeline();

            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 1, ease: 'power0.none' });
        },

        hideLoadingMessage() {
            const timeline = new gsap.timeline();

            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            timeline.to(this.$refs.loadingMessage, { duration: 0.1, alpha: 0, ease: 'power0.none' });
        },

        removePreloader() {
            this.$el.style.display = 'none';
        },

        /**
         * Events
         */
        setupEventListeners() {
            this.resourceLoader.addEventListener('complete', this.completeHandler);
        },

        removeEventListeners() {
            this.resourceLoader.removeEventListener('complete', this.completeHandler);
        },

        completeHandler() {
            this.$store.dispatch('preloader/setComplete');

            this.$refs.preloaderScreens.isPreloaderComplete = true;

            // this.hideLoadingMessage();

            if (this.$refs.preloaderScreens.isComplete || this.$refs.preloaderScreens.isDisable) {
                this.start();
            }
        },
    },
};
