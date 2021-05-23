// Vendor
import { mapGetters } from 'vuex';

export default {
    props: ['data'],

    data() {
        return {
            lang: this.$i18n.locale,
        };
    },

    computed: {
        ...mapGetters({
            isSceneComplete: 'data/isSceneComplete',
        }),

        isComplete() {
            return this.isSceneComplete(this.data.id);
        },
    },

    mounted() {

    },

    beforeDestroy() {

    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            return this.$refs.inputCensorship.transitionIn();
        },

        transitionOut() {
            return this.$refs.inputCensorship.transitionOut();
        },

        stepCompleteHandler(e) {
            const stepId = e.id;

            if (stepId === 0) {
                this.$refs.inputCensorshipText.transitionIn();
            } else {
                // Redirect to home
                this.$router.push(this.localePath('prototype'));
            }
        },
    },
};
