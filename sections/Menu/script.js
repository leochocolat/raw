// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            locale: this.$i18n.locale,
            isScrolling: false,
            hasScrolled: false,
        };
    },

    props: ['data', 'scene-entries'],

    computed: {
        ...mapGetters({
            isFullComplete: 'data/isComplete',
            isStopped: 'stop/isStopped',
        }),

        instruction() {
            let instruction = (this.isFullComplete || this.isStopped) ? this.data.instructionsComplete : this.data.instructionsMenu;
            if ((this.isFullComplete || this.isStopped) && (this.isScrolling || this.hasScrolled)) instruction = '';
            return instruction;
        },

        isFinalInstruction() {
            return (this.isFullComplete || this.isStopped);
        },
    },

    watch: {
        isStopped(isStopped) {
            if (isStopped) this.$store.dispatch('setInstructions', this.instruction);
        },

        isFullComplete(isFullComplete) {
            if (isFullComplete) this.$store.dispatch('setInstructions', this.instruction);
        },

        isFinalInstruction(isFinalInstruction) {
            if (isFinalInstruction) this.$store.dispatch('setFinalInstructions', true);
        },
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineOut?.kill();

            this.timelineIn = new gsap.timeline();

            this.timelineIn.call(() => {
                this.$store.dispatch('setInstructions', this.instruction);
                if (this.isFinalInstruction && !this.hasScrolled) this.$store.dispatch('setFinalInstructions', true);
            }, null);

            this.timelineIn.to(this.$refs.container, { duration: 0.1, alpha: 1 });
            this.timelineIn.add(this.$refs.screen0.transitionIn(), 0.1);
            this.timelineIn.add(this.$refs.screen1.transitionIn(), 0);
            this.timelineIn.add(this.$refs.screen2.transitionIn(), 0.2);
            this.timelineIn.add(this.$refs.screen3.transitionIn(), 0.3);

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineIn?.kill();
            this.timelineOut?.kill();

            this.timelineOut = new gsap.timeline();

            this.timelineOut.add(this.$refs.screen0.transitionOut(), 0.3);
            this.timelineOut.add(this.$refs.screen1.transitionOut(), 0.2);
            this.timelineOut.add(this.$refs.screen2.transitionOut(), 0);
            this.timelineOut.add(this.$refs.screen3.transitionOut(), 0.1);
            this.timelineOut.call(() => { this.$store.dispatch('setFinalInstructions', false); }, null, 0);

            return this.timelineOut;
        },

        setIsScrolling(bool) {
            this.isScrolling = bool;

            if (!this.hasScrolled && bool) this.hasScrolled = true;

            if (bool) this.$store.dispatch('setInstructions', '');
        },

        /**
         * Private
         */
    },
};
