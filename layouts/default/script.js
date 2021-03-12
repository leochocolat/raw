// Vendor
import { mapGetters } from 'vuex';

export default {
    watch: {
        $route(to, from) {
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },
    },

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
            isDebug: 'context/isDebug',
        }),
    },

    mounted() {
        this.$store.dispatch('router/setCurrent', this.$route);
    },
};
