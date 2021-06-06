// Vendor
import gsap from 'gsap';
import SplitText from '@/vendor/gsap/SplitText';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
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

            const stagger = 0.15;

            for (let i = 0; i < this.lines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.lines[i];
                const highlight = this.highlightings[i];
                const b = line.querySelectorAll('b');

                timeline.to(highlight, { duration: 0.2, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });

                if (b.length > 0) {
                    timeline.set(b, { color: 'red' });
                }

                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.2, scaleX: 0, ease: 'power0.none' });

                this.timelineIn.add(timeline, stagger * i);
            }

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineOut = new gsap.timeline();

            this.timelineOut.to(this.$el, { duration: 0.1, alpha: 0 });

            return this.timelineOut;
        },

        /**
         * Private
         */
        setupSplitText() {
            // Introduction
            this.splits = [];
            this.lines = [];

            const paragraphs = this.$refs.paragraph.querySelectorAll('p');
            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i];
                const split = new SplitText(paragraph, { type: 'lines', linesClass: 'line' });
                this.splits.push(split);
                this.lines = [...this.lines, ...split.lines];
            }

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
            for (let i = 0; i < this.splits.length; i++) {
                const splitInstance = this.splits[i];
                splitInstance.revert();
            }
        },

        setupEventListeners() {
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        resizeHandler() {
            this.revertSplitText();
        },
    },
};
