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

            return timeline;
        },
    },
};
