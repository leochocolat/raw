// Vendor
import { mapGetters } from 'vuex';

// Utils
import getPage from '@/utils/getPage';

export default {
    type: 'page',

    computed: {
        ...mapGetters({
            isReady: 'preloader/isReady',
        }),
    },

    watch: {
        isReady(isReady) {
            if (isReady) this.__start();
        },
    },

    methods: {
        __start() {
            const routeInfos = {
                previous: this.$store.state.router.previous,
                current: this.$store.state.router.current,
            };

            this.firstReveal(null, routeInfos);
        },
    },

    transition: {
        appear: true,
        mode: 'out-in',
        css: false,

        beforeEnter(el) {
            const page = getPage(el.__vue__);
            if (page && page.transitionInit) page.transitionInit();
        },

        enter(el, done) {
            const page = getPage(el.__vue__);
            const routeInfos = {
                previous: this.$store.state.router.previous,
                current: this.$store.state.router.current,
            };

            // Handle first reveal with preloader
            // if (!routeInfos.previous && page && page.firstReveal) page.firstReveal(done, routeInfos);
            if (!routeInfos.previous) {
                done();
                return;
            };

            if (page && page.transitionIn) page.transitionIn(done, routeInfos);
            else done();
        },

        beforeLeave(el) {
            const page = getPage(el.__vue__);
        },

        leave(el, done) {
            const page = getPage(el.__vue__);
            const routeInfos = {
                previous: this.$store.state.router.previous,
                current: this.$store.state.router.current,
            };

            if (page && page.transitionOut) page.transitionOut(done, routeInfos);
            else done();
        },
    },
};
