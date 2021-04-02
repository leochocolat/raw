// Vendor
import { mapGetters } from 'vuex';

// Data
import resources from '@/resources';

// Utils
import { WebGLRenderer } from 'three';
import { ResourceLoader } from '@/utils/resource-loader';
import { ThreeGltfDracoLoader, ThreeBasisTextureLoader, ThreeTextureLoader, FontLoader, ThreeVideoTextureLoader } from '@/utils/loaders';

export default {
    computed: {
        ...mapGetters({
            isDebug: 'context/isDebug',
        }),
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
         * Private
         */
        setupResources() {
            ResourceLoader.basePath = '';
            ResourceLoader.registerLoader(ThreeGltfDracoLoader, 'gltf', { decoderPath: '/libs/draco/' });
            ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');
            ResourceLoader.registerLoader(FontLoader, 'font');
            ResourceLoader.registerLoader(ThreeVideoTextureLoader, 'video-texture');
            ResourceLoader.registerLoader(ThreeBasisTextureLoader, 'basis', { decoderPath: '/libs/basis/', renderer: new WebGLRenderer() });

            this.resources = resources;
            this.resourceLoader = new ResourceLoader();
            this.resourceLoader.add({ resources, preload: false });
            this.resourceLoader.preload();

            this.$store.dispatch('preloader/start');
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
            this.$store.dispatch('preloader/complete');
        },
    },
};
