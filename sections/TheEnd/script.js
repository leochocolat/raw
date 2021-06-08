// Vendor
import gsap from 'gsap';
import SplitText from '@/vendor/gsap/SplitText';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
    props: ['data'],

    data() {
        return {
            scrollPosition: 0,
        };
    },

    mounted() {
        this.scrollPosition = window.scrollY;
        this.scrollTriggerOffset = 0.2;

        this.setupSplitText();
        this.setupTriggers();

        this.setupScrollTrigger();
        this.detectElements();

        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        setupSplitText() {
            // Introduction
            this.introductionSplits = [];
            this.introductionLines = [];

            const introParagraphs = this.$refs.introductionTitle.querySelectorAll('p, h2');
            for (let i = 0; i < introParagraphs.length; i++) {
                const paragraph = introParagraphs[i];
                const split = new SplitText(paragraph, { type: 'lines', linesClass: 'line' });
                this.introductionSplits.push(split);
                this.introductionLines = [...this.introductionLines, ...split.lines];
            }

            this.introductionSubLines = [];
            this.introductionHighlightings = [];

            for (let i = 0; i < this.introductionLines.length; i++) {
                const item = this.introductionLines[i];

                // Wrap line
                const line = new SplitText(item, { type: 'lines', linesClass: 'subline' }).lines[0];
                line.style.display = 'inline-block';

                // Append highlight
                const div = document.createElement('div');
                div.classList.add('highlight');
                line.appendChild(div);
                this.introductionHighlightings.push(div);
            }

            // Conclusion
            this.conclusionSplits = [];
            this.conclusionLines = [];

            const conclusionParagraphs = this.$refs.conclusionContent.querySelectorAll('p, h2');
            for (let i = 0; i < conclusionParagraphs.length; i++) {
                const paragraph = conclusionParagraphs[i];
                const split = new SplitText(paragraph, { type: 'lines', linesClass: 'line' });
                this.conclusionSplits.push(split);
                this.conclusionLines = [...this.conclusionLines, ...split.lines];
            }

            this.conclusionSubLines = [];
            this.conclusionHighlightings = [];

            for (let i = 0; i < this.conclusionLines.length; i++) {
                const item = this.conclusionLines[i];

                // Wrap line
                const line = new SplitText(item, { type: 'lines', linesClass: 'subline' }).lines[0];
                line.style.display = 'inline-block';

                // Append highlight
                const div = document.createElement('div');
                div.classList.add('highlight');
                line.appendChild(div);
                this.conclusionHighlightings.push(div);
            }
        },

        revertSplitText() {
            for (let i = 0; i < this.introductionSplits.length; i++) {
                const splitInstance = this.introductionSplits[i];
                splitInstance.revert();
            }

            for (let i = 0; i < this.conclusionSplits.length; i++) {
                const splitInstance = this.conclusionSplits[i];
                splitInstance.revert();
            }
        },

        setupTriggers() {
            this.triggers = [
                { el: this.$refs.introductionTitle, callbackIn: this.introductionTransitionIn },
                { el: this.$refs.conclusionContent, callbackIn: this.conclusionTransitionIn },
                { el: this.$refs.credits.$el, callbackIn: this.creditsTransitionIn },
            ];

            for (let i = 0; i < this.$refs.blocks.length; i++) {
                const element = this.$refs.blocks[i];
                const trigger = { el: element, callbackIn: this.blockQuotesTransitionIn, callbackOut: this.blockQuotesTransitionOut, repeat: true, offset: 0.5 };
                this.triggers.push(trigger);
            }
        },

        setupScrollTrigger() {
            for (let i = 0; i < this.triggers.length; i++) {
                const trigger = this.triggers[i];
                const triggerOffset = trigger.offset || 0.2;
                const bounds = trigger.el.getBoundingClientRect();
                const offset = bounds.height * triggerOffset;
                const top = bounds.top + this.scrollPosition + offset;
                const bottom = bounds.bottom + this.scrollPosition - offset;

                trigger.top = top;
                trigger.bottom = bottom;
            }
        },

        detectElements() {
            const scrollTop = this.scrollPosition;
            const scrollBottom = scrollTop + WindowResizeObserver.height;

            for (let i = 0; i < this.triggers.length; i++) {
                const trigger = this.triggers[i];

                if (!trigger.inView) {
                    if ((scrollBottom >= trigger.top) && (scrollTop < trigger.bottom)) {
                        trigger.inView = true;
                        if (trigger.callbackIn) trigger.callbackIn(trigger);
                        if (!trigger.repeat) trigger.callbackIn = null;
                    }
                }

                if (trigger.inView) {
                    if ((scrollBottom < trigger.top) || (scrollTop > trigger.bottom)) {
                        trigger.inView = false;
                        if (trigger.callbackOut) trigger.callbackOut(trigger);
                        if (!trigger.repeat) trigger.callbackOut = null;
                    }
                }
            }
        },

        introductionTransitionIn() {
            this.timelineIntroductionIn?.kill();

            this.timelineIntroductionIn = new gsap.timeline();

            const stagger = 0.15;

            for (let i = 0; i < this.introductionLines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.introductionLines[i];
                const highlight = this.introductionHighlightings[i];
                const ba = line.querySelectorAll('b, a');

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
                if (ba.length > 0) timeline.set(ba, { color: 'red' });
                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.3, scaleX: 0, ease: 'power0.none' });

                this.timelineIntroductionIn.add(timeline, stagger * i);
            }
        },

        conclusionTransitionIn() {
            this.timelineConclusionIn?.kill();

            this.timelineConclusionIn = new gsap.timeline();

            const stagger = 0.15;

            for (let i = 0; i < this.conclusionLines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.conclusionLines[i];
                const highlight = this.conclusionHighlightings[i];
                const ba = line.querySelectorAll('b, a');

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
                if (ba.length > 0) timeline.set(ba, { color: 'red' });
                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.3, scaleX: 0, ease: 'power0.none' });

                this.timelineConclusionIn.add(timeline, stagger * i);
            }
        },

        creditsTransitionIn() {
            this.timelineCreditsIn = new gsap.timeline();

            this.timelineCreditsIn.add(this.$refs.credits.transitionIn(), 0);
        },

        blockQuotesTransitionIn(trigger) {
            const index = this.$refs.blocks.indexOf(trigger.el);
            if (!trigger.isTriggeredOnce) this.$refs.blocksQuotes[index].transitionIn();
            this.$refs.imageWebGl[index].transitionIn();
            trigger.isTriggeredOnce = true;
        },

        blockQuotesTransitionOut(trigger) {
            const index = this.$refs.blocks.indexOf(trigger.el);
            this.$refs.imageWebGl[index].transitionOut();
        },

        setupEventListeners() {
            window.addEventListener('scroll', this.scrollHandler);
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            window.removeEventListener('scroll', this.scrollHandler);
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        scrollHandler() {
            this.scrollPosition = window.scrollY;

            this.detectElements();

            if (this.scrollPosition >= WindowResizeObserver.height * this.scrollTriggerOffset) {
                this.$parent.setIsScrolling(true);
            } else {
                this.$parent.setIsScrolling(false);
            }
        },

        resizeHandler() {
            // revert split text
            this.revertSplitText();
            this.setupScrollTrigger();
            this.detectElements();
        },
    },
};
