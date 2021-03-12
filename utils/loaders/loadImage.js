// Utils
import Stopwatch from '../Stopwatch';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

export default function load(resource, basePath) {
    resource.state = STATE_LOADING;
    const stopWatch = new Stopwatch();
    stopWatch.start();

    const image = new Image();
    image.crossOrigin = '';

    const promise = new Promise((resolve) => {
        image.onload = () => {
            resource.state = STATE_LOADED;
            stopWatch.stop();
            resource.loadingDuration = `${stopWatch.duration}ms`;

            resolve(resource);
        };
    });

    image.src = resource.path ? basePath + resource.path : resource.absolutePath;
    resource.data = image;

    return promise;
}
