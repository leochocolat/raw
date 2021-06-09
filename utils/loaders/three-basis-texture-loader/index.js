import { Loader } from '../../resource-loader';
import { BasisTextureLoader } from './vendor/BasisTextureLoader';

class ThreeBasisTextureLoader extends Loader {
    constructor(options = {}) {
        super(options);

        this._loader = new BasisTextureLoader();

        this._decoderPath = options.decoderPath;
        this._renderer = options.renderer;

        if (!this._decoderPath) {
            throw new Error('ThreeBasisTextureLoader: decoderPath is not defined');
        }

        if (!this._renderer) {
            throw new Error('ThreeBasisTextureLoader: renderer is not defined');
        }

        this._loader.setTranscoderPath(this._decoderPath);
        this._loader.detectSupport(this._renderer);
    }

    /**
     * Public
     */
    load({ path, options = {} }) {
        const promise = new Promise((resolve, reject) => {
            this._loader.load(path, (texture) => {
                texture.flipY = options.flipY;
                resolve(texture);
            }, null, reject);
        });

        return promise;
    }
}

export default ThreeBasisTextureLoader;
