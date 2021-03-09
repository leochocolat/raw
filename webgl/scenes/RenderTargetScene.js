// Vendor
import * as THREE from 'three';

// Data
import data from '../data';

// Object
import Cameras from '../objects/Cameras';

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
        this.background = new THREE.Color(data.colors[this._id]);

        this._clock = new THREE.Clock();
        this._sceneFps = 0;
        this._sceneDelta = 0;

        this._renderTarget = this._createRenderTarget();
        this._debugCube = this._createDebugCube();
        this._ambientLight = this._createAmbientLight();
        this._debugFolder = this._createDebugFolder();
        this._cameras = this._createCameras();
    }

    /**
     * Public
     */
    get sceneId() {
        return this._id;
    }

    get camera() {
        return this._cameras.active;
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

    setActive() {
        this._isActive = true;
        this._cameras.setActive();
    }

    setInactive() {
        this._isActive = false;
        this._cameras.setInactive();
    }

    update() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();
        const fps = Math.round(1 / delta);

        this._sceneFps = fps;
        this._sceneDelta = delta;

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

    _createCameras() {
        const cameras = new Cameras({
            renderer: this._renderer,
            isActive: this._isActive,
            debugger: this._debugger,
            debugFolder: this._debugFolder,
            width: this._width,
            height: this._height,
        });

        return cameras;
    }

    _createDebugCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 'red',
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

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

        return folder;
    }
}

export default RenderTargetScene;
