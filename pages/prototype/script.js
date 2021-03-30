// Vendor
import gsap from 'gsap';

// Utils
import math from '@/utils/math';

export default {
    asyncData({ $api }) {
        return $api.getEntryById('5rjWV266TXZKdTaYcuht6i').then((response) => {
            return { data: response.fields };
        });
    },

    mounted() {
        this.index = 0;
        this.screens = [this.$refs.screen1, this.$refs.screen2, this.$refs.screen3, this.$refs.screen4];
        this.activeScreen = this.screens[this.index];

        this.activeScreen.transitionIn();
    },

    methods: {
        goToIndex(index) {
            const targetIndex = math.modulo(index, this.screens.length);
            const current = this.activeScreen;
            this.activeScreen = this.screens[targetIndex];
            const target = this.activeScreen;

            this.timelineIndex?.kill();

            this.timelineIndex = gsap.timeline();
            this.timelineIndex.add(current.transitionOut, 0);
            this.timelineIndex.add(target.transitionIn, 1);
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
