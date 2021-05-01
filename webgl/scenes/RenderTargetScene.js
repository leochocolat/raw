// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Data
import data from '../data';

// Object
import Cameras from '../objects/Cameras';

// Utils
import math from '@/utils/math';

class RenderTargetScene extends THREE.Scene {
    constructor(options) {
        super();

        this._name = options.name;
        this._id = options.id;
        this._renderer = options.renderer;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;

        // this.background = new THREE.Color(data.colors[this._id]);

        this._initialCameraPosition = new THREE.Vector3(0, 0, 0);
        this._initialCameraRotation = new THREE.Vector3(0, 0, 0);

        this._cameraPosition = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
        };

        this._cameraRotation = {
            current: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
        };

        this._interactionsSettings = JSON.parse(JSON.stringify(data.settings.mouseInteractions));

        this._clock = new THREE.Clock();
        this._sceneFps = 0;
        this._sceneDelta = 0;

        this._renderTarget = this._createRenderTarget();
        // this._debugCube = this._createDebugCube();
        this._ambientLight = this._createAmbientLight();
        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
        this._uniforms = this._createUniforms();
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

    get interactionsSettings() {
        return this._interactionsSettings;
    }

    show() {
        const timelineShow = new gsap.timeline();

        timelineShow.to(this._uniforms[`u_texture_alpha_${this._id}`], { value: 1, ease: 'power4.inOut' });

        return timelineShow;
    }

    transitionIn() {
        this._timelineOut?.kill();
        this._timelineMenu?.kill();

        this._timelineIn = new gsap.timeline();

        this._timelineIn.to(this._uniforms[`u_step_factor_${this._id}`], { value: 0, duration: 0.8, ease: 'power4.inOut' }, 0);
        this._timelineIn.to(this._uniforms[`u_size_${this._id}`], { value: 0, duration: 0.8, ease: 'power3.inOut' }, 0);
        this._timelineIn.to(this._uniforms[`u_scale_${this._id}`], { value: 1, duration: 0.8, ease: 'power3.inOut' }, 0);

        return this._timelineIn;
    }

    transitionOut() {
        this._timelineIn?.kill();
        this._timelineMenu?.kill();

        this._timelineOut = new gsap.timeline();

        this._timelineOut.to(this._uniforms[`u_step_factor_${this._id}`], { value: 1, duration: 0.8, ease: 'power4.inOut' }, 0);

        return this._timelineOut;
    }

    transitionToMenu() {
        this._timelineOut?.kill();
        this._timelineIn?.kill();

        this._timelineMenu = new gsap.timeline();

        this._timelineMenu.to(this._uniforms[`u_step_factor_${this._id}`], { value: 0.5, duration: 0.8, ease: 'power3.inOut' }, 0);
        this._timelineMenu.to(this._uniforms[`u_size_${this._id}`], { value: 0.5, duration: 0.8, ease: 'power3.inOut' }, 0);
        this._timelineMenu.to(this._uniforms[`u_scale_${this._id}`], { value: 2, duration: 0.8, ease: 'power3.inOut' }, 0);

        return this._timelineMenu;
    }

    setActive() {
        this._isActive = true;
        this._cameras.setActive();
    }

    setInactive() {
        this._isActive = false;

        // Position
        this._cameraPosition.target.x = 0;
        this._cameraPosition.target.y = 0;

        // Rotation
        this._cameraRotation.target.x = 0;
        this._cameraRotation.target.y = 0;

        this._cameras.setInactive();
    }

    setMenuState(state) {
        this._isMenu = state;

        // Position
        this._cameraPosition.target.x = 0;
        this._cameraPosition.target.y = 0;

        // Rotation
        this._cameraRotation.target.x = 0;
        this._cameraRotation.target.y = 0;

        this._cameras.setMenuState(state);
    }

    setModelCamera(camera) {
        this.cameras.setModelCamera(camera);

        // Apply positions and rotation to Vectors used for mouse interactions
        this._cameraPosition.current.set(camera.position.x, camera.position.y, camera.position.z);
        this._cameraPosition.target.set(camera.position.x, camera.position.y, camera.position.z);

        this._cameraRotation.current.set(camera.rotation.y, camera.rotation.x, camera.rotation.z);
        this._cameraRotation.target.set(camera.rotation.y, camera.rotation.x, camera.rotation.z);

        this._initialCameraRotation.set(camera.rotation.y, camera.rotation.x, camera.rotation.z);
    }

    // Hooks
    mousemoveHandler(e) {
        if (!this._interactionsSettings.isEnable || !this._isActive || this._isMenu) return;

        const positionFactor = this._interactionsSettings.positionFactor;
        const rotationFactor = this._interactionsSettings.rotationFactor;

        // Position
        this._cameraPosition.target.x = e.normalizedPosition.x * positionFactor.x + this._initialCameraPosition.x;
        this._cameraPosition.target.y = e.normalizedPosition.y * positionFactor.y + this._initialCameraPosition.y;

        // Rotation
        this._cameraRotation.target.x = e.normalizedPosition.x * rotationFactor.x * (Math.PI / 180) + this._initialCameraRotation.x;
        this._cameraRotation.target.y = e.normalizedPosition.y * rotationFactor.y * (Math.PI / 180) + this._initialCameraRotation.y;
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

    _updateCameraPosition() {
        if (!this._interactionsSettings.isEnable || !this._isActive || this._isMenu) return;

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
        interactions.addInput(this._interactionsSettings.positionFactor, 'x', { label: 'Position X', min: 0, max: 10 });
        interactions.addInput(this._interactionsSettings.positionFactor, 'y', { label: 'Position Y', min: 0, max: 10 });
        // Degrees
        interactions.addInput(this._interactionsSettings.rotationFactor, 'x', { label: 'Rotation X', min: -90, max: 90 });
        interactions.addInput(this._interactionsSettings.rotationFactor, 'y', { label: 'Rotation Y', min: -90, max: 90 });
        interactions.addInput(this._interactionsSettings, 'damping', { label: 'Damping', min: 0, max: 1 });

        return folder;
    }
}

export default RenderTargetScene;
