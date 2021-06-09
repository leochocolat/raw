// Vendor
import gsap from 'gsap';

// Utils
import math from '@/utils/math';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default {
    props: ['scene'],

    data() {
        return {
            lang: this.$i18n.locale,
            cloningFactor: 1,
            speed: 0.5,
            allowScroll: false,
        };
    },

    computed: {
        messages() {
            const messages = this.scene.censorshipMessagesModerated.messages;

            return messages;
        },

        listAmountArray() {
            const array = [];
            for (let i = 0; i < this.cloningFactor; i++) {
                array.push(0);
            }

            return array;
        },
    },

    mounted() {
        this.offsetY = 0;

        this.getBounds();
        this.cloneMessages();
        this.setupEventListeners();

        // Debug
        // window.transitionIn = this.transitionIn;
        // window.transitionOut = this.transitionOut;
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineOut?.kill();

            this.timelineIn = new gsap.timeline();
            this.timelineIn.to(this.$refs.square, { duration: 0.3, scale: 1, ease: 'power0.none' });

            this.timelineIn.to(this.$refs.listContainer, { duration: 0.1, alpha: 1, ease: 'power0.none' });
            this.timelineIn.to(this.$refs.listContainer, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            this.timelineIn.to(this.$refs.listContainer, { duration: 0.1, alpha: 1, ease: 'power0.none' });

            this.timelineIn.call(() => { this.allowScroll = true; }, null, 0.5);

            return this.timelineIn;
        },

        transitionOut() {
            this.timelineIn?.kill();

            this.timelineOut = new gsap.timeline();
            this.timelineOut.to(this.$refs.listContainer, { duration: 0.1, alpha: 0, ease: 'power0.none' });
            this.timelineOut.to(this.$refs.square, { duration: 0.3, scale: 0, ease: 'power0.none' }, 0.05);
            this.timelineOut.call(() => { this.allowScroll = false; }, null, 0.5);

            return this.timelineOut;
        },

        /**
         * Private
         */
        getBounds() {
            this.bounds = this.$refs.container.getBoundingClientRect();

            this.listBounds = [];
            this.scrollHeight = 0;

            for (let i = 0; i < this.$refs.list.length; i++) {
                const list = this.$refs.list[i];
                const bounds = list.getBoundingClientRect();
                this.listBounds.push(bounds);
                this.scrollHeight = this.scrollHeight + bounds.height;
            }
        },

        cloneMessages() {
            this.cloningFactor = Math.ceil(this.bounds.height / this.scrollHeight) + 2;

            this.$nextTick(() => {
                this.getBounds();
                this.setStyle();
                this.allowScroll = true;
            });
        },

        setStyle() {
            this.initialPositionsY = [];

            for (let i = 0; i < this.$refs.list.length; i++) {
                const positionY = this.listBounds[i].y - this.bounds.y;
                const list = this.$refs.list[i];
                list.style.position = 'absolute';
                list.style.left = '0';
                list.style.top = '0';
                list.style.transform = `translateY(${positionY}px)`;
                list.style.width = '100%';
                this.initialPositionsY.push(positionY);
            }
        },

        resetStyle() {
            for (let i = 0; i < this.$refs.list.length; i++) {
                const positionY = this.listBounds[i].y - this.bounds.y;
                const list = this.$refs.list[i];
                list.style.position = 'relative';
                list.style.left = 'auto';
                list.style.top = 'auto';
                list.style.transform = 'translateY(0px)';
                list.style.width = '100%';
            }
        },

        updateListItemsPositions() {
            for (let i = 0; i < this.$refs.list.length; i++) {
                const list = this.$refs.list[i];

                // Position X
                const positionY = this.offsetY;
                const initialPositionY = this.initialPositionsY[i];
                const newPositionY = math.modulo(positionY + initialPositionY + this.listBounds[i].height, this.scrollHeight) - this.listBounds[i].height;
                list.style.transform = `translateY(${newPositionY}px)`;
            }
        },

        /**
         * Events
         */
        setupEventListeners() {
            gsap.ticker.add(this.tickHandler);
            WindowResizeObserver.addEventListener('resize', this.resizeHandler);
        },

        removeEventListeners() {
            gsap.ticker.remove(this.tickHandler);
            WindowResizeObserver.removeEventListener('resize', this.resizeHandler);
        },

        tickHandler() {
            if (!this.allowScroll) return;
            this.offsetY -= this.speed;

            this.updateListItemsPositions();
        },

        resizeHandler() {
            this.resetStyle();
            this.cloningFactor = 1;
            this.offsetY = 0;

            this.$nextTick(() => {
                this.getBounds();
                this.cloneMessages();
            });
        },

        mouseenterHandler() {
            gsap.to(this, { duration: 0.1, speed: 0 });
        },

        mouseleaveHandler() {
            gsap.to(this, { duration: 0.1, speed: 1 });
        },

        /**
         * Utils
         */
        userId(index) {
            const zeroFilled = ('000' + index).substr(-3);
            return zeroFilled;
        },
    },
};
