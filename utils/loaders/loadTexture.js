// Vendor
import { TextureLoader } from 'three';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

export default function load(resource, basePath) {
    resource.state = STATE_LOADING;

    const loader = new TextureLoader();
    const src = resource.path ? basePath + resource.path : resource.absolutePath;

    const promise = new Promise((resolve, reject) => {
        loader.load(
            src,
            (texture) => {
                resource.state = STATE_LOADED;
                resolve(texture);
            },
            null,
            reject
        );
    });

    return promise;
}
