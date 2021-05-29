// Vendor
import * as THREE from 'three';

// Utils
import { ResourceManager } from '@/utils/resource-loader';

// Shader
import vertex from '../../shaders/rewind/vertex.glsl';
import fragment from '../../shaders/rewind/fragment.glsl';

// Scene
import DebugScene from './DebugScene';
import bindAll from '@/utils/bindAll';

class ScreenRewind extends DebugScene {
    constructor(options) {
        super(options);

        this._resources = this._setupResources();

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
            u_texture_displacement: { value: this._resources.get('screen-rewind-displacement') },
            u_wobble_intensity: { value: 0.5 },
            u_distortion_intensity: { value: 0.02 },
            u_distortion_speed: { value: 1.0 },
            u_distortion_size: { value: 0.05 },
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
        const resources = new ResourceManager();
        resources.addByName('screen-rewind-displacement');
        resources.addByName('video_test_0');
        resources.load();

        return resources;
    }

    _addDebugSettings() {
        this._debugFolder.addInput(this._plane.material.uniforms.u_wobble_intensity, 'value', { label: 'Wooble', min: 0, max: 1 });
        this._debugFolder.addInput(this._plane.material.uniforms.u_distortion_intensity, 'value', { label: 'Distortion Intensity', min: 0, max: 0.5 });
        this._debugFolder.addInput(this._plane.material.uniforms.u_distortion_speed, 'value', { label: 'Distortion Speed', min: 0, max: 5 });
        this._debugFolder.addInput(this._plane.material.uniforms.u_distortion_size, 'value', { label: 'Distortion Size Y', min: 0, max: 0.1 });

        const inputImage = this.debugger.addInputMedia(this._resources.get('screen-rewind-displacement').image, {
            type: 'image',
            title: 'Upload file',
            label: 'Image',
            folder: this._debugFolder,
        });

        inputImage.on('update', this._imageUpdateHandler);

        this._debugFolder.expanded = true;
    }

    _bindAll() {
        bindAll(this, '_resourcesReadyHandler', '_imageUpdateHandler');
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }

    _imageUpdateHandler(image) {
        this._plane.material.uniforms.u_texture_displacement.value = new THREE.Texture(image);
        this._plane.material.uniforms.u_texture_displacement.value.needsUpdate = true;
    }
}

export default ScreenRewind;
