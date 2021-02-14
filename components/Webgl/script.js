// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebglApp from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            isDebug: 'context/isDebug',
        }),
    },

    beforeDestroy() {
        this.$root.webglApp.destroy();
    },

    mounted() {
        this.$root.webglApp = new WebglApp({
            canvas: this.$el,
            nuxtRoot: this.$root,
            isDebug: this.isDebug,
        });
    },
};
