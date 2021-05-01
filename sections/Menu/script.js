export default {
    data() {
        return {
            locale: this.$i18n.locale,
        };
    },

    props: ['data', 'scene-entries'],

    mounted() {
        this.$store.dispatch('setInstructions', this.data.instructionsMenu);
    },
};
