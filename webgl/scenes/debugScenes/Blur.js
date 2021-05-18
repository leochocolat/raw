// Vendor
import * as THREE from 'three';

// Postprocessing
import BlurPlaneBuffer from '../../buffers/BlurPlaneBuffer';

// Shader
import vertex from '../../shaders/censorship/vertex.glsl';
import fragment from '../../shaders/censorship/fragment.glsl';

// Utils
import { ResourceManager } from '@/utils/resource-loader';

// Scene
import DebugScene from './DebugScene';

// Reduce to improve performances
const BUFFER_QUALITY_FACTOR = 0.4;

class Blur extends DebugScene {
    constructor(options) {
        super(options);

        this._settings = {
            blur: 0,
        };

        this._bindAll();

        this._resources = this._setupResources();

        this._setupEventListeners();
        this._addDebugSettings();
    }

    /**
     * Public
     */
    resize(width, height) {
        super.resize(width, height);

        if (!this._finalPlane) return;

        this._resizeBuffers();
    }

    update(time, delta) {
        super.update(time, delta);
    }

    render() {
        if (!this._finalPlane) return;

        this._applyBlur();
    }

    setCensorship(censorshipFactor) {
        this._settings.blur = censorshipFactor * 5;
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
        const videoAspectRatio = this._texture.image.videoWidth / this._texture.image.videoHeight;
        const aspectRatio = this._texture.image.width / this._texture.image.height;

        const ratio = aspectRatio || videoAspectRatio;

        const width = this._width * BUFFER_QUALITY_FACTOR;
        const height = width / ratio;

        this._bufferWidth = width;
        this._bufferHeight = height;
    }

    _setupResources() {
        const resources = new ResourceManager({
            name: 'blur',
            namespace: 'blur',
        });

        resources.addByName('video-gore-test');

        resources.load();

        return resources;
    }

    _setup() {
        this._texture = this._resources.get('video-gore-test');
        this._maskTexture = this._resources.get('blur-mask-test');

        this._getBufferSize();

        this._bufferA = this._createBufferA();
        this._bufferB = this._createBufferB();
        this._finalPlane = this._createFinalPlane();
    }

    _createBufferA() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._texture, this._maskTexture);

        return buffer;
    }

    _createBufferB() {
        const buffer = new BlurPlaneBuffer(this._bufferWidth, this._bufferHeight, this._texture, this._maskTexture);

        return buffer;
    }

    _createFinalPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        const uniforms = {
            u_texture_initial: { value: this._texture },
            u_blur_mask: { value: this._maskTexture },
            u_texture: { value: this._texture },
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

        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        return mesh;
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

        this._finalPlane.material.uniforms.u_texture.value = readBuffer.texture;

        readBuffer.plane.material.uniforms.u_texture.value = this._texture;
        writeBuffer.plane.material.uniforms.u_texture.value = this._texture;
    }

    _addDebugSettings() {
        this._debugFolder.addInput(this._settings, 'blur', { min: 0, max: 5 });
        this._debugFolder.expanded = true;
    }

    // Events
    _bindAll() {
        this._loadCompleteHandler = this._loadCompleteHandler.bind(this);
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._loadCompleteHandler);
    }

    _loadCompleteHandler() {
        this._setup();
    }
}

export default Blur;
