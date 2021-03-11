// Vendor
import gsap from 'gsap';

// Mixins
import page from '@/mixins/page';

export default {
    name: 'supermarket',

    mixins: [page],

    mounted() {
        this.$store.dispatch('scenes/setActiveScene', this.$options.name);
        this.$store.dispatch('scenes/setMenuScene', false);
    },

    methods: {
        transitionInit() {
            gsap.set(this.$el, { alpha: 0 });
        },

        firstReveal(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.add(this.transitionIn, 0);

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
