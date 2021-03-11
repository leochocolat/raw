// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';

// Utils
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import AnimationComponent from '@/utils/AnimationComponent';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';

class SuperMarket extends RenderTargetScene {
    constructor(options) {
        super(options);

        this.background = new THREE.Color(data.colors[this._id]);

        // this._dracoModel = this._setupModel();
        // this._animationController = this._createAnimationController();
    }

    /**
     * Public
     */
    update(time, delta) {
        super.update(time, delta);
        // this._animationController.update(delta);
    }

    /**
     * Private
     */
    _setupModel() {
        const dracoModel = ResourceLoader.get('dracoScene_01');
        const clone = cloneSkinnedMesh(dracoModel);

        this.add(clone.scene);
        clone.scene.position.z = -10;
        return clone;
    }

    _createAnimationController() {
        const animationController = new AnimationComponent(this._dracoModel);
        animationController.playAnimation(animationController.actionType.Idle);

        return animationController;
    }
}

export default SuperMarket;
