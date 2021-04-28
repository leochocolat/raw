// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            isPrototype: this.getRouteBaseName() === 'prototype',
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
        this.$root.footer = this.$refs.footer;
        WindowResizeObserver.setCanvasContainer(this.$refs.canvasSizeHelper);
        this.$store.dispatch('router/setCurrent', this.$route);

        if (this.isPrototype || this.isDebug) {
            this.$refs.preloader.disable();
        }
    },
};
