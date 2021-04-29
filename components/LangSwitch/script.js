// Vendor
import gsap from 'gsap';

export default {
    methods: {
        /**
         * Public
         */
        transitionIn() {
            gsap.to(this.$el, { duration: 0.5, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.5, alpha: 0 });
        },
    },
};
