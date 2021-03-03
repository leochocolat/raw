// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';

class Hallway extends RenderTargetScene {
    constructor(options) {
        super(options);

        this._name = options.name;
        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;

        this.background = new THREE.Color(data.colors[this._id]);
    }

    /**
     * Private
     */
    update(time, delta) {
        // console.log(`update child ${this._name}`);
        super.update(time, delta);
    }
}

export default Hallway;
