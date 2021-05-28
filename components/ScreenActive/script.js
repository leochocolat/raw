// Assets
import ArrowsRewind from '@/assets/icons/arrows-rewind.svg?inline';

// Vendor
import gsap from 'gsap';

export default {
    props: ['scene'],

    data() {
        return {
            lang: this.$i18n.locale,
            id: this.scene.id,
            currentTime: new Date().getTime(),
            startTime: new Date().getTime(),
            duration: 0,
        };
    },

    computed: {
        time() {
            const date = new Date(this.scene.startTime);
            date.setSeconds(date.getSeconds() + this.duration);
            return date.toLocaleTimeString('en-GB');
        },
    },

    mounted() {
        this.startClock();
    },

    beforeDestroy() {
        this.resetClock();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            return this.$refs.censorship.transitionIn();
        },

        transitionOut() {
            return this.$refs.censorship.transitionOut();
        },

        showRewindArrow() {
            this.timelineShowRewind = new gsap.timeline({
                repeat: -1,
                yoyo: true,
            });

            this.timelineShowRewind.to(this.$refs.rewindIcon, { duration: 0.2, alpha: 1 });

            return this.timelineShowRewind;
        },

        hideRewindArrow() {
            this.timelineHideRewind = new gsap.timeline();

            this.timelineHideRewind.call(() => { this.timelineShowRewind?.kill(); }, null, 0);
            this.timelineHideRewind.to(this.$refs.rewindIcon, { duration: 0.1, alpha: 0 }, 0);

            return this.timelineHideRewind;
        },

        startClock() {
            this._clock = setInterval(this.clockHandler, 1000);
        },

        stopClock() {
            clearInterval(this._clock);
        },

        resetClock() {
            this.duration = 0;
            this.stopClock();
        },

        // Evnets
        clockHandler() {
            this.currentTime = new Date().getTime();
            this.duration = (this.currentTime - this.startTime) / 1000;
        },
    },

    components: {
        ArrowsRewind,
    },
};
