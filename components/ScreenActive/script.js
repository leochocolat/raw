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

    // components: {
    //     ArrowDown,
    // },
};
