// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

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

    computed: {
        ...mapGetters({
            isStopped: 'stop/isStopped',
            isComplete: 'data/isComplete',
        }),
    },

    mounted() {
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionInit() {
            // gsap.set(this.$el, { alpha: 0 });
        },

        firstReveal(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.add(this.$refs.menu.transitionIn());
            timeline.call(() => this.$store.dispatch('scenes/setMenuScene', true), null, 0);
            timeline.call(() => this.$store.dispatch('scenes/setActiveScene', ''), null, 0);

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.add(this.$refs.menu.transitionIn());
            timeline.call(() => this.$store.dispatch('scenes/setMenuScene', true), null, 0);
            timeline.call(() => this.$store.dispatch('scenes/setActiveScene', ''), null, 0);

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.add(this.$refs.menu.transitionOut());

            return timeline;
        },

        setIsScrolling(bool) {
            if (bool === this.isScrolling) return;

            if (this.isScrolling) this.$refs.menu.transitionIn();
            if (!this.isScrolling) this.$refs.menu.transitionOut();

            this.isScrolling = bool;
        },

        /**
         * Private
         */
        setupEventListeners() {
            window.addEventListener('scroll', this.scrollHandler);
        },

        removeEventListeners() {
            window.removeEventListener('scroll', this.scrollHandler);
        },

        scrollHandler() {
            this.$root.webglApp.scrollY = window.scrollY;
        },
    },
};
