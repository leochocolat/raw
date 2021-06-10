// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Components
import RenderTargetScene from './RenderTargetScene';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import bindAll from '@/utils/bindAll';
import { ResourceManager } from '@/utils/resource-loader';
import AudioManager from '@/utils/AudioManager';
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import BlurScreen from '../utils/BlurScreen';

// Data
import data from '@/webgl/data';

// Shader
import vertex from '../shaders/isolationScreen/vertex.glsl';
import fragment from '../shaders/isolationScreen/fragment.glsl';

class Library extends RenderTargetScene {
    constructor(options) {
        super(options);

        const zoomFOV = 39.6;
        const originalFOV = 65.5;

        this._animationsSettings = { progress: 0, zoomFOV, originalFOV };

        this._resources = this._setupResources();

        this._girlAnimations = ['AdulteFemme_Laptop', 'AdulteFemme_Read'];
        this._oldGirlAnimations = ['VieuxFemme_Read'];
        this._mainAnimations = ['TRACK_Camera', 'Computer', 'MainsEtudiante', 'Laptop_Movement'];
        this._animationComplete = false;

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
        const timeline = new gsap.timeline();

        timeline.add(super.transitionIn(), 0);
        timeline.call(() => {
            if (!this._animationController) return;

            for (let index = 0; index < this._mainAnimations.length; index++) {
                this._animationController.playAnimation({ animation: this._animationController.actionType[this._mainAnimations[index]], loop: false });
            }

            for (let index = 0; index < this._girlAnimations.length; index++) {
                this._girlAnimationControllers[index].playAnimation({ animation: this._girlAnimationControllers[index].actionType[this._girlAnimations[index]], loop: false });
            }

            this._oldGirlAnimationsControllers[0].playAnimation({ animation: this._oldGirlAnimationsControllers[0].actionType[this._oldGirlAnimations[0]], progress: this._animationsSettings.progress });

            this._initialeScreenTexture.image.play();

            this._playAudios();
        }, null, 0);

        return timeline;
    }

    transitionToMenu() {
        const timeline = new gsap.timeline();

        timeline.add(super.transitionToMenu(), 0);

        timeline.call(() => {
            if (this._modelCamera) {
                this.setCameraFOV({ fov: this._animationsSettings.originalFOV });
            }

            this._animationComplete = false;

            AudioManager.pause('audio_library');
            AudioManager.pause('audio_library_fx');

            this._updateSettings();
        }, null, 0);

        return timeline;
    }

    resetAnimationProgress() {
        const timelineProgress = new gsap.timeline();

        timelineProgress.add(super.resetAnimationProgress(), 0);

        if (this._blurScreen) {
            timelineProgress.call(() => {
                this._resetInitialScreenTexture();
                this._initialeScreenTexture.image.pause();
                this._initialeScreenTexture.image.currentTime = 0;
            }, null, 0);
        };

        return timelineProgress;
    }

    setCensorship(censorshipFactor) {
        if (this._blurScreen) this._blurScreen.blur = censorshipFactor;
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
        const resources = new ResourceManager({ name: 'library', namespace: 'library' });

        if (data.textures[this.sceneName].addToResourceManager) {
            resources.addByName(data.textures[this.sceneName].violent);
            resources.addByName(data.textures[this.sceneName].mask);
        }

        resources.addByName('texture_vieux_femme');
        resources.addByName('texture_adulte_femme');

        resources.load();

        return resources;
    }

    _setup() {
        this._sceneMaterial = this._createSceneMaterial();
        this._model = this._createModel();
        this._interactionScreen = this._setupInteractionScreen();
        this._modelCamera = this._createModelCameraAnimation();
        this._createHumanModels();

        // setup animations
        this._animationController = this._createAnimationController();
        this._animationController.onAnimationComplete((e) => {
            if (!this._animationComplete && e.action._clip.name === 'TRACK_Camera') {
                this._animationComplete = true;
                this._setCameraZoom();
                this.setScreenIsolation();
            }
        });

        // setup audios
        AudioManager.add('audio_library', this._resources.get('audio_library'));
        AudioManager.add('audio_library_fx', this._resources.get('audio_library_fx'));
    }

    _createSceneMaterial() {
        const texture = this._resources.get('texture_library');

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
        const model = this._resources.get('library');
        const textureItems = this._resources.get('texture_library_items');

        const clone = model;
        this.add(clone.scene);

        clone.scene.traverse((child) => {
            child.frustumCulled = false;
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
            }
            if (child.isMesh && child.name === 'scene_library') {
                child.material = this._sceneMaterial;
            } else if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ map: textureItems, side: THREE.DoubleSide, skinning: true });
            }
        });

        return clone;
    }

    _setupInteractionScreen() {
        this._initialeScreenTexture = this._resources.get('video_library_001');
        this._finaleScreenTexture = this._resources.get(data.textures[this.sceneName].violent);
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
            screenTexture: this._finaleScreenTexture,
            initialTexture: this._initialeScreenTexture,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
            size,
            settings: this.blurSettings,
            isInitiallyBlured: false,
        });

        this._initialeScreenTexture.image.addEventListener('ended', this._applyFinaleScreenTexture, null);

        // Debug
        // setTimeout(this._applyFinaleScreenTexture, 1000);
    }

    _applyFinaleScreenTexture() {
        // this._blurScreen.screenTexture = this._finaleScreenTexture;
        this._blurScreen.isBlured = true;
    }

    _resetInitialScreenTexture() {
        // this._blurScreen.screenTexture = this._initialeScreenTexture;
        this._blurScreen.isBlured = false;
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
        this._girlAnimationControllers = [];
        this._oldGirlAnimationsControllers = [];

        const modelGirl = this._resources.get('LibraryFemme');
        const modelOldGirl = this._resources.get('LibraryVieux');
        const textureOldGirl = this._resources.get('texture_vieux_femme');
        const textureGirl = this._resources.get('texture_adulte_femme');

        const animatedMesh = this._createAnimatedMesh(modelOldGirl, 0, textureOldGirl);
        this._oldGirlAnimationsControllers.push(animatedMesh);

        for (let index = 0; index < this._girlAnimations.length; index++) {
            const animatedMesh = this._createAnimatedMesh(modelGirl, index, textureGirl);
            this._girlAnimationControllers.push(animatedMesh);
        }
    }

    _playAudios() {
        AudioManager.play('audio_library', { loop: true });
        AudioManager.play('audio_library_fx', { loop: false });
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

        this.interactionsSettings.rotationFactor.x = -20;
        this.interactionsSettings.rotationFactor.y = 20;

        // Blur Settings
        this.blurSettings.spreadingTreshold = 0.05;
        this.blurSettings.wobbleIntensity = 0.15;
        this.blurSettings.intensityFactor = 1;

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

    _createAnimatedMesh(model, index, texture) {
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
            '_applyFinaleScreenTexture',
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

        for (let index = 0; index < this._girlAnimations.length; index++) {
            this._girlAnimationControllers[index].setAnimationProgress({ animation: this._girlAnimationControllers[index].actionType[this._girlAnimations[index]], progress: this._animationsSettings.progress });
        }
        this._oldGirlAnimationsControllers[0].setAnimationProgress({ animation: this._oldGirlAnimationsControllers[0].actionType[this._oldGirlAnimations[0]], progress: this._animationsSettings.progress });
    }

    _clickPlayAnimationsHandler() {
        for (let index = 0; index < this._mainAnimations.length; index++) {
            this._animationController.playAnimation({ animation: this._animationController.actionType[this._mainAnimations[index]], progress: this._animationsSettings.progress });
        }

        for (let index = 0; index < this._girlAnimations.length; index++) {
            this._girlAnimationControllers[index].playAnimation({ animation: this._girlAnimationControllers[index].actionType[this._girlAnimations[index]], progress: this._animationsSettings.progress });
        }
        this._oldGirlAnimationsControllers[0].playAnimation({ animation: this._oldGirlAnimationsControllers[0].actionType[this._oldGirlAnimations[0]], progress: this._animationsSettings.progress });
    }

    _blurSettingsChangeHandler() {
        this._blurScreen?.updateSettings(this.blurSettings);
    }
}

export default Library;
