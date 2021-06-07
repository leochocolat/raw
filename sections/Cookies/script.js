// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import SplitText from '@/vendor/gsap/SplitText';
import gsap from 'gsap';

export default {
    props: ['data'],

    computed: {
        lang() {
            return this.$i18n.locale;
        },
    },

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
        refresh() {
            this.revertSplitText();
            this.setupSplitText();
        },

        transitionIn() {
            this.timelineIn = new gsap.timeline();

            this.timelineIn.set(this.$refs.paragraph, { alpha: 1 });

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

            this.timelineIn.to(this.$refs.button, { duration: 0.1, alpha: 1 });
            this.timelineIn.to(this.$refs.button, { duration: 0.1, alpha: 0 });
            this.timelineIn.to(this.$refs.button, { duration: 0.1, alpha: 1 });
            this.timelineIn.to(this.$refs.button, { duration: 0.1, alpha: 0 });
            this.timelineIn.to(this.$refs.button, { duration: 0.1, alpha: 1 });

            this.timelineIn.add(this.$refs.langSwitch.transitionIn(), 0.5);

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineOut = new gsap.timeline();

            this.timelineOut.add(this.$refs.langSwitch.transitionOut(), 0);
            this.timelineOut.to(this.$el, { duration: 0.1, alpha: 0 });
            this.timelineOut.to(this.$el, { duration: 0.1, alpha: 1 });
            this.timelineOut.to(this.$el, { duration: 0.1, autoAlpha: 0 });

            for (let i = 0; i < this.lines.length; i++) {
                const line = this.lines[i];
                const highlight = this.highlightings[i];
                const b = line.querySelectorAll('b');

                this.timelineOut.set(line, { color: 'transparent' });
                this.timelineOut.set(highlight, { transformOrigin: 'left top', scaleX: 0 });

                if (b.length > 0) {
                    this.timelineOut.set(b, { color: 'transparent' });
                }
            }

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

        removeEventListeners() {
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        clickHandler() {
            this.$parent.cookiesClickHandler();
        },

        resizeHandler() {
            this.revertSplitText();
        },
    },
};
