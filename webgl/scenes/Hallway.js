// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';
import AnimationComponent from '@/utils/AnimationComponent';

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
        this._animationController.update(this._sceneDelta);
    }

    _changeCamera() {
        super.cameras.setModelCamera(this._dracoModel.cameras[0]);
    }
    /**
     * Private
     */
    _setupModel() {
        const dracoModel = ResourceLoader.get('CameraMovement');

        this.add(dracoModel.scene);
        dracoModel.scene.position.z = -10;

        return dracoModel;
    }

    _createAnimationController() {
        const animationController = new AnimationComponent(this._dracoModel);
        animationController.playAnimation(animationController.actionType.CameraMove);

        return animationController;
    }
}

export default Hallway;
