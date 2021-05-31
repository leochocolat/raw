// Vendor
import gsap from 'gsap';

export default {
    props: ['scene'],

    data() {
        return {
            lang: this.$i18n.locale,
        };
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineOut?.kill();

            this.timelineIn = new gsap.timeline();
            this.timelineIn.to(this.$refs.square, { duration: 0.3, scale: 1, ease: 'power0.none' });

            this.timelineIn.to(this.$refs.content, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            this.timelineIn.to(this.$refs.content, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            this.timelineIn.to(this.$refs.content, { duration: 0.1, alpha: 1, color: 'white', ease: 'power0.none' });
            this.timelineIn.to(this.$refs.square, { duration: 0.1, borderColor: 'white', ease: 'power0.none' });

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineIn?.kill();

            this.timelineOut = new gsap.timeline();
            this.timelineOut.to(this.$refs.content, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            this.timelineOut.to(this.$refs.square, { duration: 0.3, scale: 0, ease: 'power0.none' }, 0.05);

            return this.timelineOut;
        },

        setOffRange(bool) {
            const timeline = new gsap.timeline();

            timeline.to(this.$refs.content, { duration: 0.1, color: 'red', ease: 'power0.none' }, 0);
            timeline.to(this.$refs.square, { duration: 0.1, borderColor: 'red', ease: 'power0.none' }, 0);

            timeline.to(this.$refs.content, { duration: 0.1, color: 'white', ease: 'power0.none' }, 0.1);
            timeline.to(this.$refs.square, { duration: 0.1, borderColor: 'white', ease: 'power0.none' }, 0.1);

            timeline.to(this.$refs.content, { duration: 0.1, color: 'red', ease: 'power0.none' }, 0.2);
            timeline.to(this.$refs.square, { duration: 0.1, borderColor: 'red', ease: 'power0.none' }, 0.2);

            timeline.to(this.$refs.content, { duration: 0.1, color: 'white', ease: 'power0.none' }, 0.3);
            timeline.to(this.$refs.square, { duration: 0.1, borderColor: 'white', ease: 'power0.none' }, 0.3);
        },
    },
};
