// Vendor
import gsap from 'gsap';

// Mixins
import page from '@/mixins/page';

export default {
    mixins: [page],

    methods: {
        transitionInit() {
            gsap.set(this.$el, { alpha: 0 });
        },

        firstReveal(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 1, ease: 'circ.inOut' });

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 1, ease: 'circ.inOut' });

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 0, ease: 'circ.inOut' });

            return timeline;
        },
    },
};
