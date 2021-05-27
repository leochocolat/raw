// Vendor
import * as THREE from 'three';

// Postprocessing
import BlurPlaneBuffer from '../buffers/BlurPlaneBuffer';

// Shader
import vertex from '../shaders/censorship/vertex.glsl';
import fragment from '../shaders/censorship/fragment.glsl';

const BLUR_INTENSITY_FACTOR = 3.5;

// Reduce to improve performances
const BUFFER_QUALITY_FACTOR = 0.4;

class BlurScreen {
    constructor(options) {
        this._settings = {
            blur: options.blurFactor * BLUR_INTENSITY_FACTOR,
        };

        this._blurFactor = options.blurFactor;

        this._width = options.width;
        this._height = options.height;

        this._renderer = options.renderer;
        this._screenMesh = options.scenePlane;
        this._maskTexture = options.maskTexture;
        this._screenTexture = options.screenTexture;
        this._planeSize = options.size;

        this._setup();
    }

    get blur() {
        return this._settings.blur;
    }

    set blur(value) {
        this._settings.blur = value * BLUR_INTENSITY_FACTOR;
    }

    get blurFactor() {
        return this._blurFactor;
    }

    set blurFactor(factor) {
        this._blurFactor = factor;
        this._settings.blur = factor * BLUR_INTENSITY_FACTOR;
    }

    get planeSize() {
        return this._planeSize;
    }

    set planeSize(value) {
        this._planeSize = value;
        this._screenMesh.material.uniforms.u_resolution.value.set(value.x, value.y);
    }

    get screenTexture() {
        return this._screenTexture;
    }

    set screenTexture(value) {
        this._screenTexture = value;
    }

    /**
     * Public
     */
    resize(width, height) {
        this._width = width;
        this._height = height;

        if (!this._screenMesh) return;

        this._resizeBuffers();
    }

    update(time, delta) {
        if (!this._screenMesh) return;

        this._applyBlur();
    }

    /**
     * Private
     */
    _resizeBuffers() {
        this._getBufferSize();

        this._bufferA.resize(this._bufferWidth, this._bufferHeight);
        this._bufferB.resize(this._bufferWidth, this._bufferHeight);

        this._screenMesh.material.uniforms.u_size.value.set(this._bufferWidth, this._bufferHeight);
    }

    _getContainerSize() {
        const container = new THREE.Box3().setFromObject(this._screenMesh);
        const size = new THREE.Vector3();

        return container.getSize(size);
    }

    _getBufferSize() {
        // Set buffer size with texture aspect ratio
        const videoAspectRatio = this._screenTexture.image.videoWidth / this._screenTexture.image.videoHeight;
        const aspectRatio = this._screenTexture.image.width / this._screenTexture.image.height;

        const ratio = aspectRatio || videoAspectRatio;

        const width = this._width * BUFFER_QUALITY_FACTOR;
        const height = width / ratio;

        this._bufferWidth = width;
        this._bufferHeight = height;
    }

    _setup() {
        this._getBufferSize();

        this._containerSize = this._planeSize || this._getContainerSize();

        this._bufferA = this._createBufferA();
        this._bufferB = this._createBufferB();

        this._createFinalPlane();
    }

    _createBufferA() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._screenTexture, this._maskTexture, this._settings.blur);

        return buffer;
    }

    _createBufferB() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._screenTexture, this._maskTexture, this._settings.blur);

        return buffer;
    }

    _createFinalPlane() {
        const uniforms = {
            u_texture_initial: { value: this._screenTexture },
            u_blur_mask: { value: this._maskTexture },
            u_texture: { value: this._screenTexture },
            u_size: { value: new THREE.Vector2(this._bufferWidth, this._bufferHeight) },
            u_resolution: { value: new THREE.Vector2(this._containerSize.x, this._containerSize.z) },
            u_time: { value: 0.0 },
        };

        // add skinning shader
        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
            side: THREE.DoubleSide,
            transparent: true,
            skinning: true,
        });

        this._screenMesh.material = material;
    }

    _applyBlur() {
        const iterations = 8;

        let writeBuffer = this._bufferA; // Execute blur
        let readBuffer = this._bufferB; // Recieve blur

        this._bufferA.plane.material.uniforms.u_blur_factor.value = this._blurFactor;
        this._bufferB.plane.material.uniforms.u_blur_factor.value = this._blurFactor;

        for (let i = 0; i < iterations; i++) {
            const radius = (iterations - i - 1) * this._settings.blur;
            writeBuffer.plane.material.uniforms.u_blur_direction.value.x = i % 2 === 0 ? radius : 0;
            writeBuffer.plane.material.uniforms.u_blur_direction.value.y = i % 2 === 0 ? 0 : radius;

            this._renderer.setRenderTarget(writeBuffer);
            this._renderer.render(writeBuffer.scene, writeBuffer.camera);

            readBuffer.plane.material.uniforms.u_texture.value = writeBuffer.texture;

            this._renderer.setRenderTarget(readBuffer);
            this._renderer.render(readBuffer.scene, readBuffer.camera);

            // Swap buffers
            const t = writeBuffer;
            writeBuffer = readBuffer;
            readBuffer = t;
        }

        this._renderer.setRenderTarget(null);

        this._screenMesh.material.uniforms.u_texture.value = readBuffer.texture;

        readBuffer.plane.material.uniforms.u_texture.value = this._screenTexture;
        writeBuffer.plane.material.uniforms.u_texture.value = this._screenTexture;
    }
}

export default BlurScreen;
