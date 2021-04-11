// Vendor
import * as THREE from 'three';

// Postprocessing
import BlurPlaneBuffer from '../../buffers/BlurPlaneBuffer';

// Shader
import vertex from '../../shaders/censorship/vertex.glsl';
import fragment from '../../shaders/censorship/fragment.glsl';

// Scene
import DebugScene from './DebugScene';

class Blur extends DebugScene {
    constructor(options) {
        super(options);

        this._time = 0;

        this._settings = {
            blur: 0,
        };

        this._texture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1615431921909-37c4aed74df5?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', () => {
            this._bufferA = this._createBufferA();
            this._bufferB = this._createBufferB();

            this._finalPlane = this._createFinalPlane();
        });

        this._addDebugSettings();
    }

    /**
     * Public
     */
    resize(width, height) {
        super.resize(width, height);

        if (!this._finalPlane) return;

        this._bufferA.resize(width, height);
        this._bufferB.resize(width, height);
    }

    update(time, delta) {
        this._time = time;

        super.update(time, delta);
    }

    render() {
        if (!this._finalPlane) return;

        this._applyBlur();

        super.render();
    }

    /**
     * Private
     */
    _createBufferA() {
        const buffer = new BlurPlaneBuffer(this._width, this._width, this._texture);

        return buffer;
    }

    _createBufferB() {
        const buffer = new BlurPlaneBuffer(this._width, this._width, this._texture);

        return buffer;
    }

    _createFinalPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        const uniforms = {
            u_texture: { value: this._texture },
            u_size: { value: new THREE.Vector2(this._texture.image.width, this._texture.image.height) },
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_time: { value: 0.0 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
            side: THREE.DoubleSide,
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
        this._debugFolder.expanded = true;
        this._debugFolder.addInput(this._settings, 'blur', { min: 0, max: 1 });
    }
}

export default Blur;
