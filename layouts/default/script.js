// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            isHome: this.getRouteBaseName() === 'index',
        };
    },

    watch: {
        $route(to, from) {
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },

        isReady(isReady) {
            if (isReady) this.$root.webglApp.start();
        },
    },

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
            isDebug: 'context/isDebug',
            isDevelopment: 'context/isDevelopment',
            isProduction: 'context/isProduction',
        }),
    },

    mounted() {
        WindowResizeObserver.setCanvasContainer(this.$refs.canvasSizeHelper);
        this.$store.dispatch('router/setCurrent', this.$route);

        // Remove preloader for quick debugging
        if (this.isHome || this.isDebug || !this.isProduction) {
            this.$refs.preloader.disable();
        }
    },
};
