// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

export default {
    computed: {
        ...mapGetters({
            isStopOverlayOpen: 'stop/isOverlayOpen',
        }),
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            gsap.to(this.$el, { duration: 0.5, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.5, alpha: 0 });
        },

        clickHandler() {
            if (!this.isStopOverlayOpen) {
                this.$store.dispatch('stop/openOverlay');
            } else {
                this.$store.dispatch('stop/closeOverlay');
            }
        },
    },
};
