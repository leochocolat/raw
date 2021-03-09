// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';
import AnimationComponent from '@/utils/AnimationComponent';

class Library extends RenderTargetScene {
    constructor(options) {
        super(options);

        this._name = options.name;
        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;

        this.background = new THREE.Color(data.colors[this._id]);

        this._dracoModel = this._setupModel();
        this._animationController = this._createAnimationController();
    }

    /**
     * Public
     */

    update(time, delta) {
        super.update(time, delta);
        this._animationController.update(delta);
    }

    /**
     * Private
     */

    _setupModel() {
        const dracoModel = ResourceLoader.get('dracoScene_03');

        this.add(dracoModel.scene);
        dracoModel.scene.position.z = -10;
        return dracoModel;
    }

    _createAnimationController() {
        const animationController = new AnimationComponent(this._dracoModel);
        animationController.playAnimation(animationController.actionType.Idle);

        return animationController;
    }
}

export default Library;
