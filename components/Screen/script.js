// Assets
import ArrowDown from '@/assets/icons/arrow-down.svg?inline';

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
    },

    components: {
        ArrowDown,
    },
};
