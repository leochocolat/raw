// Vendor
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            preloaderStep: 'preloader/step',
        }),
    },

    watch: {
        preloaderStep(newValue) {
            if (newValue === 'stop') {
                this.showButtonStop();
            }

            if (newValue === 'instructions') {
                this.showInstructions();
            }
        },
    },

    methods: {
        /**
         * Public
         */
        showButtonStop() {
            this.$refs.buttonStop.transitionIn();
        },

        showInstructions() {
            this.$refs.instructions.transitionIn();
        },
    },
};
