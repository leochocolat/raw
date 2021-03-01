// Data
import resources from '@/resources';

// Utils
import ResourceLoader from '@/utils/ResourceLoader';

export default {
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
            const basePath = '';
            this.resources = resources;
            this.resourceLoader = new ResourceLoader(this.resources, basePath);
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

        completeHandler() {},
    },
};
