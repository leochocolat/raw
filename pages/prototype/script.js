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
            const homeEntry = responses[0];
            const sceneEntries = responses[1];

            return {
                home: homeEntry,
                sceneEntries,
            };
        });
    },

    mounted() {

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

            timeline.to(this.$el, { duration: 0.1, alpha: 1, ease: 'circ.inOut' });
            timeline.add(this.$refs.menu.transitionIn());
            timeline.call(() => this.$store.dispatch('scenes/setMenuScene', true), null, 0);
            timeline.call(() => this.$store.dispatch('scenes/setActiveScene', ''), null, 0);

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.to(this.$el, { duration: 0.1, alpha: 1, ease: 'circ.inOut' }, 1);
            timeline.add(this.$refs.menu.transitionIn());
            timeline.call(() => this.$store.dispatch('scenes/setMenuScene', true), null, 0);
            timeline.call(() => this.$store.dispatch('scenes/setActiveScene', ''), null, 0);

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
