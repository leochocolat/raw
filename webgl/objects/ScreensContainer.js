// Vendor
import ResourceLoader from '@/utils/ResourceLoader';
import * as THREE from 'three';
import gsap from 'gsap';

// Shaders
import fragmentShader from '../shaders/screen/fragment.glsl';
import vertexShader from '../shaders/screen/vertex.glsl';

class ScreensContainer extends THREE.Mesh {
    constructor(options) {
        super();

        this._scenes = options.scenes;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();
        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Public
     */

    updateActiveScreen() {
        // gsap.to(this.material.uniforms.u_size, { value: 0, duration: 0.8, ease: 'power3.inOut' });
        // gsap.to(this.material.uniforms.u_scale, { value: 1, duration: 0.8, ease: 'power3.inOut' });
    }

    updateInactiveScreen() {
        // gsap.to(this.material.uniforms.u_size, { value: 0.5, duration: 0.5, ease: 'power3.inOut' });
        // gsap.to(this.material.uniforms.u_scale, { value: 2, duration: 0.5, ease: 'power3.inOut' });
    }

    update(time, delta) {
        this.material.uniforms.u_time.value = time;

        for (const key in this._scenes) {
            const index = this._scenes[key].sceneId;
            this.material.uniforms[`u_texture_${index}`].value = this._scenes[key].uniforms[`u_texture_${index}`].value;
            this.material.uniforms[`u_texture_alpha_${index}`].value = this._scenes[key].uniforms[`u_texture_alpha_${index}`].value;
            this.material.uniforms[`u_step_factor_${index}`].value = this._scenes[key].uniforms[`u_step_factor_${index}`].value;

            // Debug
            // uniforms[`u_texture_${index}`] = { value: ResourceLoader.get(`video_test_${index}`) };
        }
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this.scale.set(this._width, this._height, 1);
        this.material.uniforms.u_resolution.value.set(this._width, this._height);
    }

    /**
     * Private
     */
    _createGeometry() {
        const geometry = new THREE.PlaneGeometry(1, 1, 2);

        return geometry;
    }

    _createMaterial() {
        const scenesUniforms = [];
        for (const key in this._scenes) {
            const sceneUniform = this._scenes[key].uniforms;
            scenesUniforms.push(sceneUniform);
        }

        const uniforms = {
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_time: { value: 0.0 },
            u_scan_speed: { value: 1.0 },
            u_scan_strength: { value: 10.0 },
            ...scenesUniforms[0],
            ...scenesUniforms[1],
            ...scenesUniforms[2],
            ...scenesUniforms[3],
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader,
            vertexShader,
            transparent: true,
        });

        return material;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const debugFolder = this._debugger.addFolder({ title: 'Screens Container', expanded: false });

        debugFolder.addInput(this.material.uniforms.u_scan_speed, 'value', { label: 'Scan speed', min: 0.0, max: 5.0 });
        debugFolder.addInput(this.material.uniforms.u_scan_strength, 'value', { label: 'Scan strength', min: 0.0, max: 50.0 });

        return debugFolder;
    }
}

export default ScreensContainer;
