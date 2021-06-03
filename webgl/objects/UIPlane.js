// Vendor
import * as THREE from 'three';

class UIPlane extends THREE.Mesh {
    constructor(options = {}) {
        super();

        this._width = options.width;
        this._height = options.height;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        // this.position = new THREE.Vector3();
        this.position.set(0, 0, 0.1);
        this.scale.set(this._width, this._height, 1);
    }

    /**
     * Private
     */
    _createGeometry() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        return geometry;
    }

    _createMaterial() {
        const material = new THREE.MeshBasicMaterial({ color: 'red' });

        return material;
    }
}

export default UIPlane;
