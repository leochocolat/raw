// Vendor
import Pizzicato from 'pizzicato';

// Utils
import { Loader } from '../../resource-loader';

class PizzicatoAudioLoader extends Loader {
    /**
     * Public
     */
    load({ path }) {
        const promise = new Promise((resolve, reject) => {
            const sound = new Pizzicato.Sound(
                {
                    source: 'file',
                    options: { path },
                },
                () => {
                    resolve(sound);
                }
            );
        });

        return promise;
    }
}

export default PizzicatoAudioLoader;
