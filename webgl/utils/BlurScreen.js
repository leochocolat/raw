// Vendor
import * as THREE from 'three';

// Postprocessing
import BlurPlaneBuffer from '../buffers/BlurPlaneBuffer';

// Shader
import vertex from '../shaders/censorship/vertex.glsl';
import fragment from '../shaders/censorship/fragment.glsl';

// Data
import data from '@/webgl/data';

// Reduce to improve performances
const BUFFER_QUALITY_FACTOR = 0.2;

class BlurScreen {
    constructor(options) {
        this._settings = options.settings || data.settings.blur;

        this._blurFactor = options.blurFactor;
        this._blurValue = options.blurFactor * this._settings.intensityFactor;

        this._width = options.width;
        this._height = options.height;

        this._renderer = options.renderer;
        this._screenMesh = options.scenePlane;
        this._maskTexture = options.maskTexture;
        this._screenTexture = options.screenTexture;
        this._planeSize = options.size;
        this._screenAlpha = options.isScreenOff ? 0.0 : 1.0;
        this._isBlured = options.isInitiallyBlured;

        this._setup();
    }

    get blur() {
        return this._blurValue;
    }

    set blur(value) {
        this._blurValue = value * this._settings.intensityFactor;
    }

    get blurFactor() {
        return this._blurFactor;
    }

    set blurFactor(factor) {
        this._blurFactor = factor;
        this._blurValue = factor * this._settings.intensityFactor;
    }

    get blurIntensityFactor() {
        return this._settings.intensityFactor;
    }

    set blurIntensityFactor(factor) {
        this._settings.intensityFactor = factor;
        this._blurValue = this._blurFactor * this._settings.intensityFactor;
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
        this._resizeBuffers();
    }

    get meshTexture() {
        return this._screenMesh.material.uniforms.u_texture.value;
    }

    get meshMaterial() {
        return this._screenMesh.material;
    }

    set screenAlpha(value) {
        this._screenAlpha = value;
    }

    get screenAlpha() {
        return this._screenAlpha;
    }

    get isBlured() {
        return this._isBlured;
    }

    set isBlured(bool) {
        this._isBlured = bool;
        this._screenMesh.material.uniforms.u_is_blured.value = this._isBlured;
    }

    get material() {
        return this._screenMesh.material;
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

    updateSettings(settings) {
        this._settings = settings;

        this._bufferA.updateSettings(this._settings);
        this._bufferB.updateSettings(this._settings);

        this._blurValue = this._blurFactor * this._settings.intensityFactor;
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
        container.getSize(size);

        return size;
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
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._screenTexture, this._maskTexture, this._blurValue, this._settings);

        return buffer;
    }

    _createBufferB() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._screenTexture, this._maskTexture, this._blurValue, this._settings);

        return buffer;
    }

    _createFinalPlane() {
        const uniforms = {
            u_texture_initial: { value: this._screenTexture },
            u_blur_mask: { value: this._maskTexture },
            u_texture: { value: this._screenTexture },
            u_size: { value: new THREE.Vector2(this._bufferWidth, this._bufferHeight) },
            u_resolution: { value: new THREE.Vector2(this._containerSize.x, this._containerSize.y) },
            u_time: { value: 0.0 },
            u_alpha: { value: this._screenAlpha },
            u_is_blured: { value: this._isBlured },
        };

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
            const radius = (iterations - i - 1) * this._blurValue;
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
