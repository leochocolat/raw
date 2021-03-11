// Vendor
import { mapGetters } from 'vuex';

// Data
import resources from '@/resources';

// Utils
import ResourceLoader from '@/utils/ResourceLoader';

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
            const basePath = '';
            this.resources = resources;
            this.resourceLoader = new ResourceLoader(this.resources, basePath, this.isDebug);
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
