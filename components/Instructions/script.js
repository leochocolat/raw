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
        }),
    },

    watch: {
        instructions(instructions) {
            if (instructions === '') instructions = 'instructions';
            this.content = instructions;
        },
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
    },
};
