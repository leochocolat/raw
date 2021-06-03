// Vendor
import gsap from 'gsap';
import SplitText from '@/vendor/gsap/SplitText';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
    props: ['data'],

    mounted() {
        this.scrollPosition = window.scrollY;
        this.scrollTriggerOffset = 0.2;

        this.setupSplitText();
        this.setupTriggers();
        this.setupIntersectionObserver();

        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
        this.intersectionObserver?.disconnect();
    },

    methods: {
        setupSplitText() {
            // Introduction
            this.introductionSplits = [];
            this.introductionLines = [];

            const introParagraphs = this.$refs.introductionTitle.querySelectorAll('p');
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

            const conclusionParagraphs = this.$refs.conclusionContent.querySelectorAll('p');
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
                { el: this.$refs.introductionTitle, callback: this.introductionTransitionIn, isTriggered: false },
                { el: this.$refs.conclusionContent, callback: this.conclusionTransitionIn, isTriggered: false },
                { el: this.$refs.credits.$el, callback: this.creditsTransitionIn, isTriggered: false },
            ];

            for (let i = 0; i < this.$refs.blocks.length; i++) {
                const element = this.$refs.blocks[i];
                const trigger = { el: element, callback: this.blockQuotesTransitionIn, isTriggered: false };
                this.triggers.push(trigger);
            }
        },

        setupIntersectionObserver() {
            const options = { threshold: 0.2 };

            this.intersectionObserver = new IntersectionObserver(this.observerHandler, options);

            for (let i = 0; i < this.triggers.length; i++) {
                const trigger = this.triggers[i];
                this.intersectionObserver.observe(trigger.el);
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

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
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

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });
                timeline.set(line, { color: 'white' });
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
            this.$refs.blocksQuotes[index].transitionIn();
            this.$refs.imageWebGl[index].transitionIn();
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

            if (this.scrollPosition !== 0) {
                this.$store.dispatch('setInstructions', '');
            }

            if (this.scrollPosition >= WindowResizeObserver.height * this.scrollTriggerOffset) {
                this.$parent.setIsScrolling(true);
            } else {
                this.$parent.setIsScrolling(false);
            }
        },

        observerHandler(entries) {
            const entry = entries[0];
            if (entry.isIntersecting) {
                for (let i = 0; i < this.triggers.length; i++) {
                    const trigger = this.triggers[i];
                    if (trigger.el === entry.target && !trigger.isTriggered) {
                        trigger.isTriggered = true;
                        trigger.callback(trigger);
                    }
                }
            }
        },

        resizeHandler() {
            // revert split text
            this.revertSplitText();
        },
    },
};
