// Vendor
import * as THREE from 'three';

// Data
import data from '../data';

class Screen extends THREE.Mesh {
    constructor(options) {
        super();

        this._id = options.id;
        this._width = options.width;
        this._height = options.height;

        this._map = options.map;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        this.position.set(this._width * data.positions[this._id].x, this._height * data.positions[this._id].y, 0);
        this.scale.set(this._width / 2, this._height / 2, 1);
    }

    /**
     * Public
     */
    update(time, delta) {}

    resize(width, height) {
        this._width = width;
        this._height = height;

        this.scale.set(this._width / 2, this._height / 2, 1);
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
