// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Components
import RenderTargetScene from './RenderTargetScene';
import BlurScreen from '../utils/BlurScreen';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import bindAll from '@/utils/bindAll';
import { ResourceManager } from '@/utils/resource-loader';
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import AudioManager from '@/utils/AudioManager';

// Data
import data from '@/webgl/data';

// Shader
import vertex from '../shaders/isolationScreen/vertex.glsl';
import fragment from '../shaders/isolationScreen/fragment.glsl';

class Hallway extends RenderTargetScene {
    constructor(options) {
        super(options);

        const zoomFOV = 3.57;
        const originalFOV = 65.5;

        this._animationsSettings = { progress: 0, zoomFOV, originalFOV };

        this._resources = this._setupResources();

        this._manAnimations = ['LyceenHomme_Wall', 'LyceenHomme_Phone', 'LyceenHomme_Talk'];
        this._girlAnimations = ['LyceeFemme_Talk'];

        this._mainAnimations = ['TRACK_Camera', 'Phone'];

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

        for (let index = 0; index < this._manAnimations.length; index++) {
            this._manAnimationsController[index].playAnimation({ animation: this._manAnimationsController[index].actionType[this._manAnimations[index]], loop: false });
        }

        for (let index = 0; index < this._girlAnimations.length; index++) {
            this._girlAnimationsController[index].playAnimation({ animation: this._girlAnimationsController[index].actionType[this._girlAnimations[index]], loop: false });
        }

        this._playAudios();
    }

    setCensorship(censorshipFactor) {
        if (this._blurScreen) this._blurScreen.blur = censorshipFactor;
    }

    transitionToMenu() {
        super.transitionToMenu();

        if (this._modelCamera) {
            this.setCameraFOV({ fov: this._animationsSettings.originalFOV });
        }

        this._animationComplete = false;

        this._updateSettings();

        AudioManager.pause('audio_hallway');
        AudioManager.pause('audio_hallway_fx');
    }

    // Hooks
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
            name: 'hallway',
            namespace: 'hallway',
        });

        if (data.textures[this.sceneName].addToResourceManager) {
            resources.addByName(data.textures[this.sceneName].violent);
            resources.addByName(data.textures[this.sceneName].mask);
        }
        resources.addByName('texture_lycee_femme');
        resources.addByName('texture_lycee_homme');

        resources.load();

        return resources;
    }

    _setup() {
        this._sceneMaterial = this._createSceneMaterial();
        this._model = this._createModel();
        this._interactionScreen = this._setupInteractionScreen();

        this._modelCamera = this._createModelCameraAnimation();
        this._createHumanModels();

        // setup audios
        AudioManager.add('audio_hallway', this._resources.get('audio_hallway'));
        AudioManager.add('audio_hallway_fx', this._resources.get('audio_hallway_fx'));

        // setup animations
        this._animationController = this._createAnimationController();
        this._animationController.onAnimationComplete((e) => {
            if (!this._animationComplete && e.action._clip.name === 'TRACK_Camera') {
                this._animationComplete = true;
                this._setCameraZoom();
                this.setScreenIsolation();
            }
        });
    }

    _createSceneMaterial() {
        const texture = this._resources.get('texture_hallway');

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
        const model = this._resources.get('hallway');
        const clone = model;
        this.add(clone.scene);

        clone.scene.traverse((child) => {
            child.frustumCulled = false;
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
            }
            if (child.isMesh && child.name === 'scene_hallway') {
                child.material = this._sceneMaterial;
            }
        });

        return clone;
    }

    _setupInteractionScreen() {
        const screenTexture = this._resources.get(data.textures[this.sceneName].violent);
        const maskTexture = this._resources.get(data.textures[this.sceneName].mask);

        const screen = this._model.scene.getObjectByName('Interaction_Screen');
        const container = new THREE.Box3().setFromObject(screen);
        const size = new THREE.Vector3();
        container.getSize(size);

        const width = size.x;
        const height = size.y;

        size.x = width;
        size.y = height;

        this._blurScreen = new BlurScreen({
            blurFactor: this.censorshipFactor,
            scenePlane: screen,
            maskTexture,
            screenTexture,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            size,
            settings: this.blurSettings,
        });
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
        this._animationsSettings.originalFOV = this._model.cameras[0].fov;
        this.setCameraFOV({ fov: this._model.cameras[0].fov });

        return this._model.cameras[0];
    }

    _createHumanModels() {
        this._manAnimationsController = [];
        this._girlAnimationsController = [];

        const modelMan = this._resources.get('LyceenHomme');
        const modelGirl = this._resources.get('LyceenFemme');
        console.log(modelGirl);
        const textureGirl = this._resources.get('texture_lycee_femme');
        const textureMan = this._resources.get('texture_lycee_homme');

        for (let index = 0; index < this._girlAnimations.length; index++) {
            const animatedMesh = this._createAnimatedMesh(modelGirl, index, textureGirl);
            this._girlAnimationsController.push(animatedMesh);
        }

        for (let index = 0; index < this._manAnimations.length; index++) {
            const animatedMesh = this._createAnimatedMesh(modelMan, index, textureMan);
            this._manAnimationsController.push(animatedMesh);
        }
    }

    _playAudios() {
        AudioManager.play('audio_hallway', { loop: true });
        AudioManager.play('audio_hallway_fx', { loop: false });
    }

    // On Tick
    _updateAnimationController() {
        if (!this.animationControllers.length < 0) return;
        for (let index = 0; index < this.animationControllers.length; index++) {
            this.animationControllers[index].update(this._sceneDelta);
        }
    }

    _updateSettings() {
        // Interactions Settings
        this.interactionsSettings.isEnable = true;

        this.interactionsSettings.positionFactor.x = 0;
        this.interactionsSettings.positionFactor.y = 0;

        this.interactionsSettings.rotationFactor.x = -15;
        this.interactionsSettings.rotationFactor.y = 15;

        // Blur Settings
        this.blurSettings.wobbleIntensity = 0.16;
        this.blurSettings.spreadingTreshold = 0.72;
        this.blurSettings.intensityFactor = 0.6;

        this._debugFolder?.refresh();
    }

    _setupDebug() {
        if (!this.debugFolder) return;

        const animations = this.debugFolder.addFolder({ title: 'Animation', expanded: true });
        animations.addInput(this._animationsSettings, 'progress', { min: 0, max: 1 }).on('change', this._animationsProgressChangeHandler);
        animations.addInput(this._animationsSettings, 'zoomFOV', { min: 0.1, max: 80 }).on('change', this._cameraFovChangeHandler);
        animations.addButton({ title: 'Play' }).on('click', this._clickPlayAnimationsHandler);

        const blur = this.debugFolder.addFolder({ title: 'Blur', expanded: true });
        blur.addInput(this.blurSettings, 'spreadingTreshold', { min: 0, max: 0.5 }).on('change', this._blurSettingsChangeHandler);
        blur.addInput(this.blurSettings, 'wobbleIntensity', { min: 0, max: 1 }).on('change', this._blurSettingsChangeHandler);
        blur.addInput(this.blurSettings, 'intensityFactor', { min: 0, max: 10 }).on('change', this._blurSettingsChangeHandler);
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

    _createAnimatedMesh(model, index, texture, isAnimated) {
        const skinnedModelCloned = cloneSkinnedMesh(model);
        skinnedModelCloned.scene.getObjectByName('skinned_mesh').frustumCulled = false;
        const animationController = new AnimationComponent({ model: skinnedModelCloned, animations: skinnedModelCloned.animations[index] });

        const manMaterial = new THREE.MeshBasicMaterial({ map: texture, skinning: true });
        const mesh = skinnedModelCloned.scene.getObjectByName('skinned_mesh');
        mesh.material = manMaterial;
        mesh.frustumCulled = false;
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
            '_blurSettingsChangeHandler',
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
        this._animationController.setAnimationProgress({ animation: this._animationController.actionType.TRACK_CameraMovement, progress: this._animationsSettings.progress });
        this._animationController.setAnimationProgress({ animation: this._animationController.actionType.Phone, progress: this._animationsSettings.progress });

        for (let index = 0; index < this._manAnimationsController.length; index++) {
            this._manAnimationsController[index].setAnimationProgress({ animation: this._manAnimationsController[index].actionType[this._manAnimations[index]], progress: this._animationsSettings.progress });
        }
    }

    _clickPlayAnimationsHandler() {
        this._animationController.playAnimation({ animation: this._animationController.actionType.TRACK_CameraMovement, loop: false });
        this._animationController.playAnimation({ animation: this._animationController.actionType.Phone, loop: false });

        for (let index = 0; index < this._manAnimationsController.length; index++) {
            this._manAnimationsController[index].playAnimation({ animation: this._manAnimationsController[index].actionType[this._manAnimations[index]], loop: false });
        }
    }

    _blurSettingsChangeHandler() {
        this._blurScreen?.updateSettings(this.blurSettings);
    }
}

export default Hallway;
