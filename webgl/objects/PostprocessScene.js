// Vendor
import * as THREE from 'three';

class PostprocessScene extends THREE.Scene {
    constructor(width, height, camera) {
        super();

        this._width = width;
        this._height = height;
        this._originalCamera = camera;

        this._renderTarget = this._createRenderTarget();
        this._camera = this._createCamera();
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

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._renderTarget.setSize(this._width, this._height);
        this._camera.left = this._width / -2;
        this._camera.right = this._width / 2;
        this._camera.top = this._width / 2;
        this._camera.bottom = this._width / -2;
        this._camera.updateProjectionMatrix();
    }

    _createRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(this._height, this._height);

        return renderTarget;
    }

    _createCamera() {
        const camera = new THREE.OrthographicCamera(this._width / -2, this._width / 2, this._height / 2, this._height / -2, 1, 1000);
        camera.position.z = 1;

        return camera;
    }
}

export default PostprocessScene;
