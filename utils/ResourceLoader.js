// Vendor
import FontFaceObserver from 'fontfaceobserver';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Utils
import EventDispatcher from '@/utils/EventDispatcher';
import Stopwatch from '@/utils/Stopwatch';
import resources from '@/resources';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

// Cache
const cache = [];

export default class ResourceLoader extends EventDispatcher {
    constructor(resources, basePath) {
        super();

        this._resources = this._deepClone(resources);
        this._basePath = basePath;
        this._allAssetsLoaded = false;
        this._loadResources();
    }

    /**
     * Static
     */
    static get(name) {
        const resource = this._getResourceByName(name);
        return resource.data;
    }

    static _getResourceByName(name) {
        for (let i = 0, len = cache.length; i < len; i++) {
            if (cache[i].name === name) return cache[i];
        }
        return undefined;
    }

    /**
     * Private
     */
    _deepClone(array) {
        return JSON.parse(JSON.stringify(array));
    }

    _loadResources() {
        for (let i = 0, len = this._resources.length; i < len; i++) {
            this._loadResource(this._resources[i]);
        }
    }

    _loadResource(resource) {
        switch (resource.type) {
            case 'image':
                this._loadImage(resource);
                break;
            case 'font':
                this._loadFont(resource);
                break;
            case 'gltf':
            case 'glb':
                return this._loadGltf(resource);
        }
    }

    _checkResourcesStatus() {
        for (let i = 0, len = this._resources.length; i < len; i++) {
            if (this._resources[i].state === STATE_LOADING) {
                return;
            }
        }
        this._allAssetsLoaded = true;
        this.dispatchEvent('complete');
    }

    /**
     * Loaders
     */
    _loadImage(resource) {
        resource.state = STATE_LOADING;
        const image = new Image();
        image.crossOrigin = '';
        image.onload = () => {
            resource.state = STATE_LOADED;
            cache.push(resource);
            this._checkResourcesStatus();
        };
        image.src = resource.path ? this._basePath + resource.path : resource.absolutePath;
        resource.data = image;
    }

    _loadFont(resource) {
        resource.state = STATE_LOADING;
        const observer = new FontFaceObserver(resource.name, {
            weight: resource.weight,
        });
        observer.load().then(() => {
            resource.state = STATE_LOADED;
            cache.push(resource);
            this._checkResourcesStatus();
        });
    }

    _loadGltf(resource) {
        resource.state = STATE_LOADING;
        const stopWatch = new Stopwatch();
        stopWatch.start();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(this._basePath + '/libs/draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        const promise = new Promise((resolve) => {
            loader.load(this._basePath + resource.path, (gltf) => {
                resource.state = STATE_LOADED;
                stopWatch.stop();
                resource.loadingDuration = `${stopWatch.duration}ms`;

                resource.data = gltf;
                resolve(resource);
            });
        });

        return promise;
    }
}
