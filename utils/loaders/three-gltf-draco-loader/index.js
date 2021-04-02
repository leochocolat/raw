import { Loader } from '../../resource-loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ThreeGltfDracoLoader extends Loader {
    constructor(options = {}) {
        super(options);

        this._decoderPath = options.decoderPath;

        this._gltfLoader = new GLTFLoader();

        if (this._decoderPath) {
            this._dracoLoader = new DRACOLoader();
            this._dracoLoader.setDecoderPath(this._decoderPath);
            this._dracoLoader.setDecoderConfig({ type: 'js' });
            this._gltfLoader.setDRACOLoader(this._dracoLoader);
        }
    }

    /**
     * Public
     */
    load({ path }) {
        const promise = new Promise((resolve, reject) => {
            this._gltfLoader.load(path, resolve, null, reject);
        });

        return promise;
    }
}

export default ThreeGltfDracoLoader;
