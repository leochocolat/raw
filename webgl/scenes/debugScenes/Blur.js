// Vendor
import * as THREE from 'three';

// Shader
import vertex from '../../shaders/blur/vertex.glsl';
import fragment from '../../shaders/blur/fragment.glsl';

// Scene
import DebugScene from './DebugScene';

class Blur extends DebugScene {
    constructor(options) {
        super(options);

        this._model = this._createModel();
        this._addDebugSettings();
    }

    /**
     * Public
     */
    resize(width, height) {
        super.resize(width, height);
    }

    update(time, delta) {
        super.update(time, delta);
    }

    /**
     * Private
     */
    _createPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1.5, 1);

        const texture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1615431921909-37c4aed74df5?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60');

        const uniforms = {
            u_texture: { value: texture },
            u_blur_level: { value: 0.5 },
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_time: { value: 0.0 },
        };

        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        return mesh;
    }

    _addDebugSettings() {
        this._debugFolder.expanded = true;
        this._debugFolder.addInput(this._plane.material.uniforms.u_blur_level, 'value', { label: 'blur value', min: 0, max: 1 });
    }
}

export default Blur;
