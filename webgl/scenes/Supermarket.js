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

import emptyScreenVertex from '../shaders/emptyScreens/vertex.glsl';
import emptyScreenFragment from '../shaders/emptyScreens/fragment.glsl';

class Supermarket extends RenderTargetScene {
    constructor(options) {
        super(options);

        const zoomFOV = 16.6;
        const originalFOV = 50.5;

        this._animationsSettings = { progress: 0.9, zoomFOV, originalFOV };

        this._resources = this._setupResources();

        this._mainAnimations = ['TRACK_Camera', 'MainsPere', 'Caddie_Movement', 'Cereal_Box', 'Panier_AdulteHomme', 'Panier_VieuxFemme'];
        this._manAnimations = ['AdulteHomme_Rayon'];
        this._oldGirlAnimations = ['VieuxFemme_Fruits'];

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

        this._oldGirlAnimationsControllers[0].playAnimation({ animation: this._oldGirlAnimationsControllers[0].actionType[this._oldGirlAnimations[0]], loop: true });
        this._manAnimationsControllers[0].playAnimation({ animation: this._manAnimationsControllers[0].actionType[this._manAnimations[0]], loop: true });

        AudioManager.play('audio_supermarket', { loop: true });
    }

    setCensorship(censorshipFactor) {
        if (this._blurScreen) this._blurScreen.blur = censorshipFactor;
    }

    transitionToMenu() {
        super.transitionToMenu();

        if (this._modelCamera) {
            this.setCameraFOV({ fov: this._animationsSettings.originalFOV });
        }

        AudioManager.pause('audio_supermarket');
    }

    update() {
        super.update();

        if (!this._blurScreen) return;
        this._blurScreen.update(this._sceneDelta);

        if (!this._emptyScreensMaterial) return;

        this._emptyScreensMaterial.uniforms.u_screen_texture.value = this._blurScreen.screenMaterial;

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
        this._createHumanModels();
        this._setupEmptyScreens();

        // setup audios
        AudioManager.add('audio_supermarket', this._resources.get('audio_supermarket'));

        // setup animations
        this._animationController = this._createAnimationController();
        this._animationController.onAnimationComplete((e) => {
            if (!this._animationComplete && e.action._clip.name === 'TRACK_Camera') {
                this._animationComplete = true;
                this._setCameraZoom();
                this.setScreenIsolation();
            }
        });

        // debug
        this._animationsProgressChangeHandler();
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
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
            }
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

        const width = size.x;
        const height = size.y;

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

    _setupEmptyScreens() {
        const uniforms = {
            u_screen_texture: { value: null },
        };
        const emptyScreens = this._model.scene.getObjectByName('Empty_Screens');
        this._emptyScreensMaterial = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: emptyScreenFragment,
            vertexShader: emptyScreenVertex,
            side: THREE.DoubleSide,
            transparent: true,
        });
        emptyScreens.traverse((child) => {
            if (child.name.includes('screen_')) {
                child.material = this._emptyScreensMaterial;
                // child.material = this._blurScreen.screenMaterial.map;
            }
        });
        return this._emptyScreensMaterial;
    }

    _createAnimationController() {
        const model = this._model;
        const animationController = new AnimationComponent({ model, animations: model.animations });
        this.animationControllers.push(animationController);

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        this.setModelCamera(this._model.cameras[0]);
        this.setCameraFOV({ fov: this._animationsSettings.originalFOV });

        return this._model.cameras[0];
    }

    _createHumanModels() {
        this._manAnimationsControllers = [];
        this._oldGirlAnimationsControllers = [];

        const modelMan = this._resources.get('AdulteHomme');
        const modelOldGirl = this._resources.get('AdulteVieux');

        const animatedMan = this._createAnimatedMesh(modelMan, 0);
        this._manAnimationsControllers.push(animatedMan);

        const animatedOldGirl = this._createAnimatedMesh(modelOldGirl, 0);
        this._oldGirlAnimationsControllers.push(animatedOldGirl);
    }

    // On Tick
    _updateAnimationController() {
        if (!this._animationController) return;
        this._animationController.update(this._sceneDelta);
    }

    _setupDebug() {
        if (!this.debugFolder) return;

        const animations = this.debugFolder.addFolder({ title: 'Animation', expanded: true });
        animations.addInput(this._animationsSettings, 'progress', { min: 0, max: 1 }).on('change', this._animationsProgressChangeHandler);
        animations.addInput(this._animationsSettings, 'zoomFOV', { min: 0.1, max: 80 }).on('change', this._cameraFovChangeHandler);
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
            fov: this._animationsSettings.zoomFOV,
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
        this._modelCamera.fov = this._animationsSettings.zoomFOV;
        this.setCameraFOV({ fov: this._model.cameras[0].fov });
    }

    _animationsProgressChangeHandler() {
        for (let index = 0; index < this._mainAnimations.length; index++) {
            this._animationController.setAnimationProgress({ animation: this._animationController.actionType[this._mainAnimations[index]], progress: this._animationsSettings.progress });
        }

        this._oldGirlAnimationsControllers[0].setAnimationProgress({ animation: this._oldGirlAnimationsControllers[0].actionType[this._oldGirlAnimations[0]], progress: this._animationsSettings.progress });
        this._manAnimationsControllers[0].setAnimationProgress({ animation: this._manAnimationsControllers[0].actionType[this._manAnimations[0]], progress: this._animationsSettings.progress });
    }

    _clickPlayAnimationsHandler() {
        for (let index = 0; index < this._mainAnimations.length; index++) {
            this._animationController.playAnimation({ animation: this._animationController.actionType[this._mainAnimations[index]], progress: this._animationsSettings.progress });
        }

        this._oldGirlAnimationsControllers[0].playAnimation({ animation: this._oldGirlAnimationsControllers[0].actionType[this._oldGirlAnimations[0]], progress: this._animationsSettings.progress });
        this._manAnimationsControllers[0].playAnimation({ animation: this._manAnimationsControllers[0].actionType[this._manAnimations[0]], progress: this._animationsSettings.progress });
    }
}

export default Supermarket;
