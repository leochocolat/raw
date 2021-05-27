// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Data
import data from '../data';

// Object
import Cameras from '../objects/Cameras';

// Utils
import math from '@/utils/math';
import bindAll from '@/utils/bindAll';

class RenderTargetScene extends THREE.Scene {
    constructor(options) {
        super();

        this._bindAll();

        this._name = options.name;
        this._id = options.id;
        this._renderer = options.renderer;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;
        this._isVisible = options.isVisible;

        // this.background = new THREE.Color(data.colors[this._id]);

        this._cameraPosition = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
            initial: new THREE.Vector3(0, 0, 0),
        };

        this._cameraRotation = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
            initial: new THREE.Vector3(0, 0, 0),
        };

        this._interactionsSettings = JSON.parse(JSON.stringify(data.settings.mouseInteractions));

        this._animationControllers = [];

        this._clock = new THREE.Clock();
        this._sceneFps = 0;
        this._sceneDelta = 0;

        this._renderTarget = this._createRenderTarget();
        // this._debugCube = this._createDebugCube();
        this._ambientLight = this._createAmbientLight();
        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
        this._uniforms = this._createUniforms();

        // Debug
        window[`_resetAnimationProgress_${this._id}`] = this._resetAnimationProgress;
    }

    /**
     * Public
     */
    get sceneId() {
        return this._id;
    }

    get uniforms() {
        return this._uniforms;
    }

    get camera() {
        return this._cameras.active;
    }

    get cameras() {
        return this._cameras;
    }

    get renderTarget() {
        return this._renderTarget;
    }

    get debugFolder() {
        return this._debugFolder;
    }

    get isActive() {
        return this._isActive;
    }

    get isVisible() {
        return this._isVisible;
    }

    get interactionsSettings() {
        return this._interactionsSettings;
    }

    get animationControllers() {
        return this._animationControllers;
    }

    show() {
        const timelineShow = new gsap.timeline();

        timelineShow.set(this._uniforms[`u_texture_alpha_${this._id}`], { value: 1 });

        return timelineShow;
    }

    hide() {
        const timelineHide = new gsap.timeline();

        timelineHide.set(this._uniforms[`u_texture_alpha_${this._id}`], { value: 0 });

        return timelineHide;
    }

    transitionIn() {
        this._timelineOut?.kill();
        this._timelineMenu?.kill();

        this.timelineMouseleave?.kill();
        this.timelineMouseenter?.kill();

        this._timelineIn = new gsap.timeline();

        this._timelineIn.set(this._uniforms[`u_step_factor_${this._id}`], { value: 0 }, 0);
        this._timelineIn.set(this._uniforms[`u_size_${this._id}`], { value: 0 }, 0);
        this._timelineIn.set(this._uniforms[`u_scale_${this._id}`], { value: 1 }, 0);
        this._timelineIn.set(this._uniforms[`u_noise_alpha_${this._id}`], { value: 0 }, 0);

        return this._timelineIn;
    }

    transitionOut() {
        this._timelineIn?.kill();
        this._timelineMenu?.kill();

        this.timelineMouseleave?.kill();
        this.timelineMouseenter?.kill();

        this._timelineOut = new gsap.timeline();

        this._timelineOut.set(this._uniforms[`u_step_factor_${this._id}`], { value: 1 }, 0);
        this._timelineOut.set(this._uniforms[`u_noise_alpha_${this._id}`], { value: 0 }, 0);

        return this._timelineOut;
    }

    transitionToMenu() {
        this._timelineOut?.kill();
        this._timelineIn?.kill();

        this.timelineMouseleave?.kill();
        this.timelineMouseenter?.kill();

        this._timelineMenu = new gsap.timeline();

        this._timelineMenu.call(this._resetCameraPosition, null, 0);
        this._timelineMenu.call(this._resetAnimationProgress, null, 0);
        this._timelineMenu.set(this._uniforms[`u_step_factor_${this._id}`], { value: 0.5 }, 0);
        this._timelineMenu.set(this._uniforms[`u_size_${this._id}`], { value: 0.5 }, 0);
        this._timelineMenu.set(this._uniforms[`u_scale_${this._id}`], { value: 2 }, 0);
        this._timelineMenu.set(this._uniforms[`u_noise_alpha_${this._id}`], { value: 0 }, 0);

        return this._timelineMenu;
    }

    setActive() {
        this._isActive = true;
    }

    setInactive() {
        this._isActive = false;
    }

    setVisible() {
        this._isVisible = true;

        this._cameras.setActive();
    }

    setInvisible() {
        this._isVisible = false;

        this._cameras.setInactive();
    }

    setMenuState(state) {
        this._isMenu = state;

        this._cameras.setMenuState(state);
    }

    setModelCamera(camera) {
        this.cameras.setModelCamera(camera);

        this._cameraPosition.initial.set(camera.position.x, camera.position.y, camera.position.z);
        this._cameraRotation.initial.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);

        this._cameraRotation.target.x = this._cameraRotation.initial.x;
        this._cameraRotation.current.x = this._cameraRotation.initial.x;

        this._cameraRotation.target.y = this._cameraRotation.initial.y;
        this._cameraRotation.current.y = this._cameraRotation.initial.y;
    }

    mouseenter() {
        this.timelineMouseleave?.kill();
        this.timelineMouseenter = new gsap.timeline();
        this.timelineMouseenter.to(this._uniforms[`u_noise_alpha_${this._id}`], { duration: 0.5, value: 0.35, ease: 'expo.out' });
        this.timelineMouseenter.to(this._uniforms[`u_noise_alpha_${this._id}`], { duration: 0.6, value: 0.28, ease: 'sine.inOut' });

        return this.timelineMouseenter;
    }

    mouseleave() {
        this.timelineMouseenter?.kill();
        this.timelineMouseleave = new gsap.timeline();
        this.timelineMouseleave.to(this._uniforms[`u_noise_alpha_${this._id}`], { duration: 0.5, value: 0, ease: 'sine.inOut' });

        return this.timelineMouseleave;
    }

    setComplete() {
        this.timelineComplete = new gsap.timeline();
        this.timelineComplete.to(this._uniforms[`u_completed_${this._id}`], { duration: 0.05, value: 1 });
        this.timelineComplete.to(this._uniforms[`u_completed_alpha_${this._id}`], { duration: 0.05, value: 0.3 });

        return this.timelineComplete;
    }

    removeComplete() {
        this.timelineComplete = new gsap.timeline();
        this.timelineComplete.to(this._uniforms[`u_completed_${this._id}`], { duration: 0.05, value: 0 });
        this.timelineComplete.to(this._uniforms[`u_completed_alpha_${this._id}`], { duration: 0.05, value: 1 });

        return this.timelineComplete;
    }

    // Hooks
    mousemoveHandler(e) {
        if (!this._interactionsSettings.isEnable || !this._isActive) return;

        const positionFactor = this._interactionsSettings.positionFactor;
        const rotationFactor = this._interactionsSettings.rotationFactor;

        // Position
        this._cameraPosition.target.x = e.normalizedPosition.x * positionFactor.x;
        this._cameraPosition.target.y = e.normalizedPosition.y * positionFactor.y;

        // Rotation
        this._cameraRotation.target.x = e.normalizedPosition.y * rotationFactor.y * (Math.PI / 180) + this._cameraRotation.initial.x;
        this._cameraRotation.target.y = e.normalizedPosition.x * rotationFactor.x * (Math.PI / 180) + this._cameraRotation.initial.y;
    }

    update() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();
        const fps = Math.round(1 / delta);

        this._sceneFps = fps;
        this._sceneDelta = delta;

        this._updateCameraPosition();

        if (!this._debugCube) return;
        this._debugCube.rotation.x = time;
        this._debugCube.rotation.y = -time;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._renderTarget.setSize(this._width, this._height);
        this._cameras.resize(width, height);
    }

    /**
     * Private
     */
    _createRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        return renderTarget;
    }

    _createUniforms() {
        const uniforms = {};
        uniforms[`u_texture_${this._id}`] = { value: this._renderTarget.texture };
        uniforms[`u_texture_alpha_${this._id}`] = { value: 0 };
        uniforms[`u_step_factor_${this._id}`] = { value: 0.5 };
        uniforms[`u_size_${this._id}`] = { value: 0.5 };
        uniforms[`u_scale_${this._id}`] = { value: 2 };
        // Hover
        uniforms[`u_noise_alpha_${this._id}`] = { value: 0 };
        // Completed
        uniforms[`u_completed_${this._id}`] = { value: 0.0 };
        uniforms[`u_completed_alpha_${this._id}`] = { value: 1.0 };

        return uniforms;
    }

    _createCameras() {
        const cameras = new Cameras({
            sceneName: this._name,
            renderer: this._renderer,
            isActive: this._isActive,
            debugger: this._debugger,
            debugFolder: this._debugFolder,
            width: this._width,
            height: this._height,
            camera: this._camera,
        });

        return cameras;
    }

    _resetCameraPosition() {
        // Position
        this._cameraPosition.target.x = this._cameraPosition.initial.x;
        this._cameraPosition.target.y = this._cameraPosition.initial.y;

        // Rotation
        this._cameraRotation.target.x = this._cameraRotation.initial.x;
        this._cameraRotation.target.y = this._cameraRotation.initial.y;
    }

    _resetAnimationProgress() {
        const timelineProgress = new gsap.timeline();

        if (!this._animationControllers) return timelineProgress;

        for (let i = 0; i < this._animationControllers.length; i++) {
            const animationController = this._animationControllers[i];

            for (const key in animationController.actionType) {
                const animationAction = animationController.actionType[key];
                animationAction.paused = true;

                timelineProgress.to(animationAction, { duration: 1, time: 0 }, 0);
            }
        }

        return timelineProgress;
    }

    _updateCameraPosition() {
        // if (!this._interactionsSettings.isEnable || !this._isVisible) return;
        if (!this._interactionsSettings.isEnable) return;

        const damping = this._interactionsSettings.damping;

        // Position
        this._cameraPosition.current.x = math.lerp(this._cameraPosition.current.x, this._cameraPosition.target.x, damping);
        this._cameraPosition.current.y = math.lerp(this._cameraPosition.current.y, this._cameraPosition.target.y, damping);

        // Rotation
        this._cameraRotation.current.x = math.lerp(this._cameraRotation.current.x, this._cameraRotation.target.x, damping);
        this._cameraRotation.current.y = math.lerp(this._cameraRotation.current.y, this._cameraRotation.target.y, damping);

        this.cameras.main.position.set(this._cameraPosition.current.x, this._cameraPosition.current.z, this._cameraPosition.current.y);
        this.cameras.main.rotation.x = this._cameraRotation.current.x;
        this.cameras.main.rotation.y = this._cameraRotation.current.y;
    }

    _createDebugCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 'red',
        });

        const mesh = new THREE.Mesh(geometry, material);
        // this.add(mesh);

        return mesh;
    }

    _createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.add(ambientLight);

        return ambientLight;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: `Scene ${this._name}`, expanded: false });
        folder.addMonitor(this, '_sceneFps', { label: 'FPS' });

        const interactions = folder.addFolder({ title: 'Interactions', expanded: true });
        interactions.addInput(this._interactionsSettings, 'isEnable', { label: 'enable' });
        interactions.addInput(this._interactionsSettings.positionFactor, 'x', { label: 'Position X', min: -10, max: 10 });
        interactions.addInput(this._interactionsSettings.positionFactor, 'y', { label: 'Position Y', min: -10, max: 10 });
        // Degrees
        interactions.addInput(this._interactionsSettings.rotationFactor, 'x', { label: 'Rotation X', min: -90, max: 90 });
        interactions.addInput(this._interactionsSettings.rotationFactor, 'y', { label: 'Rotation Y', min: -90, max: 90 });
        interactions.addInput(this._interactionsSettings, 'damping', { label: 'Damping', min: 0, max: 1 });

        return folder;
    }

    _bindAll() {
        bindAll(
            this,
            'setActive',
            'setInactive',
            'setVisible',
            'setInvisible',
            '_resetCameraPosition',
            '_resetAnimationProgress',
        );
    }
}

export default RenderTargetScene;
