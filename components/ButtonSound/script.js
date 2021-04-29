// Vendor
import gsap from 'gsap';

// Utils
import AudioManager from '@/utils/AudioManager';

export default {
    data() {
        return {
            lang: this.$i18n.locale,
            isMuted: false,
            soundLabel: {
                en: 'Sound',
                fr: 'Audio',
            },
        };
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            gsap.to(this.$el, { duration: 0.5, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.5, alpha: 0 });
        },

        /**
         * Private
         */
        clickHandler() {
            this.isMuted = !this.isMuted;

            if (this.isMuted) AudioManager.mute();
            if (!this.isMuted) AudioManager.unmute();
        },
    },
};
