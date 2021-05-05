import { Loader } from '../../resource-loader';
import { VideoTexture } from 'three';

class ThreeVideoTextureLoader extends Loader {
    /**
     * Public
     */
    load({ path, options }) {
        const video = document.createElement('video');

        video.autoplay = options.autoplay;
        video.loop = options.loop;
        video.muted = options.muted;
        video.playsinline = options.playsinline;

        const promise = new Promise((resolve) => {
            video.addEventListener('canplay', () => {
                const videoTexture = new VideoTexture(video);
                video.play();
                resolve(videoTexture);
            });
        });

        video.src = path;

        return promise;
    }
}

export default ThreeVideoTextureLoader;
