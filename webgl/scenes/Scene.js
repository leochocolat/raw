// Vendor
import * as THREE from 'three';

class Scene extends THREE.Scene {
    constructor(options) {
        super();

        this._width = options.width;
        this._height = options.height;

        this.background = new THREE.Color('green');

        this._renderTarget = this._createRenderTarget();
        this._camera = this._createCamera();
        this._debugCube = this._createDebugCube();
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

    update(time, delta) {
        this._debugCube.rotation.x = time;
        this._debugCube.rotation.y = -time;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._renderTarget.setSize(this._width, this._height);
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

    _createDebugCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 'red',
        });

        const mesh = new THREE.Mesh(geometry, material);

        this.add(mesh);

        return mesh;
    }
}

export default Scene;
