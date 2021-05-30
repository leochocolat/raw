// Vendor
import gsap from 'gsap';
import Pizzicato from 'pizzicato';

// Constants
const VOLUME = 0.5;

class AudioManager {
    constructor() {
        this._tracks = {};
        this._current = null;
        this._isMuted = false;
    }

    /**
     * Public
     */
    add(name, track) {
        this._tracks[name] = track;
    }

    play(name, options) {
        const next = this._tracks[name];

        if (this._current === next) return;

        if (this._current) {
            this._current.pause();
        }

        this._current = next;
        this._current.loop = options.loop || false;
        this._current.volume = VOLUME;
        this._current.attack = 0.5;
        this._current.release = 2;
        this._current.play();
    }

    pause(name, options) {
        console.log('gello');
        const next = this._tracks[name];

        // if (this._current === next) return;

        // if (this._current) {
        //     this._current.pause();
        // }

        next.pause();

        gsap.to(next, { volume: 0, duration: 1 });
    }

    playEffect(name) {
        const track = this._tracks[name];
        track.volume = VOLUME;
        track.release = 2;
        track.stop();
        track.play();
    }

    stopEffect(name) {
        const track = this._tracks[name];
        track.stop();
    }

    toggleMute() {
        if (this._isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
        return this._isMuted;
    }

    mute() {
        if (this._isMuted) return;
        this._isMuted = true;
        gsap.to(Pizzicato, { volume: 0, duration: 1 });
    }

    unmute() {
        if (!this._isMuted) return;
        this._isMuted = false;
        gsap.to(Pizzicato, { volume: VOLUME, duration: 1 });
    }
}

export default new AudioManager();
