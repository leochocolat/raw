export default {
    props: ['data'],

    computed: {
        lang() {
            return this.$i18n.locale;
        },
    },

    mounted() {
        console.log(this.data);
    },
};
