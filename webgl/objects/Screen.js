// Vendor
import * as THREE from 'three';

class Screen extends THREE.Mesh {
    constructor(options) {
        super();

        this._width = options.width;
        this._height = options.height;

        this._map = options.map;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        this.scale.set(this._width, this._height, 1);
    }

    /**
     * Public
     */
    update(time, delta) {}

    resize(width, height) {
        this._width = width;
        this._height = height;

        this.scale.set(this._width, this._height, 1);
    }

    /**
     * Private
     */
    _createGeometry() {
        const geometry = new THREE.PlaneGeometry(1, 1, 32);

        return geometry;
    }

    _createMaterial() {
        const material = new THREE.MeshBasicMaterial({
            map: this._map,
        });

        return material;
    }
}

export default Screen;
