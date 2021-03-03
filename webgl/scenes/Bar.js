// Vendor
import * as THREE from 'three';

// Component
import RenderTargetScene from './RenderTargetScene';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';

import AnimationComponent from '@/utils/AnimationComponent';

class Bar extends RenderTargetScene {
    constructor(options) {
        super(options);

        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;

        this.background = new THREE.Color(data.colors[this._id]);

        this._dracoModel = this._setupModel();
        this._setupAnimationsModel();
    }

    _setupModel() {
        const mesh = ResourceLoader.get('dracoScene_02');

        this.add(mesh.scene);

        return mesh;
    }

    _setupAnimationsModel() {
        this._animationController = this._createAnimationController();
    }

    _createAnimationController() {
        const animationController = new AnimationComponent(this._dracoModel);
        animationController.playAnimation(animationController.actionType.Idle);

        return animationController;
    }

    update(time, delta) {
        super.update(time, delta);
        this._animationController.update(delta);
    }
}

export default Bar;
