// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Utils
import SceneResourceLoader from '@/utils/SceneResourceLoader';

// Shader
import vertex from '../../shaders/screen-effect/vertex.glsl';
import fragment from '../../shaders/screen-effect/fragment.glsl';

// Scene
import DebugScene from './DebugScene';
import bindAll from '@/utils/bindAll';

class Screen extends DebugScene {
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
            u_global_intensity: { value: 1 },
            u_blue_filter_intensity: { value: 0.1 },
            u_crt_bending: { value: 0.2 },
            // Scanline
            u_scanline_vertical: { value: true },
            u_scanline_amount_factor: { value: 1 },
            u_scanline_speed: { value: 20 },
            u_scanline_min_intensity: { value: 0.01 },
            u_scanline_max_intensity: { value: 0.06 },
            // RGB Shift
            u_rgb_shift_amount: { value: 0.002 },
            u_rgb_shift_angle: { value: new THREE.Vector2(0.0, 1.0) },
            // Noise
            u_noise_intensity: { value: 0.04 },
            u_noise_scale: { value: 150.0 },
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
        const resources = new SceneResourceLoader();
        resources.addResource('video_test_0');
        resources.load();

        return resources;
    }

    _addDebugSettings() {
        this._debugFolder.expanded = true;
        this._debugFolder.addInput(this._plane.material.uniforms.u_global_intensity, 'value', { label: 'Effect Intensity', min: 0, max: 1 });
        this._debugFolder.addInput(this._plane.material.uniforms.u_blue_filter_intensity, 'value', { label: 'Blue filter intensity', min: 0, max: 1 });
        this._debugFolder.addInput(this._plane.material.uniforms.u_crt_bending, 'value', { label: 'CRT Bending', min: 0, max: 1 });

        const scanline = this._debugFolder.addFolder({ title: 'Scanline' });
        scanline.addInput(this._plane.material.uniforms.u_scanline_vertical, 'value', { label: 'Vertical' });
        scanline.addInput(this._plane.material.uniforms.u_scanline_speed, 'value', { label: 'Speed', min: 0, max: 100 });
        scanline.addInput(this._plane.material.uniforms.u_scanline_amount_factor, 'value', { label: 'Amount factor', min: 1, max: 3 });
        scanline.addInput(this._plane.material.uniforms.u_scanline_min_intensity, 'value', { label: 'Min intensity', min: 0, max: 1 });
        scanline.addInput(this._plane.material.uniforms.u_scanline_max_intensity, 'value', { label: 'Max intensity', min: 0, max: 1 });

        const RGBShift = this._debugFolder.addFolder({ title: 'RGB Shift' });
        RGBShift.addInput(this._plane.material.uniforms.u_rgb_shift_amount, 'value', { label: 'amount', min: 0, max: 0.1 });
        RGBShift.addInput(this._plane.material.uniforms.u_rgb_shift_angle, 'value', { label: 'angle' });

        const noise = this._debugFolder.addFolder({ title: 'Noise' });
        noise.addInput(this._plane.material.uniforms.u_noise_intensity, 'value', { label: 'intensity', min: 0, max: 0.5 });
        noise.addInput(this._plane.material.uniforms.u_noise_scale, 'value', { label: 'scale', min: 10, max: 500 });

        const animations = this._debugFolder.addFolder({ title: 'Animations' });
        animations.addButton({ title: 'Animate out' }).on('click', this._debugAnimationOutClickHandler);
        animations.addButton({ title: 'Animate in' }).on('click', this._debugAnimationInClickHandler);
    }

    _bindAll() {
        bindAll(this, '_resourcesReadyHandler', '_debugAnimationOutClickHandler', '_debugAnimationInClickHandler');
    }

    _setupEventListeners() {
        this._resources.addEventListener('ready', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }

    _debugAnimationOutClickHandler() {
        console.log('click');

        this._timelineIn?.kill();

        this._timelineOut = new gsap.timeline();
        this._timelineOut.to(this._plane.material.uniforms.u_global_intensity, { value: 0.0, duration: 2 });
        this._timelineOut.to(this.camera.position, { z: 1.9, duration: 2 }, 0);

        return this._timelineOut;
    }

    _debugAnimationInClickHandler() {
        this._timelineOut?.kill();

        this._timelineIn = new gsap.timeline();
        this._timelineIn.to(this._plane.material.uniforms.u_global_intensity, { value: 1.0, duration: 2 });
        this._timelineIn.to(this.camera.position, { z: 2, duration: 2 }, 0);

        return this._timelineIn;
    }
}

export default Screen;
