// Vendor
import FontFaceObserver from 'fontfaceobserver';

// Utils
import Stopwatch from '../Stopwatch';
// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

export default function loadFont(resource) {
    resource.state = STATE_LOADING;
    const stopWatch = new Stopwatch();
    stopWatch.start();

    const observer = new FontFaceObserver(resource.name, {
        weight: resource.weight,
    });

    const promise = new Promise((resolve) => {
        observer.load().then(() => {
            console.log('fini');
            resource.state = STATE_LOADED;
            stopWatch.stop();
            resource.loadingDuration = `${stopWatch.duration}ms`;
            resolve(resource);
        });
    });

    return promise;
}
