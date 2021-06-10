// Vendor
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import SplitText from '@/vendor/gsap/SplitText';
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    props: ['data'],

    data() {
        return {
            lang: this.$i18n.locale,
            previousInstructions: null,
            instruction: {
                en: 'Press escape to exit',
                fr: 'Appuyez sur échappe pour quitter',
            },
        };
    },

    computed: {
        ...mapGetters({
            isOpen: 'stop/isOverlayOpen',
            isStopped: 'stop/isStopped',
            instructions: 'instructions',
        }),
    },

    watch: {
        isOpen(isOpen) {
            if (isOpen) this.open();
            if (!isOpen) this.close();
        },

        instructions(current, previous) {
            this.previousInstructions = previous;
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
        open() {
            this.timelineClose?.kill();
            this.timelineOpen = new gsap.timeline();

            this.timelineOpen.to(this.$el, 0.1, { autoAlpha: 1 }, 0);

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

                this.timelineOpen.add(timeline, stagger * i);
            }

            this.timelineOpen.to(this.$refs.buttonContainer, { duration: 0.1, alpha: 1 });
            this.timelineOpen.to(this.$refs.buttonContainer, { duration: 0.1, alpha: 0 });
            this.timelineOpen.to(this.$refs.buttonContainer, { duration: 0.1, alpha: 1 });
            this.timelineOpen.to(this.$refs.buttonContainer, { duration: 0.1, alpha: 0 });
            this.timelineOpen.to(this.$refs.buttonContainer, { duration: 0.1, alpha: 1 });

            this.timelineOpen.call(this.showInstructions, null, 0);
        },

        close() {
            this.timelineOpen?.kill();
            this.timelineClose = new gsap.timeline();

            this.timelineClose.to(this.$el, 0.1, { autoAlpha: 0 }, 0);
            this.timelineClose.set(this.$refs.buttonContainer, { alpha: 0 });

            for (let i = 0; i < this.lines.length; i++) {
                const timeline = gsap.timeline();

                const line = this.lines[i];
                const highlight = this.highlightings[i];
                const b = line.querySelectorAll('b');

                timeline.set(line, { color: 'transparent' });
                if (b.length > 0) timeline.set(b, { color: 'transparent' });
                timeline.set(highlight, { transformOrigin: 'left top' });
                timeline.set(highlight, { scaleX: 0, ease: 'power0.none' });

                this.timelineClose.add(timeline, 0);
            }

            this.timelineClose.call(this.hideInstructions, null, 0);
        },

        showInstructions() {
            this.$store.dispatch('setInstructions', this.instruction[this.lang]);
        },

        hideInstructions() {
            if (this.previousInstructions === this.instruction[this.lang]) return;
            this.$store.dispatch('setInstructions', this.previousInstructions);
        },

        setupSplitText() {
            this.splits = [];
            this.lines = [];

            const paragraphs = this.$el.querySelectorAll('p');
            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i];
                if (paragraph.innerHTML === '') continue;
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
            window.addEventListener('keydown', this.keydownHandler);
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            window.removeEventListener('keydown', this.keydownHandler);
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        clickNoHandler() {
            this.$store.dispatch('stop/closeOverlay');
        },

        clickYesHandler() {
            this.$store.dispatch('stop/closeOverlay');
            this.$store.dispatch('stop/stop');

            if (this.getRouteBaseName() !== 'prototype') {
                this.$router.push(this.localePath('prototype'));
            }

            this.$cookies.set('stop', true, {
                // One month
                expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
                maxAge: 1000 * 3600 * 24 * 30,
            });

            // Apply maximum blur on every scenes
            // TODO: Store in cookies
            const scenes = this.$root.webglApp.sceneManager.scenes;
            for (const key in scenes) {
                scenes[key].censorshipFactor = 1;
            }
        },

        keydownHandler(e) {
            if (!this.isOpen) return;

            if (e.key === 'Escape') {
                this.$store.dispatch('stop/closeOverlay');
            }
        },

        resizeHandler() {
            this.revertSplitText();
        },
    },
};
