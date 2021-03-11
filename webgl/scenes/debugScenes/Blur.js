// Vendor
import * as THREE from 'three';

// Scene
import DebugScene from './DebugScene';

class Blur extends DebugScene {
    constructor(options) {
        super(options);

        this._plane = this._createPlane();
    }

    /**
     * Private
     */
    _createPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1.5, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 'black',
            side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        return mesh;
    }
}

export default Blur;
