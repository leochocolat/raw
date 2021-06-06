// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import SplitText from '@/vendor/gsap/SplitText';
import gsap from 'gsap';

export default {
    data() {
        return {
            locale: this.$i18n.locale,
        };
    },

    props: ['data'],

    mounted() {
        this.setupSplitText();
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline();

            this.timelineIn.set(this.$refs.paragraph, { alpha: 1 });

            const stagger = 0.15;

            this.timelineIn.to(this.$refs.heading, { duration: 0.1, alpha: 1 });
            this.timelineIn.to(this.$refs.heading, { duration: 0.1, alpha: 0 });
            this.timelineIn.to(this.$refs.heading, { duration: 0.1, alpha: 1 });
            this.timelineIn.to(this.$refs.heading, { duration: 0.1, alpha: 0 });
            this.timelineIn.to(this.$refs.heading, { duration: 0.1, alpha: 1 });

            for (let i = 0; i < this.lines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.lines[i];
                const highlight = this.highlightings[i];

                timeline.to(highlight, { duration: 0.2, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.2, scaleX: 0, ease: 'power0.none' });

                this.timelineIn.add(timeline, stagger * i + 0.2);
            }

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineOut = new gsap.timeline();

            this.timelineOut.to(this.$el, 0.1, { alpha: 0 });

            return this.timelineOut;
        },

        /**
         * Private
         */
        setupSplitText() {
            this.split = new SplitText(this.$refs.paragraph, { type: 'lines', linesClass: 'line' });
            this.lines = this.split.lines;
            this.highlightings = [];

            for (let i = 0; i < this.lines.length; i++) {
                const item = this.lines[i];

                // Wrap line
                const line = new SplitText(item, { type: 'lines', linesClass: 'subline' }).lines[0];
                line.style.display = 'inline-block';

                // Append highlight
                const div = document.createElement('div');
                div.classList.add('highlight');
                line.appendChild(div);
                this.highlightings.push(div);
            }
        },

        revertSplitText() {
            this.split.revert();
        },

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListener() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        resizeHandler() {
            this.revertSplitText();
        },
    },
};
