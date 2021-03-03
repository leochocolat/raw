// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebglApp from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            isDebug: 'context/isDebug',
            activeScene: 'scenes/active',
        }),
    },

    watch: {
        activeScene(newValue) {
            this.$root.webglApp.sceneManager.setActiveScene(newValue);
        },
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

        if (this.activeScene === '') return;
        this.$root.webglApp.sceneManager.setActiveScene(this.activeScene);
    },
};
