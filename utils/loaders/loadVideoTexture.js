// Vendor
import * as THREE from 'three';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

export default function loadVideoTexture(resource, basePath) {
    resource.state = STATE_LOADING;

    const video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('loop', true);

    const promise = new Promise((resolve) => {
        video.addEventListener('canplay', () => {
            resource.state = STATE_LOADED;
            resolve(resource);
        });
    });

    video.src = resource.path ? basePath + resource.path : resource.absolutePath;

    const videoTexture = new THREE.VideoTexture(video);
    resource.data = videoTexture;

    return promise;
}
