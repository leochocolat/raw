// Vendor
import * as THREE from 'three';

// Shader
import vertex from '../shaders/blur/vertex.glsl';
import fragment from '../shaders/blur/fragment.glsl';

class BlurPlaneBuffer extends THREE.WebGLRenderTarget {
    constructor(width, height, texture) {
        super(width, height);

        this._width = width;
        this._height = height;
        this._texture = texture;

        this._camera = this._createCamera();
        this._scene = this._createScene();
        this._plane = this._createPlane();
    }

    /**
     * Public
     */
    get camera() {
        return this._camera;
    }

    get scene() {
        return this._scene;
    }

    get plane() {
        return this._plane;
    }

    resize(width, height) {}

    update() {}

    /**
     * Private
     */
    _createCamera() {
        // const camera = new THREE.OrthographicCamera(this._width / -2, this._width / 2, this._height / 2, this._height / -2, 1, 1000);
        // camera.position.z = 1;

        const camera = new THREE.PerspectiveCamera(30, this._width / this._height, 0.1, 1000);
        camera.position.z = 2;

        return camera;
    }

    _createScene() {
        const scene = new THREE.Scene();

        return scene;
    }

    _createPlane() {
        // const geometry = new THREE.PlaneGeometry(this._width, this._height, 1);
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        const uniforms = {
            u_texture: { value: this._texture },
            u_blur_direction: { value: new THREE.Vector2(0, 0) },
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_time: { value: 0.0 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
        });

        const mesh = new THREE.Mesh(geometry, material);

        this._scene.add(mesh);

        return mesh;
    }
}

export default BlurPlaneBuffer;
