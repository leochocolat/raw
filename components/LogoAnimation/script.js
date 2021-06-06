// Vendor
import lottie from 'lottie-web';

export default {
    props: ['autoplay'],

    mounted() {
        this.setupLottie();
    },

    beforeDestroy() {
        clearInterval(this.playInterval);
        this.lottie.destroy();
    },

    methods: {
        /**
         * Public
         */
        play() {
            this.lottie.goToAndPlay(0, true);
        },

        stop() {

        },

        /**
         * Private
         */
        setupLottie() {
            this.lottie = lottie.loadAnimation({
                container: this.$el,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: '/lottie/logo2.json',
            });

            if (this.autoplay) {
                const intervalTime = 1000;
                this.playInterval = setInterval(() => {
                    this.lottie.goToAndPlay(0, true);
                }, intervalTime);
            }
        },
    },
};
