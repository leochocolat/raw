// Data
import resources from '@/resources';

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
            this.$store.dispatch('preloader/start');
            this.$refs.preloaderScreens.start();
        },

        start() {
            this.$store.dispatch('preloader/setReady');
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

            if (this.$refs.preloaderScreens.isComplete || this.$refs.preloaderScreens.isDisable) {
                this.start();
            }
        },
    },
};
