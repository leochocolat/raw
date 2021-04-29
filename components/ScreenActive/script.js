export default {
    props: ['scene'],

    mounted() {
        this.$refs.screen.startClock();
    },
};
