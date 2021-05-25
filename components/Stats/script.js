export default {
    props: ['id', 'data'],

    data() {
        return {
            lang: this.$i18n.locale,
            title: {
                en: 'Statistics',
                fr: 'Statistiques',
            },
            subtitle: {
                en: 'User',
                fr: 'Utilisateur',
            },
        };
    },

    computed: {
        userId() {
            const id = this.data.censorshipData.inputs.length;
            const zeroFilled = ('000' + id).substr(-3);
            return zeroFilled;
        },

        statsLabels() {
            return this.data.stats.fields.labels;
        },

        stats() {
            const stat1 = ('00' + 0).substr(-2);
            const stat2 = ('00' + 1).substr(-2);
            const stat3 = ('00' + 2).substr(-2);
            const stat4 = ('00' + 3).substr(-2);

            return [stat1, stat2, stat3, stat4];
        },
    },
};
