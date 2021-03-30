// Assets
import ArrowDown from '@/assets/icons/arrow-down.svg?inline';
import gsap from 'gsap';

export default {
    props: ['name'],

    data() {
        return {
            time: new Date().toLocaleTimeString('en-GB'),
        };
    },

    mounted() {
        this.startClock();
    },

    methods: {
        startClock() {
            setInterval(() => {
                this.time = new Date().toLocaleTimeString('en-GB');
            }, 1000);
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
    },

    components: {
        ArrowDown,
    },
};
