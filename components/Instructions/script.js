// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            content: 'instructions',
        };
    },

    computed: {
        ...mapGetters({
            instructions: 'instructions',
            isFinalInstruction: 'isFinalInstruction',
        }),
    },

    watch: {
        instructions(instructions) {
            if (instructions === '') instructions = 'instructions';
            this.content = instructions;
        },

        isFinalInstruction(isFinalInstruction) {
            if (isFinalInstruction) this.blink();
            else this.stopBlink();
        },
    },

    mounted() {
        // this.blink();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline();
            this.timelineIn.to(this.$el, { duration: 0.1, alpha: 1 });
            this.timelineIn.to(this.$el, { duration: 0.1, alpha: 0 });
            this.timelineIn.to(this.$el, { duration: 0.1, alpha: 1 });
            this.timelineIn.to(this.$el, { duration: 0.1, alpha: 0 });
            this.timelineIn.to(this.$el, { duration: 0.1, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.1, alpha: 0 });
        },

        /**
         * Private
         */
        blink() {
            this.timelineIn?.kill();

            this.timelineShowBlink = new gsap.timeline();
            this.timelineShowBlink.to(this.$el, { duration: 0.1, alpha: 0 });
            this.timelineShowBlink.to(this.$el, { duration: 0.1, alpha: 1, color: 'red' });
            this.timelineShowBlink.to(this.$el, { duration: 0.1, alpha: 0 });
            this.timelineShowBlink.to(this.$el, { duration: 0.1, alpha: 1 });
            this.timelineShowBlink.to(this.$el, { duration: 0.1, alpha: 0 });
            this.timelineShowBlink.to(this.$el, { duration: 0.1, alpha: 1, color: 'white' });

            this.timelineBlink = new gsap.timeline({ repeat: -1 });
            this.timelineBlink.to(this.$el, { duration: 0.1, color: 'white' }, 0);
            this.timelineBlink.to(this.$el, { duration: 0.1, color: 'red' }, 0.5);
            this.timelineBlink.to(this.$el, { duration: 0.1, color: 'red' }, 1);

            this.timelineShowBlink.add(this.timelineBlink);
        },

        stopBlink() {
            this.timelineBlink?.kill();
            gsap.to(this.$el, { duration: 0.1, alpha: 1, color: 'white' });
        },
    },
};
