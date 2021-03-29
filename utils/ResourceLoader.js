// Utils
import { loadImage, loadFont, loadVideoTexture, loadGltf, loadDraco } from './loaders';
import EventDispatcher from './EventDispatcher';

// Data
import resources from '../resources';

export default class ResourceLoader extends EventDispatcher {
    constructor(resources, basePath, isDebug) {
        super();

        this.resources = this._deepClone(resources);
        this.basePath = basePath;

        if (isDebug) return;
        this._loadResources();
    }

    /**
     * Static
     */
    static resources = [];

    static cache = [];

    static basePath = '';

    static get(name) {
        const resource = this.getResourceByName(name);
        return resource.data;
    }

    static async load(name) {
        const resource = await this.loadResourceByName(name);
        return resource.data;
    }

    static setResource(resource) {
        ResourceLoader.cache = resource;
    }

    static getResourceByName(name) {
        // Try to find resource in the cache
        for (let i = 0, len = ResourceLoader.cache.length; i < len; i++) {
            if (ResourceLoader.cache[i].name === name) {
                return ResourceLoader.cache[i];
            }
        }
    }

    static loadResourceByName(name) {
        // Try to find resource in the cache
        for (let i = 0, len = ResourceLoader.cache.length; i < len; i++) {
            if (ResourceLoader.cache[i].name === name) {
                return ResourceLoader.cache[i];
            }
        }

        // If the resource is not in the cache yet, load it
        return new Promise((resolve) => {
            let resource = null;
            for (let i = 0; i < resources.length; i++) {
                if (resources[i].name === name) {
                    resource = resources[i];
                    this.loadResource(resource).then((response) => {
                        resolve(response);
                    });
                }
            }
        });
    }

    static loadResource(resource) {
        switch (resource.type) {
            case 'image':
                return loadImage(resource, this.basePath);
            case 'font':
                return loadFont(resource, this.basePath);
            case 'gltf':
            case 'glb':
                return loadGltf(resource, this.basePath);
            case 'draco':
                return loadDraco(resource, this.basePath);
            case 'videoTexture':
                return loadVideoTexture(resource, this.basePath);
        }
    }

    /**
     * Private
     */
    _loadResources() {
        const promises = [];

        for (let i = 0, len = this.resources.length; i < len; i++) {
            promises.push(ResourceLoader.loadResource(this.resources[i]));
        }

        return Promise.all(promises).then((responses) => {
            ResourceLoader.cache = responses;
            this.dispatchEvent('complete', responses);
        });
    }

    /**
     * Utils
     */
    _deepClone(array) {
        return JSON.parse(JSON.stringify(array));
    }
}
