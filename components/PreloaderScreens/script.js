// Vendor
import gsap from 'gsap';

// Utils
import math from '@/utils/math';

export default {
    data() {
        return {
            data: {},
            activeIndex: 0,
            intervalTime: 3000,
            isDisable: false,
            isComplete: false,
            isPreloaderComplete: false,
        };
    },

    watch: {
        '$i18n.locale'() {
            this.$fetch();
            this.restart();
        },
    },

    fetch() {
        return this.$api.getEntryById('5rjWV266TXZKdTaYcuht6i').then((response) => {
            this.data = response.fields;
        });
    },

    beforeDestroy() {
        this.killTimer();
    },

    methods: {
        /**
         * Public
         */
        start() {
            this.screens = [this.$refs.screen0, this.$refs.screen1, this.$refs.screen2, this.$refs.screen3, this.$refs.screen4];
            this.steps = ['cookies', 'warning', 'intro', 'instructions', 'stop'];
            this.activeIndex = 0;
            this.index = 0;
            this.activeScreen = this.screens[this.index];
            this.$store.dispatch('preloader/setStep', this.steps[this.index]);
            this.activeScreen.transitionIn();
            this.startTimer();
        },

        restart() {
            this.killTimer();
            this.activeScreen.transitionOut();
            this.start();
        },

        disable() {
            this.isDisable = true;
            this.$el.style.display = 'none';
            this.intervalTime = 1000;
            this.restart();
        },

        /**
         * Private
         */
        startTimer() {
            this.interval = setInterval(this.intervalHandler, this.intervalTime);
        },

        killTimer() {
            if (!this.interval) return;
            clearInterval(this.interval);
        },

        goToIndex(index) {
            const targetIndex = math.modulo(index, this.screens.length);
            const current = this.activeScreen;
            const target = this.screens[targetIndex];
            const step = this.steps[targetIndex];

            this.timelineIndex?.kill();

            this.timelineIndex = gsap.timeline();
            this.timelineIndex.add(current.transitionOut(), 0);
            this.timelineIndex.call(
                () => {
                    this.activeIndex = targetIndex;
                    this.activeScreen = this.screens[targetIndex];
                },
                null,
                0.5,
            );
            this.timelineIndex.add(target.transitionIn(), 0.5);
            this.timelineIndex.call(() => {
                this.$store.dispatch('preloader/setStep', step);
            }, null, 0.5);
        },

        /**
         * Handlers
         */
        intervalHandler() {
            if (this.index === this.screens.length - 1) {
                this.isCompleteHandler();
                return;
            };

            this.index++;
            this.goToIndex(this.index);
        },

        isCompleteHandler() {
            this.isComplete = true;
            this.killTimer();

            this.timelineComplete = new gsap.timeline();
            this.timelineComplete.add(this.activeScreen.transitionOut());
            this.timelineComplete.call(() => {
                this.activeIndex = null;
            }, null);

            if (this.isPreloaderComplete) {
                this.timelineComplete.call(this.$parent.start, null);
            }
        },
    },
};
