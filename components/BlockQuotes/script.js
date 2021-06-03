// Vendor
import gsap from 'gsap';
import SplitText from '@/vendor/gsap/SplitText';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
    props: ['data'],

    mounted() {
        this.setupEventListeners();
        this.setupSplitText();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timelineIn = new gsap.timeline();

            const stagger = 0.15;

            for (let i = 0; i < this.headingLines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.headingLines[i];
                const highlight = this.headingHighlightings[i];

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.3, scaleX: 0, ease: 'power0.none' });

                timelineIn.add(timeline, stagger * i);
            }

            for (let i = 0; i < this.$refs.blockQuote.length; i++) {
                const block = this.$refs.blockQuote[i];
                timelineIn.add(block.transitionIn(), 1 * i);
            }

            return timelineIn;
        },

        /**
         * Private
         */
        setupSplitText() {
            this.headingSplit = new SplitText(this.$refs.heading, { type: 'lines', linesClass: 'line' });
            this.headingLines = this.headingSplit.lines;

            this.headingSubLines = [];
            this.headingHighlightings = [];

            for (let i = 0; i < this.headingLines.length; i++) {
                const item = this.headingLines[i];

                // Wrap line
                const line = new SplitText(item, { type: 'lines', linesClass: 'subline' }).lines[0];
                line.style.display = 'inline-block';

                // Append highlight
                const div = document.createElement('div');
                div.classList.add('highlight');
                line.appendChild(div);
                this.headingHighlightings.push(div);
            }
        },

        reverSplitText() {
            this.headingSplit.revert();
        },

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        resizeHandler() {
            this.reverSplitText();
        },
    },
};
