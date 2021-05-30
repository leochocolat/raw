// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';
import BlurScreen from '../utils/BlurScreen';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import bindAll from '@/utils/bindAll';
import { ResourceManager } from '@/utils/resource-loader';

class Library extends RenderTargetScene {
    constructor(options) {
        super(options);

        this._animationsSettings = { progress: 0 };

        this._resources = this._setupResources();

        this._updateSettings();

        this._bindAll();
        this._setupEventListeners();

        this._setupDebug();
    }

    /**
     * Public
     */
    transitionIn() {
        super.transitionIn();

        if (!this._animationController) return;

        this._animationController.playAnimation({ animation: this._animationController.actionType.CameraMove, loop: false });
    }

    setCensorship(censorshipFactor) {
        if (this._blurScreen) this._blurScreen.blur = censorshipFactor;
    }

    // Hooks
    update() {
        super.update();

        if (!this._blurScreen) return;
        this._blurScreen.update(this._sceneDelta);

        if (!this._animationController) return;
        this._animationController.update(this._sceneDelta);
    }

    /**
     * Private
     */
    _setupResources() {
        const resources = new ResourceManager({ name: 'library', namespace: 'library' });
        resources.addByName('blur-mask-test');
        resources.addByName('video-gore-test');
        resources.addByName('texture-gore-test');

        resources.load();

        return resources;
    }

    _setup() {
        this._material = this._createMaterial();
        this._model = this._createModel();
        this._interactionScreen = this._setupInteractionScreen();

        this._animationController = this._createAnimationController();
        this._modelCamera = this._createModelCameraAnimation();
    }

    _createMaterial() {
        const texture = this._resources.get('texture_library');
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

        return material;
    }

    _createModel() {
        const model = this._resources.get('library');

        const clone = model;
        this.add(clone.scene);

        clone.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = this._material;
            }
        });

        return clone;
    }

    _setupInteractionScreen() {
        // const screenTexture = this._resources.get('texture-gore-test');
        const screenTexture = this._resources.get('video-gore-test');
        const maskTexture = this._resources.get('blur-mask-test');
        const screen = this._model.scene.getObjectByName('Interaction_SCREEN');
        this._blurScreen = new BlurScreen({ blurFactor: 0.5, scenePlane: screen, maskTexture, screenTexture, renderer: this._renderer, width: this._width, height: this._height });
    }

    _createAnimationController() {
        const model = this._model;

        const animationController = new AnimationComponent({ model, animations: model.animations });

        this.animationControllers.push(animationController);

        // animationController.playAnimation({ animation: animationController.actionType.CameraMove, loopOnce: false });
        // animationController.setAnimationProgress({ animation: animationController.actionType.CameraMove, progress: 1 });

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        this.setModelCamera(this._model.cameras[0]);

        return this._model.cameras[0];
    }

    _updateSettings() {
        this.interactionsSettings.isEnable = true;

        this.interactionsSettings.positionFactor.x = 0;
        this.interactionsSettings.positionFactor.y = 0;

        this.interactionsSettings.rotationFactor.x = -10;
        this.interactionsSettings.rotationFactor.y = 10;

        this._debugFolder?.refresh();
    }

    _setupDebug() {
        if (!this.debugFolder) return;

        const animations = this.debugFolder.addFolder({ title: 'Animation', expanded: true });
        animations.addInput(this._animationsSettings, 'progress', { min: 0, max: 1 }).on('change', this._animationsProgressChangeHandler);
        animations.addButton({ title: 'Play' }).on('click', this._clickPlayAnimationsHandler);
    }

    /**
     * Events
     */
    _bindAll() {
        super._bindAll();

        bindAll(
            this,
            '_resourcesReadyHandler',
            '_animationsProgressChangeHandler',
            '_clickPlayAnimationsHandler',
        );
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }

    _animationsProgressChangeHandler() {
        this._animationController.setAnimationProgress({ animation: this._animationController.actionType.CameraMove, progress: this._animationsSettings.progress });
    }

    _clickPlayAnimationsHandler() {
        this._animationController.playAnimation({ animation: this._animationController.actionType.CameraMove, loop: false });
    }
}

export default Library;
