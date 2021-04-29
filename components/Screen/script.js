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
        };
    },

    computed: {
        ...mapGetters({
            isSceneComplete: 'data/isSceneComplete',
        }),

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

    mounted() {
        this.startClock();
    },

    beforeDestroy() {
        this.stopClock();
    },

    methods: {
        startClock() {
            this._clock = setInterval(this.clockHandler, 1000);
        },

        stopClock() {
            clearInterval(this._clock);
        },

        // Events
        mouseenterHandler() {
            this.timelineLeave?.kill();
            this.timelineEnter = new gsap.timeline();
            this.timelineEnter.to(this.$refs.frame.$el, { duration: 0.5, scaleY: 0.95, ease: 'circ.out' });
        },

        mouseleaveHandler() {
            this.timelineEnter?.kill();
            this.timelineLeave = new gsap.timeline();
            this.timelineLeave.to(this.$refs.frame.$el, { duration: 0.5, scaleY: 1, ease: 'circ.out' });
        },

        clickHandler() {
            // this.$router.push(this.id);
            // this.$store.dispatch('scenes/setActiveScene', this.id);
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
