// Vendor
import gsap from 'gsap';

export default {
    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timeline = new gsap.timeline();
            timeline.to(this.$el, { duration: 0.1, alpha: 1 });
            timeline.to(this.$el, { duration: 0.1, alpha: 0 });
            timeline.to(this.$el, { duration: 0.1, alpha: 1 });
            timeline.to(this.$el, { duration: 0.1, alpha: 0 });
            timeline.to(this.$el, { duration: 0.1, alpha: 1 });

            return timeline;
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.1, alpha: 0 });
        },
    },
};
