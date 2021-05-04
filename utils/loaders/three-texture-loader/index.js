import { Loader } from '../../resource-loader';
import { TextureLoader } from 'three';

class ThreeTextureLoader extends Loader {
    constructor(options) {
        super(options);

        this._loader = new TextureLoader();
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

export default ThreeTextureLoader;
