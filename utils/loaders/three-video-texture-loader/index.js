import { Loader } from '../../resource-loader';
import { VideoTexture } from 'three';

class ThreeVideoTextureLoader extends Loader {
    /**
     * Public
     */
    load({ path, options }) {
        const video = document.createElement('video');
        video.setAttribute('autoplay', options.autoplay);
        video.setAttribute('loop', options.loop);
        video.setAttribute('muted', options.mutes);
        video.setAttribute('playsinline', options.playsinline);

        const promise = new Promise((resolve) => {
            video.addEventListener('canplay', () => {
                const videoTexture = new VideoTexture(video);
                resolve(videoTexture);
            });
        });

        video.src = path;

        return promise;
    }
}

export default ThreeVideoTextureLoader;
