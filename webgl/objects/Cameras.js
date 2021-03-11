// Vendor
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Cameras {
    constructor(options) {
        this._renderer = options.renderer;
        this._isActive = options.isActive;
        this._width = options.width;
        this._height = options.height;
        this._debugger = options.debugFolder;

        this._mainCamera = this._createMainCamera();
        this._debugCamera = this._createDebugCamera();
        this._isDebug = !!this._debugger;
        this._active = this._isDebug ? this._debugCamera : this._mainCamera;
        this._orbitControls = this._createOrbitControls();

        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Public
     */
    get active() {
        return this._active;
    }

    get main() {
        return this._mainCamera;
    }

    get debug() {
        return this._debugCamera;
    }

    setActive() {
        this._isActive = true;
        this._setActiveCamera();
    }

    setInactive() {
        this._isActive = false;
        this._setActiveCamera();
    }

    setMenuState(state) {
        this._isMenu = state;
        this._setActiveCamera();
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._mainCamera.aspect = this._width / this._height;
        this._mainCamera.updateProjectionMatrix();

        this._debugCamera.aspect = this._width / this._height;
        this._debugCamera.updateProjectionMatrix();
    }

    setModelCamera(camera) {
        this._mainCamera = camera;
    }

    /**
     * Private
     */
    _createMainCamera() {
        const camera = new THREE.PerspectiveCamera(75, this._width / this._height, 0.1, 1000);
        camera.position.z = 2;

        return camera;
    }

    _createDebugCamera() {
        const camera = new THREE.PerspectiveCamera(75, this._width / this._height, 0.1, 1000);
        camera.position.z = 2;

        return camera;
    }

    _createOrbitControls() {
        const orbitControls = new OrbitControls(this._debugCamera, this._renderer.domElement);
        orbitControls.enabled = this._isDebug && this._isActive;
        return orbitControls;
    }

    _setActiveCamera() {
        this._active = this._isDebug ? this._debugCamera : this._mainCamera;
        this._orbitControls.enabled = this._isDebug && this._isActive && !this._isMenu;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const debugFolder = this._debugger.addFolder({ title: 'Cameras', expanded: false });
        debugFolder.addInput(this, '_isDebug', { label: 'isDebug' }).on('change', () => {
            this._setActiveCamera();
        });

        return debugFolder;
    }
}

export default Cameras;
