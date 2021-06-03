// Vendor
import gsap from 'gsap';

export default {
    props: ['data'],

    computed: {
        lang() {
            return this.$i18n.locale;
        },
    },

    mounted() {
        this.setupHighlighting();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timelineIn = new gsap.timeline();

            timelineIn.to(this.$refs.spanTitle, 0.1, { alpha: 1 });
            timelineIn.to(this.$refs.spanTitle, 0.1, { alpha: 0 });
            timelineIn.to(this.$refs.spanTitle, 0.1, { alpha: 1 });
            timelineIn.to(this.$refs.spanTitle, 0.1, { alpha: 0 });
            timelineIn.to(this.$refs.spanTitle, 0.1, { alpha: 1 });

            // Blink
            for (let i = 0; i < this.$refs.name.length; i++) {
                const timeline = gsap.timeline();

                const stagger = 0.15;

                const name = this.$refs.name[i];

                timeline.to(name, { duration: 0.1, alpha: 1 });
                timeline.to(name, { duration: 0.1, alpha: 0 });
                timeline.to(name, { duration: 0.1, alpha: 1 });
                timeline.to(name, { duration: 0.1, alpha: 0 });
                timeline.to(name, { duration: 0.1, alpha: 1 });

                timelineIn.add(timeline, stagger * i);
            }

            for (let i = 0; i < this.roleHighlights.length; i++) {
                const timeline = gsap.timeline();

                const stagger = 0.15;

                const role = this.$refs.role[i];
                const highlight = this.roleHighlights[i];

                timeline.to(highlight, { duration: 0.2, scaleX: 1, ease: 'power0.none' });
                timeline.set(role, { color: 'white' });
                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.2, scaleX: 0, ease: 'power0.none' });

                timelineIn.add(timeline, stagger * i);
            }

            return timelineIn;
        },

        /**
         * Private
         */
        setupHighlighting() {
            this.roleHighlights = [];

            for (let i = 0; i < this.$refs.role.length; i++) {
                const element = this.$refs.role[i];
                const div = document.createElement('div');
                div.classList.add('highlight');
                element.appendChild(div);
                this.roleHighlights.push(div);
            }
        },
    },
};
