// Vendor
import { mapGetters } from 'vuex';

// Utils
import DragManager from '@/utils/DragManager';
import clamp from '@/utils/math/clamp';

export default {
    computed: {
        ...mapGetters({
            entryById: 'data/entryById',
        }),

        entry() {
            const entry = this.entryById('hallway');
            return entry;
        },

        censorshipFactor() {
            const entry = this.entryById('hallway');
            const censorship = entry.censorshipFactor;
            return censorship;
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
            this.cursorPosition = this.censorshipFactor * this.containerSize;
            this.$refs.cursor.style.transform = `translate3D(${this.cursorPosition}px, 0px, 0px)`;
        },

        updateCursorPos(event) {
            this.cursorPosition -= event.delta.x;
            this.$refs.cursor.style.transform = `translate3D(${clamp(this.cursorPosition, 0, this.containerSize - 10)}px, 0px, 0px)`;
        },

        updateCensorshipFactor() {
            const censorshipFactor = clamp(this.cursorPosition / this.containerSize, 0.01, 0.99);
            this.$store.dispatch('data/setSceneCensorshipFactor', { id: 'hallway', value: censorshipFactor });
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
            this.updateCursorPos(event);
            this.updateCensorshipFactor();
        },

        clickSubmitHandler() {
            this.$api.updateSceneCensorship('hallway', this.censorshipFactor);
        },
    },
};
