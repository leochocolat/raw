// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import { mapGetters } from 'vuex';
import gsap from 'gsap';
import InertiaPlugin from '@/vendor/gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

export default {
    data() {
        return {
            isHome: this.getRouteBaseName() === 'index',
            globalCopy: null,
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

        '$i18n.locale'() {
            this.$fetch();
        },
    },

    fetch() {
        return this.$api.getEntryById('5tSa9edQQgQtt0iKf5OVGg').then((response) => {
            this.globalCopy = response.fields;
        });
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
