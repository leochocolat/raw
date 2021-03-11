// Vendor
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Utils
import Stopwatch from '../Stopwatch';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

export default function loadGltf(resource, basePath) {
    resource.state = STATE_LOADING;
    const stopWatch = new Stopwatch();
    stopWatch.start();

    const loader = new GLTFLoader();

    const promise = new Promise((resolve) => {
        loader.load(basePath + resource.path, (gltf) => {
            resource.state = STATE_LOADED;
            stopWatch.stop();
            resource.loadingDuration = `${stopWatch.duration}ms`;

            resource.data = gltf;
            resolve(resource);
        });
    });

    return promise;
}
