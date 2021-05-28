// Vendor
import gsap from 'gsap';
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
            const timeline = new gsap.timeline();

            timeline.add(this.$refs.inputCensorship.transitionIn(), 0);

            return timeline;
        },

        transitionOut() {
            const timeline = new gsap.timeline();

            timeline.add(this.$refs.inputCensorship.transitionOut(), 0);
            timeline.add(this.$refs.inputCensorshipText.transitionOut(), 0);
            timeline.add(this.$refs.censorshipMessages.transitionOut(), 0);

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

        showMessages() {
            this.$refs.censorshipMessages.transitionIn();
        },

        hideMessages() {
            this.$refs.censorshipMessages.transitionOut();
        },
    },
};
