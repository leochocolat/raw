// Vendor
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            preloaderStep: 'preloader/step',
            isReady: 'preloader/isReady',
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

        isReady(isReady) {
            if (isReady) this.showButtonSound();
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

        showButtonSound() {
            this.$refs.langSwitch.transitionOut();
            this.$refs.buttonSound.transitionIn();
        },
    },
};
