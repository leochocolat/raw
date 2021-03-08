// Vendor
import ResourceLoader from '@/utils/ResourceLoader';
import * as THREE from 'three';

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

    updateActiveScreen(sceneName, sceneId) {
        let index = 0;
        for (const key in this._scenes) {
            if (key === sceneName) {
                this.material.uniforms[`u_textureAlpha_${sceneId}`].value = 1;
                this.material.uniforms[`u_stepFactor_${sceneId}`].value = 0;
            } else {
                this.material.uniforms[`u_textureAlpha_${index}`].value = 0;
                this.material.uniforms[`u_stepFactor_${index}`].value = 1;
            }
            index++;
        }
        this.material.uniforms.u_size.value = 0;
        this.material.uniforms.u_scale.value = 1;
    }

    updateInactiveScreen() {
        let index = 0;
        for (const key in this._scenes) {
            this.material.uniforms[`u_textureAlpha_${index}`].value = 1;
            this.material.uniforms[`u_stepFactor_${index}`].value = 0.5;
            index++;
        }
        this.material.uniforms.u_size.value = 0.5;
        this.material.uniforms.u_scale.value = 2;
    }

    update(time, delta) {
        this.material.uniforms.u_time.value = time;
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
        const geometry = new THREE.PlaneGeometry(1, 1, 64);

        return geometry;
    }

    _createMaterial() {
        const uniforms = {
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_size: { value: 0.5 },
            u_scale: { value: 2 },
            u_time: { value: 0.0 },
            u_scan_speed: { value: 1.0 },
            u_scan_strength: { value: 10.0 },
        };

        let index = 0;
        for (const key in this._scenes) {
            uniforms[`u_texture_${index}`] = { value: this._scenes[key].renderTarget.texture };
            uniforms[`u_textureAlpha_${index}`] = { value: 1 };
            uniforms[`u_stepFactor_${index}`] = { value: 0.5 };

            // Debug
            // uniforms[`u_texture_${index}`] = { value: ResourceLoader.get(`video_test_${index}`) };
            index++;
        }

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
