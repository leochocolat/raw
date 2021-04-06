// Vendor
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class DebugScene extends THREE.Scene {
    constructor(options) {
        super();

        this._name = options.name;
        this._renderer = options.renderer;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;

        this.background = new THREE.Color('grey');

        this._camera = this._createCamera();
        this._orbitControls = this._createOrbitControls();
        this._debugCube = this._createDebugCube();
        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Public
     */
    get camera() {
        return this._camera;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }

    update(time, delta) {}

    render() {}

    /**
     * Private
     */
    _createCamera() {
        const camera = new THREE.PerspectiveCamera(30, this._width / this._height, 0.1, 1000);
        camera.position.z = 2;

        return camera;
    }

    _createOrbitControls() {
        const orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
        return orbitControls;
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

    _createDebugFolder() {
        const debugFolder = this._debugger.addFolder({ title: this._name, expanded: false });

        return debugFolder;
    }
}

export default DebugScene;
