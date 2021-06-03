// Vendor
import gsap from 'gsap';
import SplitText from '@/vendor/gsap/SplitText';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
    props: ['data'],

    mounted() {
        this.setupSplit();
        this.setupEventListeners();
    },

    beforeDestroy() {

    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timelineIn = new gsap.timeline();

            timelineIn.to(this.$refs.title, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            timelineIn.to(this.$refs.title, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            timelineIn.to(this.$refs.title, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            timelineIn.to(this.$refs.title, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            timelineIn.to(this.$refs.title, { duration: 0.1, alpha: 1, ease: 'power0.none' });

            timelineIn.to(this.$refs.line, { duration: 0.1, alpha: 1, ease: 'power0.none' });

            const stagger = 0.15;

            for (let i = 0; i < this.textLines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.textLines[i];
                const highlight = this.textHighlightings[i];

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.3, scaleX: 0, ease: 'power0.none' });

                timelineIn.add(timeline, stagger * i);
            }

            return timelineIn;
        },

        /**
         * Private
         */
        setupSplit() {
            // Introduction
            this.textSplit = [];
            this.textLines = [];

            const paragraphs = this.$refs.text.$el.querySelectorAll('p');
            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i];
                const split = new SplitText(paragraph, { type: 'lines', linesClass: 'line' });
                this.textSplit.push(split);
                this.textLines = [...this.textLines, ...split.lines];
            }

            this.textSubLines = [];
            this.textHighlightings = [];

            for (let i = 0; i < this.textLines.length; i++) {
                const item = this.textLines[i];

                // Wrap line
                const line = new SplitText(item, { type: 'lines', linesClass: 'subline' }).lines[0];
                line.style.display = 'inline-block';

                // Append highlight
                const div = document.createElement('div');
                div.classList.add('highlight');
                line.appendChild(div);
                this.textHighlightings.push(div);
            }
        },

        revertSplitText() {
            for (let i = 0; i < this.textSplit.length; i++) {
                const splitInstance = this.textSplit[i];
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
