// Vendor
import * as THREE from 'three';

// Shader
import vertex from '../shaders/blur/vertex.glsl';
import fragment from '../shaders/blur/fragment.glsl';

class BlurPlaneBuffer extends THREE.WebGLRenderTarget {
    constructor(width, height, texture, alphaTexture, blurFactor, settings) {
        super(width, height);

        this._width = width;
        this._height = height;
        this._texture = texture;
        this._alphaTexture = alphaTexture;
        this._blurFactor = blurFactor;
        this._settings = settings;

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

    resize(width, height) {
        this._width = width;
        this._height = height;

        this.setSize(this._width, this._height);
        this._plane.scale.set(this._width, this._height);

        this._camera.left = this._width / -2;
        this._camera.right = this._width / 2;
        this._camera.top = this._height / 2;
        this._camera.bottom = this._height / -2;

        this._camera.updateProjectionMatrix();
    }

    update() {}

    updateSettings(settings) {
        this._settings = settings;

        this._plane.material.uniforms.u_spreading_treshold.value = this._settings.spreadingTreshold;
        this._plane.material.uniforms.u_wobble_intensity.value = this._settings.wobbleIntensity;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new THREE.OrthographicCamera(this._width / -2, this._width / 2, this._height / 2, this._height / -2, 1, 1000);

        camera.position.z = 1;

        return camera;
    }

    _createScene() {
        const scene = new THREE.Scene();

        return scene;
    }

    _createPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        const uniforms = {
            u_texture: { value: this._texture },
            u_alphaTexture: { value: this._alphaTexture },
            u_blur_direction: { value: new THREE.Vector2(0, 0) },
            u_blur_factor: { value: this._blurFactor },
            u_spreading_treshold: { value: this._settings.spreadingTreshold },
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_wobble_intensity: { value: this._settings.wobbleIntensity },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
        });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.scale.set(this._width, this._height);

        this._scene.add(mesh);

        return mesh;
    }
}

export default BlurPlaneBuffer;
