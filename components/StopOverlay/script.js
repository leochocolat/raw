// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    props: ['data'],

    data() {
        return {
            lang: this.$i18n.locale,
            previousInstructions: null,
            instruction: {
                en: 'Press escape to exit',
                fr: 'Appuyez sur échappe pour quitter',
            },
        };
    },

    computed: {
        ...mapGetters({
            isOpen: 'stop/isOverlayOpen',
            isStopped: 'stop/isStopped',
            instructions: 'instructions',
        }),
    },

    watch: {
        isOpen(isOpen) {
            if (isOpen) this.open();
            if (!isOpen) this.close();
        },

        instructions(current, previous) {
            this.previousInstructions = previous;
        },
    },

    mounted() {
        console.log(this.instructions);
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        open() {
            this.timelineClose?.kill();
            this.timelineOpen = new gsap.timeline();

            this.timelineOpen.to(this.$el, 0.1, { autoAlpha: 1 }, 0);
            this.timelineOpen.call(this.showInstructions, null);
        },

        close() {
            this.timelineOpen?.kill();
            this.timelineClose = new gsap.timeline();

            this.timelineClose.to(this.$el, 0.1, { autoAlpha: 0 }, 0);
            this.timelineClose.call(this.hideInstructions, null);
        },

        showInstructions() {
            this.$store.dispatch('setInstructions', this.instruction[this.lang]);
        },

        hideInstructions() {
            this.$store.dispatch('setInstructions', this.previousInstructions);
        },

        setupEventListeners() {
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            window.removeEventListener('keydown', this.keydownHandler);
        },

        clickNoHandler() {
            this.$store.dispatch('stop/closeOverlay');
        },

        clickYesHandler() {
            this.$store.dispatch('stop/closeOverlay');
            this.$store.dispatch('stop/stop');
            this.$store.dispatch('data/stop');

            this.$cookies.set('stop', true, {
                // One month
                expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
                maxAge: 1000 * 3600 * 24 * 30,
            });
        },

        keydownHandler(e) {
            if (!this.isOpen) return;

            if (e.key === 'Escape') {
                this.$store.dispatch('stop/closeOverlay');
            }
        },
    },
};
