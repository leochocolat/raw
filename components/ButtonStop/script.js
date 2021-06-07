// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

export default {
    computed: {
        ...mapGetters({
            isStopOverlayOpen: 'stop/isOverlayOpen',
            isStopped: 'stop/isStopped',
        }),
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timeline = new gsap.timeline();
            timeline.to(this.$el, { duration: 0.1, alpha: 1 });
            timeline.to(this.$el, { duration: 0.1, alpha: 0 });
            timeline.to(this.$el, { duration: 0.1, alpha: 1 });
            timeline.to(this.$el, { duration: 0.1, alpha: 0 });
            timeline.to(this.$el, { duration: 0.1, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.5, alpha: 0 });
        },

        clickHandler() {
            if (this.isStopped) return;

            if (!this.isStopOverlayOpen) {
                this.$store.dispatch('stop/openOverlay');
            } else {
                this.$store.dispatch('stop/closeOverlay');
            }
        },
    },
};
