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
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import BlurScreen from '../utils/BlurScreen';

// Shader
import vertex from '../shaders/isolationScreen/vertex.glsl';
import fragment from '../shaders/isolationScreen/fragment.glsl';

class Supermarket extends RenderTargetScene {
    constructor(options) {
        super(options);

        const zoomFOV = 16.6;
        this._animationsSettings = { progress: 0, fov: zoomFOV };

        this._resources = this._setupResources();

        this._mainAnimations = ['TRACK_Camera', 'MainsPere', 'Caddie_Movement', 'Cereal_Box'];

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
        for (let index = 0; index < this._mainAnimations.length; index++) {
            this._animationController.playAnimation({ animation: this._animationController.actionType[this._mainAnimations[index]], loop: false });
        }
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

        if (!this._blurScreen) return;
        this._blurScreen.update(this._sceneDelta);

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

        resources.addByName('blur-mask-test');
        resources.addByName('texture-gore-test');
        resources.addByName('video-gore-test');
        resources.load();

        return resources;
    }

    _setup() {
        this._sceneMaterial = this._createSceneMaterial();
        this._model = this._createModel();
        this._interactionScreen = this._setupInteractionScreen();
        this._modelCamera = this._createModelCameraAnimation();

        // setup audios
        AudioManager.add('audio_supermarket', this._resources.get('audio_supermarket'));

        // setup animations
        this._animationController = this._createAnimationController();
        this._animationController.onAnimationComplete(() => {
            if (!this._animationComplete) {
                this._animationComplete = true;
                this._setCameraZoom();
                this.setScreenIsolation();
            }
        });
    }

    _createSceneMaterial() {
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

    _createModel() {
        const model = this._resources.get('supermarket');
        const clone = model;
        this.add(clone.scene);
        clone.scene.traverse((child) => {
            child.frustumCulled = false;
            if (child.isMesh && child.name === 'scene_supermarket') {
                child.material = this._sceneMaterial;
            }
        });

        return clone;
    }

    _setupInteractionScreen() {
        // const screenTexture = this._resources.get('texture-gore-test');
        const screenTexture = this._resources.get('video-gore-test');
        const maskTexture = this._resources.get('blur-mask-test');

        const screen = this._model.scene.getObjectByName('Interaction_Screen');
        const container = new THREE.Box3().setFromObject(screen);
        const size = new THREE.Vector3();
        container.getSize(size);

        const width = size.z * 0.4;
        const height = size.x;

        size.x = width;
        size.y = height;

        this._blurScreen = new BlurScreen({
            blurFactor: 0.5,
            scenePlane: screen,
            maskTexture,
            screenTexture,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            size,
        });
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
        animations.addInput(this._animationsSettings, 'fov', { min: 0.1, max: 80 }).on('change', this._cameraFovChangeHandler);
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

    _setCameraZoom() {
        gsap.to(this._modelCamera, {
            fov: this._animationsSettings.fov,
            duration: 1,
            ease: 'sine.inOut',
            onUpdate: () => {
                this.setCameraFOV({ fov: this._model.cameras[0].fov });
            },
        });
        this.interactionsSettings.rotationFactor.x = -1;
        this.interactionsSettings.rotationFactor.y = 0.5;
    }

    _createAnimatedMesh(model, index) {
        const skinnedModelCloned = cloneSkinnedMesh(model);
        skinnedModelCloned.scene.getObjectByName('skinned_mesh').frustumCulled = false;
        const animationController = new AnimationComponent({ model: skinnedModelCloned, animations: skinnedModelCloned.animations[index] });
        this.add(skinnedModelCloned.scene);

        this.animationControllers.push(animationController);

        return animationController;
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
            '_cameraFovChangeHandler',
            '_clickPlayAnimationsHandler',
        );
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }

    _cameraFovChangeHandler() {
        this._modelCamera.fov = this._animationsSettings.fov;
        this.setCameraFOV({ fov: this._model.cameras[0].fov });
    }

    _animationsProgressChangeHandler() {
        for (let index = 0; index < this._mainAnimations.length; index++) {
            this._animationController.setAnimationProgress({ animation: this._animationController.actionType[this._mainAnimations[index]], progress: this._animationsSettings.progress });
        }

        // for (let index = 0; index < this._humanAnimations.length; index++) {
        //     this._humanAnimationControllers[index].setAnimationProgress({ animation: this._humanAnimationControllers[index].actionType[this._humanAnimations[index]], progress: this._animationsSettings.progress });
        // }

        // for (let index = 0; index < this._oldManAnimations.length; index++) {
        //     this._oldManAnimationsControllers[index].setAnimationProgress({ animation: this._oldManAnimationsControllers[index].actionType[this._oldManAnimations[index]], progress: this._animationsSettings.progress });
        // }
    }

    _clickPlayAnimationsHandler() {
        for (let index = 0; index < this._mainAnimations.length; index++) {
            this._animationController.playAnimation({ animation: this._animationController.actionType[this._mainAnimations[index]], progress: this._animationsSettings.progress });
        }

        // for (let index = 0; index < this._humanAnimations.length; index++) {
        //     this._humanAnimationControllers[index].playAnimation({ animation: this._humanAnimationControllers[index].actionType[this._humanAnimations[index]], progress: this._animationsSettings.progress });
        // }

        // for (let index = 0; index < this._oldManAnimations.length; index++) {
        //     this._oldManAnimationsControllers[index].playAnimation({ animation: this._oldManAnimationsControllers[index].actionType[this._oldManAnimations[index]], progress: this._animationsSettings.progress });
        // }
    }
}

export default Supermarket;
