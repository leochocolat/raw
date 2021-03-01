// Vendor
import FontFaceObserver from 'fontfaceobserver';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Utils
import EventDispatcher from './EventDispatcher';
import Stopwatch from './Stopwatch';
import resources from '@/resources';

// States
const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';

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
    static cache = [];

    static get(name) {
        const resource = this._getResourceByName(name);
        return resource.data;
    }

    static setResource(resource) {
        ResourceLoader.cache = resource;
        this._allAssetsLoaded = true;
    }

    static _getResourceByName(name) {
        for (let i = 0, len = ResourceLoader.cache.length; i < len; i++) {
            if (ResourceLoader.cache[i].name === name) return ResourceLoader.cache[i];
        }
        return undefined;
    }

    /**
     * Private
     */
    _loadResources() {
        const promises = [];

        for (let i = 0, len = this._resources.length; i < len; i++) {
            promises.push(this._loadResource(this._resources[i]));
        }

        return Promise.all(promises).then((responses) => {
            ResourceLoader.cache = responses;
            this.dispatchEvent('complete', responses);
        });
    }

    _loadResource(resource) {
        switch (resource.type) {
            case 'image':
                return this._loadImage(resource);
            case 'font':
                return this._loadFont(resource);
            case 'gltf':
            case 'glb':
                return this._loadGltf(resource);
            case 'draco':
                return this._loadDraco(resource);
        }
    }

    /**
     * Loaders
     */
    _loadImage(resource) {
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

        image.src = resource.path ? this._basePath + resource.path : resource.absolutePath;
        resource.data = image;

        return promise;
    }

    _loadFont(resource) {
        resource.state = STATE_LOADING;
        const stopWatch = new Stopwatch();
        stopWatch.start();

        const observer = new FontFaceObserver(resource.name, {
            weight: resource.weight,
        });

        const promise = new Promise((resolve) => {
            observer.load().then(() => {
                resource.state = STATE_LOADED;
                stopWatch.stop();
                resource.loadingDuration = `${stopWatch.duration}ms`;

                resolve(resource);
            });
        });

        return promise;
    }

    _loadGltf(resource) {
        resource.state = STATE_LOADING;
        const stopWatch = new Stopwatch();
        stopWatch.start();

        const loader = new GLTFLoader();

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

    _loadDraco(resource) {
        resource.state = STATE_LOADING;
        const stopWatch = new Stopwatch();
        stopWatch.start();


        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(this._basePath + '/draco/');
 
        dracoLoader.setDecoderConfig({type: 'js'});
 
        const loader = new GLTFLoader();

        loader.setDRACOLoader(dracoLoader);

        const promise = new Promise((resolve) => {
            loader.load(this._basePath + resource.path, (gltf) => {
                console.log(gltf)
                resource.state = STATE_LOADED;
                stopWatch.stop();
                resource.loadingDuration = `${stopWatch.duration}ms`;

                resource.data = gltf;
                resolve(resource);
            });
        });

        return promise;
    }

    /**
     * Utils
     */
    _deepClone(array) {
        return JSON.parse(JSON.stringify(array));
    }
}
