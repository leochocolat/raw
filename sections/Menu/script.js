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
            console.log('Hello');
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
            const timeline = new gsap.timeline();

            timeline.call(() => {
                this.$store.dispatch('setInstructions', this.instruction);
            }, null);

            timeline.add(this.$refs.screen0.transitionIn(), 0);
            timeline.add(this.$refs.screen1.transitionIn(), 0);
            timeline.add(this.$refs.screen2.transitionIn(), 0);
            timeline.add(this.$refs.screen3.transitionIn(), 0);

            return timeline;
        },

        /**
         * Private
         */
    },
};
