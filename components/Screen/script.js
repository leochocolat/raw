// Assets
import ArrowDown from '@/assets/icons/arrow-down.svg?inline';

// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    props: ['id', 'data'],

    data() {
        return {
            lang: this.$i18n.locale,
            currentTime: new Date().getTime(),
            startTime: new Date().getTime(),
            duration: 0,
            callToAction: {
                fr: ['selectionner', 'la camera'],
                en: ['select', 'this camera'],
            },
            resultTitle: {
                fr: 'facteur de censure',
                en: 'Censorship factor',
            },
        };
    },

    computed: {
        ...mapGetters({
            isSceneComplete: 'data/isSceneComplete',
            sceneCensorshipFactor: 'data/sceneCensorshipFactor',
            isFullComplete: 'data/isComplete',
            isStopped: 'stop/isStopped',
        }),

        censorshipFactor() {
            return this.sceneCensorshipFactor(this.data.id);
        },

        isComplete() {
            return this.isSceneComplete(this.id);
        },

        time() {
            const date = new Date(this.data.startTime);
            date.setSeconds(date.getSeconds() + this.duration);
            return date.toLocaleTimeString('en-GB');
        },

        isDisable() {
            return this.getRouteBaseName() === this.id;
        },
    },

    beforeDestroy() {
        this.resetClock();
    },

    methods: {
        /**
         * Public
         */
        startClock() {
            this._clock = setInterval(this.clockHandler, 1000);
        },

        stopClock() {
            clearInterval(this._clock);
        },

        resetClock() {
            this.duration = 0;
            this.stopClock();
        },

        // Events
        mouseenterHandler() {
            if (!this.$refs.frame) return;

            this.timelineLeave?.kill();
            this.timelineEnter = new gsap.timeline();
            this.timelineEnter.to(this.$refs.frame.$el, { duration: 0.5, scaleY: 0.95, ease: 'circ.out' });
        },

        mouseleaveHandler() {
            if (!this.$refs.frame) return;

            this.timelineEnter?.kill();
            this.timelineLeave = new gsap.timeline();
            this.timelineLeave.to(this.$refs.frame.$el, { duration: 0.5, scaleY: 1, ease: 'circ.out' });
        },

        clockHandler() {
            this.currentTime = new Date().getTime();
            this.duration = (this.currentTime - this.startTime) / 1000;
        },
    },

    components: {
        ArrowDown,
    },
};
