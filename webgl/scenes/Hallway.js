// Vendor
import * as THREE from 'three';

// Components
import RenderTargetScene from './RenderTargetScene';
import BlurScreen from '../utils/BlurScreen';

// Utils
import AnimationComponent from '@/utils/AnimationComponent';
import bindAll from '@/utils/bindAll';
import { ResourceManager } from '@/utils/resource-loader';
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import AudioManager from '@/utils/AudioManager';

class Hallway extends RenderTargetScene {
    constructor(options) {
        super(options);

        this._animationsSettings = { progress: 0 };

        this._resources = this._setupResources();

        this._humanAnimations = ['LyceenHomme_Phone', 'LyceenHomme_TalkArmPush'];

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
        this._animationController.playAnimation({ animation: this._animationController.actionType.TRACK_CameraMovement, loop: false });
        this._animationController.playAnimation({ animation: this._animationController.actionType.Phone, loop: false });
        for (let index = 0; index < this._modelsCount; index++) {
            this._humanAnimationControllers[index].playAnimation({ animation: this._humanAnimationControllers[index].actionType[this._humanAnimations[index]], loop: false });
        }
        AudioManager.add('audio_hallway', this._resources.get('audio_hallway'));
        AudioManager.play('audio_hallway', { loop: true });
    }

    setCensorship(censorshipFactor) {
        this._blurScreen.blur = censorshipFactor;
    }

    // Hooks
    update() {
        super.update();

        if (!this._blurScreen) return;
        this._blurScreen.update(this._sceneDelta);

        if (!this._animationController) return;
        this._animationController.update(this._sceneDelta);

        if (!this._humanAnimationControllers.length < 0) return;
        for (let index = 0; index < this._humanAnimationControllers.length; index++) {
            this._humanAnimationControllers[index].update(this._sceneDelta);
        }
    }

    /**
     * Private
     */
    _setupResources() {
        const resources = new ResourceManager({ name: 'hallway', namespace: 'hallway' });
        resources.addByName('blur-mask-test');
        resources.addByName('texture-gore-test');
        resources.addByName('video-gore-test');
        resources.load();

        return resources;
    }

    _setup() {
        this._material = this._createMaterial();
        this._model = this._createModel();
        this._interactionScreen = this._setupInteractionScreen();

        this._animationController = this._createAnimationController();
        this._modelCamera = this._createModelCameraAnimation();
        this._modelCamera = this._createHumanModels();

        // Debug
        // this._animationsSettings.progress = 1;
        // this._animationsProgressChangeHandler();
    }

    _createModel() {
        const model = this._resources.get('hallway');
        const clone = model;
        this.add(clone.scene);

        clone.scene.traverse((child) => {
            if (child.isMesh && child.name === 'scene_hallway1') {
                child.material = this._material;
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

    _createMaterial() {
        const texture = this._resources.get('texture_hallway');

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

        return material;
    }

    _createAnimationController() {
        const model = this._model;
        const animationController = new AnimationComponent({
            model,
            animations: model.animations,
        });

        this.animationControllers.push(animationController);

        return animationController;
    }

    _createModelCameraAnimation() {
        if (!this._model.cameras) return;

        this.setModelCamera(this._model.cameras[0]);

        return this._model.cameras[0];
    }

    _createHumanModels() {
        this._humanAnimationControllers = [];
        const modelMan = this._resources.get('LyceenHomme');
        const modelGirl = this._resources.get('LyceenFemme');
        this.add(modelGirl.scene);

        this._modelsCount = this._model.scene.getObjectByName('ModelsPositions').children.length;

        this._modelsPositions = [...this._model.scene.getObjectByName('ModelsPositions').children];

        for (let index = 0; index < this._modelsCount; index++) {
            const skinnedModelCloned = cloneSkinnedMesh(modelMan);
            skinnedModelCloned.scene.getObjectByName('skinned_mesh').frustumCulled = false;
            const animationController = new AnimationComponent({ model: skinnedModelCloned, animations: skinnedModelCloned.animations[index] });

            this._humanAnimationControllers.push(animationController);
            this.add(skinnedModelCloned.scene);

            this.animationControllers.push(animationController);
        }
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
        this._animationController.setAnimationProgress({ animation: this._animationController.actionType.TRACK_CameraMovement, progress: this._animationsSettings.progress });
        this._animationController.setAnimationProgress({ animation: this._animationController.actionType.Phone, progress: this._animationsSettings.progress });

        for (let index = 0; index < this._modelsCount; index++) {
            this._humanAnimationControllers[index].setAnimationProgress({ animation: this._humanAnimationControllers[index].actionType[this._humanAnimations[index]], progress: this._animationsSettings.progress });
        }
    }

    _clickPlayAnimationsHandler() {
        this._animationController.playAnimation({ animation: this._animationController.actionType.TRACK_CameraMovement, loop: false });
        this._animationController.playAnimation({ animation: this._animationController.actionType.Phone, loop: false });

        for (let index = 0; index < this._modelsCount; index++) {
            this._humanAnimationControllers[index].playAnimation({ animation: this._humanAnimationControllers[index].actionType[this._humanAnimations[index]], loop: false });
        }
    }
}

export default Hallway;
