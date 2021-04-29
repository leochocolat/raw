// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebglApp from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            isDebug: 'context/isDebug',
            activeScene: 'scenes/active',
            menuState: 'scenes/menu',
        }),
    },

    watch: {
        activeScene(newValue) {
            if (!newValue) return;
            this.$root.webglApp.sceneManager?.setActiveScene(newValue);
        },

        menuState(newValue) {
            this.$root.webglApp.sceneManager?.setMenuState(newValue);
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
            debugSceneName: this.$route.query.scene,
        });

        this.$root.webglApp.sceneManager?.setMenuState(this.menuState);
        this.$root.webglApp.sceneManager?.setActiveScene(this.activeScene);
    },
};
