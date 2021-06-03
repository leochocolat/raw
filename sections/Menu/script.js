// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            locale: this.$i18n.locale,
        };
    },

    props: ['data', 'scene-entries'],

    computed: {
        ...mapGetters({
            isFullComplete: 'data/isComplete',
            isStopped: 'stop/isStopped',
        }),

        instruction() {
            const instruction = (this.isFullComplete || this.isStopped) ? this.data.instructionsComplete : this.data.instructionsMenu;
            return instruction;
        },
    },

    watch: {
        isStopped(isStopped) {
            if (isStopped) this.$store.dispatch('setInstructions', this.instruction);
        },

        isFullComplete(isFullComplete) {
            if (isFullComplete) this.$store.dispatch('setInstructions', this.instruction);
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

            this.timelineOut = new gsap.timeline();

            this.timelineOut.add(this.$refs.screen0.transitionOut(), 0.3);
            this.timelineOut.add(this.$refs.screen1.transitionOut(), 0.2);
            this.timelineOut.add(this.$refs.screen2.transitionOut(), 0);
            this.timelineOut.add(this.$refs.screen3.transitionOut(), 0.1);

            return this.timelineOut;
        },

        /**
         * Private
         */
    },
};
