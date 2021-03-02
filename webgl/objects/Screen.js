// Vendor
import * as THREE from 'three';

// Data
import data from '../data';

class Screen extends THREE.Mesh {
    constructor(options) {
        super();

        this._name = options.name;
        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;

        this._map = options.map;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        this._setScale();
        this._setPosition();
    }

    /**
     * Public
     */
    get isActive() {
        return this._isActive;
    }

    setActive() {
        this._isActive = true;
        this._setScale();
        this._setPosition();
        // console.log(`Screen ${this._name} is active`);
    }

    setInactive() {
        this._isActive = false;
        this._setScale();
        this._setPosition();
        // console.log(`Screen ${this._name} is inactive`);
    }

    update(time, delta) {
        // if (!this._isActive) return;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._setScale();
        this._setPosition();
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

    _setPosition() {
        if (this._isActive) {
            this.position.set(0, 0, 0);
        } else {
            this.position.set(this._width * data.positions[this._id].x, this._height * data.positions[this._id].y, -0.1);
        }
    }

    _setScale() {
        if (this._isActive) {
            this.scale.set(this._width, this._height, 1);
        } else {
            this.scale.set(this._width / 2, this._height / 2, 1);
        }
    }
}

export default Screen;
