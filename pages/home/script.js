// Vendor
import gsap from 'gsap';

// Mixins
import page from '@/mixins/page';

export default {
    name: '',

    mixins: [page],

    mounted() {
        this.$store.dispatch('scenes/setMenuScene', true);
    },

    methods: {
        /**
         * Public
         */
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

        /**
         * Private
         */
    },

    middleware({ app, redirect, query }) {
        if (query.debug !== undefined) return;
        return redirect(app.localePath('prototype'));
    },
};
