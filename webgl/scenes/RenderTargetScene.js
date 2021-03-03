// Vendor
import * as THREE from 'three';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class RenderTargetScene extends THREE.Scene {
    constructor(options) {
        super();

        this._name = options.name;
        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;
        this._renderer = options.renderer;
        this.background = new THREE.Color(data.colors[this._id]);

        this._renderTarget = this._createRenderTarget();
        this._camera = this._createCamera();
        this._debugCube = this._createDebugCube();

        this._orbitControls = this._createOrbitControls();
        this._ambientLight = this._createAmbientLight();

        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Public
     */
    get camera() {
        return this._camera;
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
        this._orbitControls.enabled = true;
    }

    setInactive() {
        this._isActive = false;
        this._orbitControls.enabled = false;
    }

    update(time, delta) {
        if (!this._isActive) return;

        this._debugCube.rotation.x = time;
        this._debugCube.rotation.y = -time;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._renderTarget.setSize(this._width, this._height);

        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }

    /**
     * Private
     */
    _createRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        return renderTarget;
    }

    _createCamera() {
        const camera = new THREE.PerspectiveCamera(75, this._width / this._height, 0.1, 1000);
        camera.position.z = 2;

        return camera;
    }

    _createOrbitControls() {
        const orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
        orbitControls.enabled = false;
        return orbitControls;
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
