// Vendor
import { mapGetters } from 'vuex';

// Utils
import DragManager from '@/utils/DragManager';
import clamp from '@/utils/math/clamp';

export default {
    props: ['data'],

    data() {
        return {
            lang: this.$i18n.locale,
            isSubmitting: false,
            isSent: false,
            newCensorshipFactor: this.$store.state.data.scenes[this.data.id].censorshipFactor || this.data.censorshipFactor,
            censorshipDelta: this.$store.state.data.scenes[this.data.id].censorshipDelta || 0,
        };
    },

    computed: {
        ...mapGetters({
            isSceneComplete: 'data/isSceneComplete',
        }),

        isComplete() {
            return this.isSceneComplete(this.data.id);
        },
    },

    mounted() {
        this.containerSize = this.$refs.container.getBoundingClientRect().width;
        this.cursorPosition = 0;
        this.setupEventListener();
        this.setCursorPosition();
    },

    beforeDestroy() {
        this.removeEventListener();
    },

    methods: {
        setCursorPosition() {
            this.cursorPosition = this.newCensorshipFactor * this.containerSize;
            this.$refs.cursor.style.transform = `translate3D(${this.cursorPosition}px, 0px, 0px)`;
        },

        updateCursorPos(event) {
            this.cursorPosition -= event.delta.x;
            this.$refs.cursor.style.transform = `translate3D(${clamp(this.cursorPosition, 0, this.containerSize - 10)}px, 0px, 0px)`;
        },

        updateCensorshipFactor() {
            const censorshipFactor = clamp(this.cursorPosition / this.containerSize, 0.01, 0.99);
            this.newCensorshipFactor = censorshipFactor;
        },

        updateCensorshipDelta() {
            this.censorshipDelta = this.newCensorshipFactor - this.data.censorshipFactor;
        },

        updateStore() {
            // Store
            this.$store.dispatch('data/setSceneCensorshipFactor', { id: this.data.id, value: this.newCensorshipFactor });
            this.$store.dispatch('data/setSceneCensorshipDelta', { id: this.data.id, value: this.censorshipDelta });
            this.$store.dispatch('data/setSceneComplete', { id: this.data.id, value: true });

            // Cookies
            this.$cookies.set('data', this.$store.state.data);
        },

        submitCensorship() {
            this.isSubmitting = true;

            this.$api
                .updateSceneCensorship(this.data.sysId, this.newCensorshipFactor)
                .then(() => {
                    this.isSent = true;
                    this.isSubmitting = false;
                    this.updateStore();
                    this.$router.push(this.localePath('prototype'));
                })
                .catch(() => {
                    this.isSubmitting = false;
                    throw new Error('Something went wrong while updating censorship data');
                });
        },

        /**
         * Events
         */
        setupEventListener() {
            this.dragManager = new DragManager({ el: this.$refs.cursor });
            this.dragManager.addEventListener('drag', this.dragHandler);
        },

        removeEventListener() {
            this.dragManager.close();
        },

        /**
         * Handlers
         */
        dragHandler(event) {
            if (this.isSubmitting || this.isSent) return;
            this.updateCursorPos(event);
            this.updateCensorshipFactor();
            this.updateCensorshipDelta();
        },

        clickSubmitHandler() {
            if (this.isSubmitting || this.isSent) return;
            this.submitCensorship();
        },
    },
};
