export default {
    props: ['data'],

    mounted() {
        this.scrollPosition = window.scrollY;
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        setupEventListeners() {
            window.addEventListener('scroll', this.scrollHandler);
        },

        removeEventListeners() {
            window.removeEventListener('scroll', this.scrollHandler);
        },

        scrollHandler() {
            this.scrollPosition = window.scrollY;

            if (this.scrollPosition !== 0) {
                this.$store.dispatch('setInstructions', '');
            }
        },
    },
};
