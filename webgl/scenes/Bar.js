// Vendor
import * as THREE from 'three';

// Component
import RenderTargetScene from './RenderTargetScene';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import { ResourceManager } from '@/utils/resource-loader';
import bindAll from '@/utils/bindAll';

class Bar extends RenderTargetScene {
    constructor(options) {
        super(options);

        this._bindAll();

        this._resources = this._setupResources();

        this._setupEventListeners();
    }

    /**
     * Public
     */
    setMenuState(state) {
        super.setMenuState(state);
    }

    setInactive(state) {
        super.setInactive(state);
    }

    update() {
        super.update();

        this._updateAnimationController();
    }

    /**
     * Private
     */
    _setupResources() {
        const resources = new ResourceManager({
            name: 'bar',
        });
        resources.addByName('CameraMovement');
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
        const material = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide,
        });

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
        animationController.playAnimation({ animation: animationController.actionType.CameraMove, loopOnce: false });

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        super.cameras.setModelCamera(this._model.cameras[0]);

        return this._model.cameras[0];
    }

    // On Tick
    _updateAnimationController() {
        if (!this._animationController) return;
        this._animationController.update(this._sceneDelta);
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

export default Bar;
