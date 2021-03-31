// Assets
import ArrowDown from '@/assets/icons/arrow-down.svg?inline';

// Vendor
import { mapGetters } from 'vuex';
import gsap from 'gsap';

export default {
    props: ['id'],

    data() {
        return {
            currentTime: new Date().getTime(),
            startTime: new Date().getTime(),
            duration: 0,
        };
    },

    computed: {
        ...mapGetters({
            entryById: 'data/entryById',
        }),

        entry() {
            const entry = this.entryById(this.id);
            return entry;
        },

        time() {
            const entry = this.entryById(this.id);
            const date = new Date(entry.startTime);
            date.setSeconds(date.getSeconds() + this.duration);
            return date.toLocaleTimeString('en-GB');
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
            this.$store.dispatch('scenes/setActiveScene', 'hallway');
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
