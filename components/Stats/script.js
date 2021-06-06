// Vendor
import gsap from 'gsap';
import { mapGetters } from 'vuex';

export default {
    props: ['id', 'data'],

    data() {
        return {
            isVisible: false,
            lang: this.$i18n.locale,
            title: {
                en: 'Statistics',
                fr: 'Statistiques',
            },
            subtitle: {
                en: 'User',
                fr: 'Utilisateur',
            },
        };
    },

    computed: {
        ...mapGetters({
            sceneCensorshipFactor: 'data/sceneCensorshipFactor',
            sceneData: 'data/sceneData',
        }),

        censorshipFactor() {
            return this.sceneCensorshipFactor(this.id);
        },

        previousCensorship() {
            return this.sceneData(this.id).initalCensorshipFactor;
        },

        newCensorshipFactor() {
            return this.sceneData(this.id).censorshipNewFactor;
        },

        userId() {
            const id = this.data.censorshipData.inputs.length;
            const zeroFilled = ('000' + id).substr(-3);
            return zeroFilled;
        },

        statsLabels() {
            return this.data.stats.fields.labels;
        },

        stats() {
            const previousCensorship = Math.round(this.previousCensorship * 100);
            const userCensorship = Math.round(this.censorshipFactor * 100);
            const newCensorship = Math.round(this.newCensorshipFactor * 100);
            const influence = previousCensorship - newCensorship;

            const stat1 = previousCensorship ? ('00' + previousCensorship).substr(-2) + '%' : '-';
            const stat2 = userCensorship ? ('00' + userCensorship).substr(-2) + '%' : '-';
            const stat3 = newCensorship ? ('00' + newCensorship).substr(-2) + '%' : stat1;
            const stat4 = influence ? Math.sign(influence) * ('00' + influence).substr(-2) + '%' : '00%';

            return [stat1, stat2, stat3, stat4];
        },
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            const timelineShow = new gsap.timeline();
            const delay = Math.random() * 0.5;

            timelineShow.call(() => {
                this.isVisible = true;
            }, null, 0);

            timelineShow.to(this.$refs.title, { duration: 0.1, alpha: 1 }, delay);
            timelineShow.to(this.$refs.subtitle, { duration: 0.1, alpha: 1 }, delay);

            timelineShow.to(this.$refs.title, { duration: 0.1, alpha: 0 }, delay + 0.1);
            timelineShow.to(this.$refs.subtitle, { duration: 0.1, alpha: 0 }, delay + 0.1);

            timelineShow.to(this.$refs.title, { duration: 0.1, alpha: 1 }, delay + 0.2);
            timelineShow.to(this.$refs.subtitle, { duration: 0.1, alpha: 1 }, delay + 0.2);

            const stagger = 0.15;

            for (let i = 0; i < this.$refs.highlight.length; i++) {
                const timeline = gsap.timeline();

                const title = this.$refs.statTitle[i];
                const stat = this.$refs.stat[i];
                const highlight = this.$refs.highlight[i];

                timeline.to(highlight, { duration: 0.3, scaleX: 1, ease: 'power0.none' });

                timeline.set(title, { color: 'white' });

                if (stat.classList.contains('red')) {
                    timeline.set(stat, { color: 'red' });
                } else {
                    timeline.set(stat, { color: 'white' });
                }

                timeline.set(highlight, { transformOrigin: 'right top' });
                timeline.to(highlight, { duration: 0.3, scaleX: 0, ease: 'power0.none' });

                timelineShow.add(timeline, stagger * i + delay);
            }

            return timelineShow;
        },
    },
};
