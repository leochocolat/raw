// Vendor
import gsap from 'gsap';

export default {
    data() {
        return {
            duration: 5,
        };
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timeline = new gsap.timeline();

            timeline.set(this.$el, { autoAlpha: 1 });
            timeline.to(this.$refs.logoContainer, { duration: 0.1, alpha: 1 });
            timeline.to(this.$refs.logoContainer, { duration: 0.1, alpha: 0 });
            timeline.to(this.$refs.logoContainer, { duration: 0.1, alpha: 1 });
            timeline.to(this.$refs.logoContainer, { duration: 0.1, alpha: 0 });
            timeline.to(this.$refs.logoContainer, { duration: 0.1, alpha: 1 });
            timeline.call(this.$refs.logoAnimation.play, null);

            return timeline;
        },

        transitionOut() {
            const timeline = new gsap.timeline();

            timeline.call(this.$refs.logoAnimation.stop, null, 0);
            timeline.to(this.$refs.logoContainer, { duration: 0.1, alpha: 0 });
            timeline.set(this.$el, { autoAlpha: 0 });

            return timeline;
        },
    },
};
