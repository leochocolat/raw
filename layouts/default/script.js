// Vendor
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            isPrototype: this.$route.name === 'prototype___fr' || this.$route.name === 'prototype___en',
        };
    },

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
