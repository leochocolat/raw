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

class Hallway extends RenderTargetScene {
    constructor(options) {
        super(options);

        this.background = new THREE.Color(data.colors[this._id]);

        this._dracoModel = this._setupModel();

        if (this._dracoModel.cameras) {
            this._changeCamera();
        }

        this._animationController = this._createAnimationController();
    }

    /**
     * Public
     */
    update() {
        super.update();

        if (!this._animationController.update) return;
        this._animationController.update(this._sceneDelta);
    }

    _changeCamera() {
        super.cameras.setModelCamera(this._dracoModel.cameras[0]);
    }

    /**
     * Private
     */
    async _setupModel() {
        const dracoModel = await ResourceLoader.get('dracoScene_02');
        const clone = cloneSkinnedMesh(dracoModel);

        this.add(clone.scene);
        clone.scene.position.z = -10;

        return clone;
    }

    async _createAnimationController() {
        const model = await this._dracoModel;
        const animationController = new AnimationComponent(model);
        animationController.playAnimation(animationController.actionType.Idle);

        return animationController;
    }
}

export default Hallway;
