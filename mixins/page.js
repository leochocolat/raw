// Utils
import getPage from '@/utils/getPage';

export default {
    type: 'page',

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

            if (!routeInfos.previous && page && page.firstReveal) page.firstReveal(done, routeInfos);
            else if (page && page.transitionIn) page.transitionIn(done, routeInfos);
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
