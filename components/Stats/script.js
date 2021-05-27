// Vendor
import { mapGetters } from 'vuex';

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
        ...mapGetters({
            sceneCensorshipFactor: 'data/sceneCensorshipFactor',
            sceneData: 'data/sceneData',
        }),

        censorshipFactor() {
            return this.sceneCensorshipFactor(this.id);
        },

        previousCensorship() {
            return this.sceneData(this.id).initalCensorshipFactor;
        },

        newCensorshipFactor() {
            return this.sceneData(this.id).censorshipNewFactor;
        },

        userId() {
            const id = this.data.censorshipData.inputs.length;
            const zeroFilled = ('000' + id).substr(-3);
            return zeroFilled;
        },

        statsLabels() {
            return this.data.stats.fields.labels;
        },

        stats() {
            const previousCensorship = Math.round(this.previousCensorship * 100);
            const userCensorship = Math.round(this.censorshipFactor * 100);
            const newCensorship = Math.round(this.newCensorshipFactor * 100);
            const influence = previousCensorship - newCensorship;

            const stat1 = previousCensorship ? ('00' + previousCensorship).substr(-2) + '%' : '-';
            const stat2 = userCensorship ? ('00' + userCensorship).substr(-2) + '%' : '-';
            const stat3 = newCensorship ? ('00' + newCensorship).substr(-2) + '%' : stat1;
            const stat4 = influence ? Math.sign(influence) * ('00' + influence).substr(-2) + '%' : '00%';

            return [stat1, stat2, stat3, stat4];
        },
    },
};
