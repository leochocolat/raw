// Vendor
import { mapGetters } from 'vuex';

export default {
    props: ['data'],

    data() {
        return {
            lang: this.$i18n.locale,
        };
    },

    computed: {
        ...mapGetters({
            isSceneComplete: 'data/isSceneComplete',
        }),

        isComplete() {
            return this.isSceneComplete(this.data.id);
        },
    },

    mounted() {
        this.$refs.inputCensorship.transitionIn();
    },

    beforeDestroy() {

    },

    methods: {

    },
};
