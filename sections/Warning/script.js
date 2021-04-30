// Vendor
import gsap from 'gsap';

export default {
    data() {
        return {
            locale: this.$i18n.locale,
        };
    },

    props: ['data'],

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline();

            this.timelineIn.to(this.$el, 0.5, { alpha: 1 });

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineOut = new gsap.timeline();

            this.timelineOut.to(this.$el, 0.5, { alpha: 0 });

            return this.timelineOut;
        },
    },
};
