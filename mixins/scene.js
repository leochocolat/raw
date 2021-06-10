// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

// Mixins
import page from '@/mixins/page';

export default {
    data() {
        return {
            lang: this.$i18n.locale,
            instruction: {
                en: 'Move your mouse to look around',
                fr: 'Bouger la souris pour regarder autour de vous',
            },
        };
    },

    mixins: [page],

    asyncData({ $api, route }) {
        const routeName = route.name.split('___')[0];
        return $api.getScenesEntries().then((response) => {
            return { scene: response[routeName] };
        });
    },

    computed: {
        ...mapGetters({
            isSceneComplete: 'data/isSceneComplete',
        }),

        isComplete() {
            return this.isSceneComplete(this.scene.id);
        },
    },

    methods: {
        transitionInit() {
            gsap.set(this.$el, { alpha: 0 });
        },

        firstReveal(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.call(this.setInstructions, 0);
            timeline.call(() => this.$store.dispatch('scenes/setMenuScene', false), 0);
            timeline.call(() => this.$store.dispatch('scenes/setActiveScene', this.$options.name), 0);
            timeline.to(this.$el, { duration: 0.1, alpha: 1, ease: 'circ.inOut' }, 2);
            timeline.add(this.$refs.screenActive.transitionIn(), 2);

            return timeline;
        },

        transitionIn(done, routeInfos) {
            const timeline = gsap.timeline({ onComplete: done });

            timeline.call(this.setInstructions, 0);
            timeline.call(() => this.$store.dispatch('scenes/setMenuScene', false), 0);
            timeline.call(() => this.$store.dispatch('scenes/setActiveScene', this.$options.name), 0);
            timeline.to(this.$el, { duration: 0.1, alpha: 1, ease: 'circ.inOut' }, 0.5);
            timeline.add(this.$refs.screenActive.transitionIn(), 0.5);

            return timeline;
        },

        transitionOut(done, routeInfos) {
            const timeline = gsap.timeline();

            timeline.add(this.$refs.screenActive.showRewindArrow(), 0);
            timeline.add(this.$refs.screenActive.rewindClock(), 0);
            timeline.add(this.$root.webglApp.sceneManager.scenes[this.scene.id].resetAnimationProgress(), 0);

            timeline.call(this.$root.webglApp.sceneManager.scenes[this.scene.id].resetScreenIsolation(), null, 0);
            timeline.call(this.$root.webglApp.sceneManager.scenes[this.scene.id].resetCameraFOV(), null, 0);

            timeline.add(this.$refs.screenActive.hideRewindArrow());

            timeline.add(this.$refs.screenActive.transitionOut(), 0);
            timeline.to(this.$el, { duration: 0.1, alpha: 0, ease: 'circ.inOut' }, 1);

            timeline.call(done, null);

            return timeline;
        },

        /**
         * Private
         */
        setInstructions() {
            this.$store.dispatch('setInstructions', this.instruction[this.lang]);
        },
    },
};
