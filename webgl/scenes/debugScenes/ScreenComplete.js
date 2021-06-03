// Vendor
import * as THREE from 'three';

// Utils
import { ResourceManager } from '@/utils/resource-loader';

// Shader
import vertex from '../../shaders/complete/vertex.glsl';
import fragment from '../../shaders/complete/fragment.glsl';

// Scene
import DebugScene from './DebugScene';
import bindAll from '@/utils/bindAll';

class ScreenComplete extends DebugScene {
    constructor(options) {
        super(options);

        this._resources = this._setupResources();

        this._isPlaying = false;

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    resize(width, height) {
        super.resize(width, height);

        if (!this._plane) return;
        this._plane.material.uniforms.u_resolution.value.set(width, height);
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this._plane) return;
        if (!this._isPlaying) return;
        this._plane.material.uniforms.u_time.value = time;
    }

    /**
     * Private
     */
    _setup() {
        this._material = this._createMaterial();
        this._plane = this._createPlane();
        this._addDebugSettings();
    }

    _createMaterial() {
        const uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_texture: { value: this._resources.get('video_test_0') },
            // Noise
            u_wobble_intensity: { value: 0.2 },
            u_line_intensity: { value: 2.0 },
            u_distortion_intensity: { value: 0.0 },
            u_texture_alpha: { value: 0.0 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        return material;
    }

    _createPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);
        const mesh = new THREE.Mesh(geometry, this._material);

        mesh.scale.x = 2;
        mesh.scale.y = 1.1;

        this.add(mesh);

        return mesh;
    }

    _setupResources() {
        const resources = new ResourceManager({ name: 'screen', namespace: 'screen' });
        resources.load();

        return resources;
    }

    _addDebugSettings() {
        const noise = this._debugFolder.addFolder({ title: 'Noise' });
        noise.addInput(this._plane.material.uniforms.u_wobble_intensity, 'value', { label: 'Wobble', min: 0, max: 1.0 });
        noise.addInput(this._plane.material.uniforms.u_line_intensity, 'value', { label: 'Line', min: 0, max: 10 });
        noise.addInput(this._plane.material.uniforms.u_distortion_intensity, 'value', { label: 'scan distortion', min: 0, max: 10 });
        noise.addInput(this._plane.material.uniforms.u_texture_alpha, 'value', { label: 'Texture alpha', min: 0, max: 1 });
        noise.addInput(this._plane.material.uniforms.u_time, 'value', { label: 'Time', min: 0, max: 10 });
        noise.addInput(this, '_isPlaying', { label: 'autoplay' });

        this._debugFolder.expanded = true;
    }

    _bindAll() {
        bindAll(this, '_resourcesReadyHandler');
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }
}

export default ScreenComplete;
