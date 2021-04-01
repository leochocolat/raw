// Vendor
import * as THREE from 'three';

// Component
import RenderTargetScene from './RenderTargetScene';

// Utils
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import AnimationComponent from '@/utils/AnimationComponent';
import SceneResourceLoader from '@/utils/SceneResourceLoader';
import bindAll from '@/utils/bindAll';

// Data
import data from '../data';

class Bar extends RenderTargetScene {
    constructor(options) {
        super(options);

        this.background = new THREE.Color(data.colors[this._id]);

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
        const resources = new SceneResourceLoader();
        resources.addResource('CameraMovement');
        resources.load();

        return resources;
    }

    _setup() {
        this._material = this._createMaterial();
        this._model = this._createModel();
        this._animationController = this._createAnimationController();
        this._modelCamera = this._createModelCameraAnimation();
    }

    _createMaterial() {
        const material = new THREE.MeshNormalMaterial();

        return material;
    }

    _createModel() {
        const model = this._resources.get('CameraMovement');
        // const clone = cloneSkinnedMesh(model);
        const clone = model;
        this.add(clone.scene);

        clone.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = this._material;
            }
        });

        return clone;
    }

    _createAnimationController() {
        const model = this._model;
        const animationController = new AnimationComponent(model);
        animationController.playAnimation(animationController.actionType.CameraMove);

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        super.cameras.setModelCamera(this._model.cameras[0]);

        return this._model.cameras[0];
    }

    /**
     * Events
     */
    _bindAll() {
        bindAll(this, '_resourcesReadyHandler');
    }

    _setupEventListeners() {
        this._resources.addEventListener('ready', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }
}

export default Bar;
