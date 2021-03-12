import ResourceLoader from '@/utils/ResourceLoader';
import EventDispatcher from '@/utils/EventDispatcher';
import bindAll from '@/utils/bindAll';

class SceneResourceLoader extends EventDispatcher {
    constructor() {
        super();

        this._bindAll();

        this._resources = [];
        this._data = [];
    }

    /**
     * Public
     */
    get(resource) {
        const index = this._resources.indexOf(resource);

        if (index === -1) {
            console.error(`Can't find resource '${resource}'`);
            return;
        }

        return this._data[index];
    }

    addResource(resource) {
        this._resources.push(resource);
    }

    addResources(resources) {
        this._resources = [...this._resources, ...resources];
    }

    load() {
        const promises = [];

        for (let i = 0; i < this._resources.length; i++) {
            const resource = this._resources[i];
            const promise = ResourceLoader.get(resource);
            promises.push(promise);
        }

        return Promise.all(promises).then(this._loadCompleteHandler);
    }

    /**
     * Private
     */
    _bindAll() {
        bindAll(this, '_loadCompleteHandler');
    }

    _loadCompleteHandler(e) {
        this._data = e;
        this.dispatchEvent('ready');
    }
}

export default SceneResourceLoader;
