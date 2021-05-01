// Vendor
import gsap from 'gsap';

// Mixins
import page from '@/mixins/page';

export default {
    name: '',

    mixins: [page],

    asyncData({ $api }) {
        const promises = [
            $api.getEntryById('5rjWV266TXZKdTaYcuht6i'),
            $api.getScenesEntries(),
        ];

        return Promise.all(promises).then((responses) => {
            return {
                home: responses[0],
                sceneEntries: responses[1],
            };
        });
    },

    mounted() {
        this.$store.dispatch('scenes/setMenuScene', true);
        this.$store.dispatch('scenes/setActiveScene', '');
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
            timeline.add(this.$refs.menu.transitionIn());

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, 0.5, { alpha: 1, ease: 'circ.inOut' });
            timeline.add(this.$refs.menu.transitionIn());

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
};
