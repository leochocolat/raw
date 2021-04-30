// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import bindAll from '@/utils/bindAll';
import { ResourceManager } from '@/utils/resource-loader';

// Data
import data from '../data';

class Hallway extends RenderTargetScene {
    constructor(options) {
        super(options);

        // this.background = new THREE.Color(data.colors[this._id]);

        this._bindAll();

        this._resources = this._setupResources();

        this._setupEventListeners();
    }

    /**
     * Public
     */
    update() {
        super.update();

        if (!this._animationController) return;
        this._animationController.update(this._sceneDelta);
    }

    /**
     * Private
     */
    _setupResources() {
        const resources = new ResourceManager({ name: 'hallway', namespace: 'hallway' });
        resources.addByName('hallway');
        resources.load();

        return resources;
    }

    _setup() {
        this._material = this._createMaterial();
        this._model = this._createModel();
        this._animationController = this._createAnimationController();
        this._modelCamera = this._createModelCameraAnimation();
    }

    _createModel() {
        const model = this._resources.get('hallway');
        const clone = model;
        this.add(clone.scene);

        clone.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = this._material;
            }
        });

        return clone;
    }

    _createMaterial() {
        const texture = this._resources.get('texture_hallway');
        const material = new THREE.MeshNormalMaterial({
            // map: texture,
        });

        return material;
    }

    _createAnimationController() {
        const model = this._model;
        const animationController = new AnimationComponent(model);
        animationController.playAnimation({ animation: animationController.actionType.CameraMove, loopOnce: false });

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        this.cameras.setModelCamera(this._model.cameras[0]);
        this._model.cameras[0].fov = 75;
        return this._model.cameras[0];
    }

    /**
     * Events
     */
    _bindAll() {
        bindAll(this, '_resourcesReadyHandler');
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }
}

export default Hallway;
