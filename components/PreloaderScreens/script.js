// Vendor
import gsap from 'gsap';

// Utils
import math from '@/utils/math';
import AudioManager from '@/utils/AudioManager';

export default {
    props: ['data'],

    data() {
        return {
            activeIndex: 0,
            intervalTime: 5500,
            isDisable: false,
            isComplete: false,
            isPreloaderComplete: false,
        };
    },

    beforeDestroy() {
        this.killTimer();
    },

    mounted() {
        this.start();
    },

    methods: {
        /**
         * Public
         */
        start() {
            this.screens = [this.$refs.cookies, ...this.$refs.context, this.$refs.warning, this.$refs.intro, this.$refs.instructions, this.$refs.stop, this.$refs.screenLogo];

            const contextSteps = [];
            for (let i = 0; i < this.$refs.context.length; i++) {
                contextSteps.push('context');
            }

            this.steps = ['cookies', ...contextSteps, 'warning', 'intro', 'instructions', 'stop', 'logo'];
            this.activeIndex = 0;
            this.index = 0;
            this.activeScreen = this.screens[this.index];
            this.$store.dispatch('preloader/setStep', this.steps[this.index]);
            this.activeScreen.transitionIn();
        },

        refresh() {
            for (let i = 0; i < this.screens.length; i++) {
                const screen = this.screens[i];
                if (screen.refresh) screen.refresh();
            }
        },

        restart() {
            this.killTimer();
            this.activeScreen.transitionOut();
            this.refresh();
            this.start();
            this.cookiesClickHandler();
        },

        disable() {
            this.isDisable = true;
            this.$el.style.display = 'none';
            this.intervalTime = 1000;
            this.restart();
        },

        cookiesClickHandler() {
            this.index++;
            this.goToIndex(this.index);
            this.startTimer();
            // this.startAudio();
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

        startAudio() {
            // AudioManager.add('audio_hallway', this._resources.get('audio_hallway'));
            // AudioManager.play('audio_hallway', { loop: true });
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
