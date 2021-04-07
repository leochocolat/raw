// Vendor
import gsap from 'gsap';

// Utils
import math from '@/utils/math';

export default {
    data() {
        return {
            activeIndex: 0,
        };
    },

    asyncData({ $api, store }) {
        const promises = [$api.getEntryById('5rjWV266TXZKdTaYcuht6i'), $api.getScenesEntries()];

        return Promise.all(promises).then((responses) => {
            const homeEntry = responses[0];
            const sceneEntries = responses[1];

            return {
                data: homeEntry.fields,
                sceneEntries,
            };
        });
    },

    mounted() {
        this.screens = [this.$refs.screen1, this.$refs.screen2, this.$refs.screen3, this.$refs.screen4, this.$refs.screen5];
        this.index = 0;
        this.activeScreen = this.screens[this.index];

        this.activeScreen.transitionIn();
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
        goToIndex(index) {
            const targetIndex = math.modulo(index, this.screens.length);
            const current = this.activeScreen;
            const target = this.screens[targetIndex];

            this.timelineIndex?.kill();

            this.timelineIndex = gsap.timeline();
            this.timelineIndex.add(current.transitionOut, 0);
            this.timelineIndex.call(
                () => {
                    this.activeIndex = targetIndex;
                    this.activeScreen = this.screens[targetIndex];
                },
                null,
                0.5
            );
            this.timelineIndex.add(target.transitionIn, 0.5);
        },

        /**
         * Handlers
         */
        clickHandler() {
            if (this.index === this.screens.length - 1) return;
            this.index++;
            this.goToIndex(this.index);
        },
    },
};
