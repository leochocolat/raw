// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    props: ['data'],

    data() {
        return {
            lang: this.$i18n.locale,
        };
    },

    computed: {
        ...mapGetters({
            isOpen: 'stop/isOverlayOpen',
        }),
    },

    watch: {
        isOpen(isOpen) {
            if (isOpen) this.open();
            if (!isOpen) this.close();
        },
    },

    mounted() {

    },

    methods: {
        open() {
            this.timelineClose?.kill();
            this.timelineOpen = new gsap.timeline();

            this.timelineOpen.to(this.$el, 0.7, { autoAlpha: 1 }, 0);
        },

        close() {
            this.timelineOpen?.kill();
            this.timelineClose = new gsap.timeline();

            this.timelineClose.to(this.$el, 0.7, { autoAlpha: 0 }, 0);
        },

        clickNoHandler() {
            this.$store.dispatch('stop/closeOverlay');
        },

        clickYesHandler() {
            this.$store.dispatch('stop/closeOverlay');
        },
    },
};
