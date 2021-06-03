// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Component
import RenderTargetScene from './RenderTargetScene';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import { ResourceManager } from '@/utils/resource-loader';
import bindAll from '@/utils/bindAll';
import AudioManager from '@/utils/AudioManager';

// Shader
import vertex from '../shaders/isolationScreen/vertex.glsl';
import fragment from '../shaders/isolationScreen/fragment.glsl';

class Supermarket extends RenderTargetScene {
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
    get sceneMaterial() {
        return this._sceneMaterial;
    }

    transitionIn() {
        super.transitionIn();

        if (!this._animationController) return;

        this._animationController.playAnimation({ animation: this._animationController.actionType.TRACK_CameraMovement, loop: false });

        AudioManager.add('audio_supermarket', this._resources.get('audio_supermarket'));
        AudioManager.play('audio_supermarket', { loop: true });
    }

    setCensorship(censorshipFactor) {
        if (this._blurScreen) this._blurScreen.blur = censorshipFactor;
    }

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
            name: 'supermarket',
            namespace: 'supermarket',

        });

        resources.load();

        return resources;
    }

    _setup() {
        this._sceneMaterial = this._createMaterial();
        this._model = this._createModel();
        this._animationController = this._createAnimationController();
        this._modelCamera = this._createModelCameraAnimation();

        this._animationController.onAnimationComplete(() => this.setScreenIsolation());
    }

    _createModel() {
        const model = this._resources.get('supermarket');
        const clone = model;
        this.add(clone.scene);
        clone.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = this._sceneMaterial;
            }
        });

        return clone;
    }

    _createMaterial() {
        const texture = this._resources.get('texture_supermarket');

        const uniforms = {
            u_scene_texture: { value: texture },
            u_isolation_alpha: { value: 1.0 },
        };

        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        return material;
    }

    _createAnimationController() {
        const model = this._model;
        const animationController = new AnimationComponent({ model, animations: model.animations });
        this.animationControllers.push(animationController);

        // animationController.playAnimation({ animation: animationController.actionType.CameraMove, loop: false });

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        this.setModelCamera(this._model.cameras[0]);

        return this._model.cameras[0];
    }

    // On Tick
    _updateAnimationController() {
        if (!this._animationController) return;
        this._animationController.update(this._sceneDelta);

        // if (!this._humanAnimationControllers.length < 0) return;
        // for (let index = 0; index < this._humanAnimationControllers.length; index++) {
        //     this._humanAnimationControllers[index].update(this._sceneDelta);
        // }
    }

    _setupDebug() {
        if (!this.debugFolder) return;

        const animations = this.debugFolder.addFolder({ title: 'Animation', expanded: true });
        animations.addInput(this._animationsSettings, 'progress', { min: 0, max: 1 }).on('change', this._animationsProgressChangeHandler);
        animations.addButton({ title: 'Play' }).on('click', this._clickPlayAnimationsHandler);
    }

    _updateSettings() {
        this.interactionsSettings.isEnable = true;

        this.interactionsSettings.positionFactor.x = 0;
        this.interactionsSettings.positionFactor.y = 0;

        this.interactionsSettings.rotationFactor.x = -10;
        this.interactionsSettings.rotationFactor.y = 10;

        this._debugFolder?.refresh();
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
        this._animationController.setAnimationProgress({ animation: this._animationController.actionType.TRACK_CameraMovement, progress: this._animationsSettings.progress });
    }

    _clickPlayAnimationsHandler() {
        this._animationController.playAnimation({ animation: this._animationController.actionType.TRACK_CameraMovement, loop: false });
    }
}

export default Supermarket;
