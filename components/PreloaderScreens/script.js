// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

// utils
import ResourceLoader from '@/utils/resource-loader';
import AudioManager from '@/utils/AudioManager';

export default {
    props: ['data'],

    data() {
        return {
            isHome: this.getRouteBaseName() === 'index',
            activeIndex: 0,
            isComplete: false,
            isPreloaderComplete: false,
            key: 0,
        };
    },

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
            isDebug: 'context/isDebug',
            isDevelopment: 'context/isDevelopment',
            isProduction: 'context/isProduction',
        }),

        isDisable() {
            return this.isHome || this.isDebug || !this.isProduction;
        },
    },

    mounted() {
        if (this.isDisable) {
            this.disable();
        } else {
            this.start();
        }
    },

    beforeDestroy() {
        this.timelineDiaporama?.kill();
    },

    methods: {
        /**
         * Public
         */
        start() {
            const context = this.$refs.context || [];
            this.screens = [...context, this.$refs.warning, this.$refs.instructions, this.$refs.stop, this.$refs.screenLogo];

            const contextSteps = [];
            for (let i = 0; i < this.$refs.context.length; i++) {
                contextSteps.push('context');
            }

            this.steps = [...contextSteps, 'warning', 'instructions', 'stop', 'logo'];

            this.$refs.cookies.transitionIn();
            this.$store.dispatch('preloader/setStep', 'cookies');
        },

        startAnimation() {
            this.timelineDiaporama = new gsap.timeline({ onComplete: this.isCompleteHandler });

            let delay = 0;

            for (let i = 0; i < this.screens.length; i++) {
                const screen = this.screens[i];
                this.timelineDiaporama.add(screen.transitionIn(), delay);
                this.timelineDiaporama.call(() => { this.$store.dispatch('preloader/setStep', this.steps[i]); }, null, delay);
                if (this.isDisable) {
                    delay += 0.1;
                } else {
                    delay += screen.duration;
                }
                this.timelineDiaporama.add(screen.transitionOut(), delay);
            }
        },

        playMainSound() {
            ResourceLoader.load('audio_main').then((audio) => {
                AudioManager.add('audio_main', audio);
                AudioManager.play('audio_main', { loop: true });
            });
        },

        refresh() {
            if (!this.screens) return;
            for (let i = 0; i < this.screens.length; i++) {
                const screen = this.screens[i];
                if (screen.refresh) screen.refresh();
                screen.transitionOut();
            }
        },

        disable() {
            this.$el.style.display = 'none';
            this.start();
            this.cookiesClickHandler();
        },

        cookiesClickHandler() {
            this.$refs.cookies.transitionOut();
            this.startAnimation();
            this.playMainSound();
        },

        /**
         * Handlers
         */
        isCompleteHandler() {
            this.isComplete = true;

            this.timelineComplete = new gsap.timeline();
            this.timelineComplete.call(() => {
                this.activeIndex = null;
            }, null);
            if (this.isPreloaderComplete) {
                this.timelineComplete.call(this.$parent.start, null);
            }
        },
    },
};
