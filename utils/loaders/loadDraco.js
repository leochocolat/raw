// Vendor
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Utils
import Stopwatch from '../Stopwatch';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

export default function loadDraco(resource, basePath) {
    resource.state = STATE_LOADING;
    const stopWatch = new Stopwatch();
    stopWatch.start();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(basePath + '/libs/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

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
