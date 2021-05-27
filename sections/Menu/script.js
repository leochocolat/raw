// Vendor
import gsap from 'gsap';

export default {
    data() {
        return {
            locale: this.$i18n.locale,
        };
    },

    props: ['data', 'scene-entries'],

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timeline = new gsap.timeline();

            timeline.call(() => {
                this.$store.dispatch('setInstructions', this.data.instructionsMenu);
            }, null);

            timeline.add(this.$refs.screen0.transitionIn(), 0);
            timeline.add(this.$refs.screen1.transitionIn(), 0);
            timeline.add(this.$refs.screen2.transitionIn(), 0);
            timeline.add(this.$refs.screen3.transitionIn(), 0);

            return timeline;
        },
    },
};
