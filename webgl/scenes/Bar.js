// Vendor
import * as THREE from 'three';

// Component
import RenderTargetScene from './RenderTargetScene';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import { ResourceManager } from '@/utils/resource-loader';
import bindAll from '@/utils/bindAll';
import math from '@/utils/math';

class Bar extends RenderTargetScene {
    constructor(options) {
        super(options);

        this.background = new THREE.Color('red');

        this._cameraPosition = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
        };

        this._cameraRotation = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
        };

        this._interactionsSettings = null;

        this._bindAll();

        this._resources = this._setupResources();

        this._setupEventListeners();
    }

    /**
     * Public
     */
    setMenuState(state) {
        // Position
        this._cameraPosition.target.x = 0;
        this._cameraPosition.target.y = 0;

        // Rotation
        this._cameraRotation.target.x = 0;
        this._cameraRotation.target.y = 0;

        super.setMenuState(state);
    }

    setInactive(state) {
        // Position
        this._cameraPosition.target.x = 0;
        this._cameraPosition.target.y = 0;

        // Rotation
        this._cameraRotation.target.x = 0;
        this._cameraRotation.target.y = 0;

        super.setInactive(state);
    }

    update() {
        super.update();

        this._updateCameraPosition();
        this._updateAnimationController();
    }

    mousemoveHandler(e) {
        if (!e.settings.isEnable || !this._isActive || this._isMenu) return;

        this._interactionsSettings = e.settings;

        const positionFactor = this._interactionsSettings.positionFactor;
        const rotationFactor = this._interactionsSettings.rotationFactor;

        // Position
        this._cameraPosition.target.x = e.normalizedPosition.x * positionFactor.x;
        this._cameraPosition.target.y = e.normalizedPosition.y * positionFactor.y;

        // Rotation
        this._cameraRotation.target.x = e.normalizedPosition.x * rotationFactor.x * (Math.PI / 180);
        this._cameraRotation.target.y = e.normalizedPosition.y * rotationFactor.y * (Math.PI / 180);
    }

    _updateCameraPosition() {
        if (!this._interactionsSettings) return;

        const damping = this._interactionsSettings.damping;

        // Position
        this._cameraPosition.current.x = math.lerp(this._cameraPosition.current.x, this._cameraPosition.target.x, damping);
        this._cameraPosition.current.y = math.lerp(this._cameraPosition.current.y, this._cameraPosition.target.y, damping);

        // Rotation
        this._cameraRotation.current.x = math.lerp(this._cameraRotation.current.x, this._cameraRotation.target.x, damping);
        this._cameraRotation.current.y = math.lerp(this._cameraRotation.current.y, this._cameraRotation.target.y, damping);

        this.cameras.main.position.set(this._cameraPosition.current.x, this._cameraPosition.current.y, this._cameraPosition.current.z);
        this.cameras.main.rotation.y = this._cameraRotation.current.x;
        this.cameras.main.rotation.x = this._cameraRotation.current.y;
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
        animationController.playAnimation(animationController.actionType.CameraMove);

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
