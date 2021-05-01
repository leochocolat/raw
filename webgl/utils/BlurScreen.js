// Vendor
import * as THREE from 'three';

// Postprocessing
import BlurPlaneBuffer from '../buffers/BlurPlaneBuffer';

// Shader
import vertex from '../shaders/censorship/vertex.glsl';

import fragment from '../shaders/censorship/fragment.glsl';

// Reduce to improve performances
const BUFFER_QUALITY_FACTOR = 0.4;

class BlurScreen {
    constructor(options) {
        this._settings = {
            blur: options.blurFactor,
        };

        this._width = options.width;
        this._height = options.height;

        this._renderer = options.renderer;
        this._screenMesh = options.scenePlane;
        this._maskTexture = options.maskTexture;
        this._screenTexture = options.screenTexture;

        this._setup();
    }

    get blur() {
        return this._settings.blur;
    }

    set blur(value) {
        this._settings.blur = value;
    }

    /**
     * Public
     */
    resize(width, height) {
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
    }

    _getBufferSize() {
        // Set buffer size with texture aspect ratio
        const aspectRatio = this._screenTexture.image.width / this._screenTexture.image.height;
        const width = this._width * BUFFER_QUALITY_FACTOR;
        const height = width / aspectRatio;
        // console.log()
        this._bufferWidth = width;
        this._bufferHeight = height;
    }

    _setup() {
        this._getBufferSize();

        this._bufferA = this._createBufferA();
        this._bufferB = this._createBufferB();
        this._createFinalPlane();
    }

    _createBufferA() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._screenTexture, this._maskTexture);

        return buffer;
    }

    _createBufferB() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._screenTexture, this._maskTexture);

        return buffer;
    }

    _createFinalPlane() {
        const uniforms = {
            u_texture_initial: { value: this._screenTexture },
            u_blur_mask: { value: this._maskTexture },
            u_texture: { value: this._screenTexture },
            u_size: { value: new THREE.Vector2(this._bufferWidth, this._bufferHeight) },
            u_resolution: { value: new THREE.Vector2(1, 1) },
            u_time: { value: 0.0 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this._screenMesh.material = material;
    }

    _applyBlur() {
        const iterations = 8;

        let writeBuffer = this._bufferA; // Execute blur
        let readBuffer = this._bufferB; // Recieve blur

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

    // _addDebugSettings() {
    //     this._debugFolder.expanded = true;
    //     this._debugFolder.addInput(this._settings, 'blur', { min: 0, max: 5 });
    // }

    // // Events
    // _bindAll() {
    //     this._loadCompleteHandler = this._loadCompleteHandler.bind(this);
    // }

    // _setupEventListeners() {
    //     this._resources.addEventListener('complete', this._loadCompleteHandler);
    // }

    // _loadCompleteHandler() {
    // }
}

export default BlurScreen;
