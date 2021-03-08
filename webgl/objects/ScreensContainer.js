// Vendor
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

    update(time, delta) {}

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
        const geometry = new THREE.PlaneGeometry(1, 1, 32);

        return geometry;
    }

    _createMaterial() {
        const uniforms = {
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_size: { value: 0.5 },
            u_scale: { value: 2 },
        };

        let index = 0;
        for (const key in this._scenes) {
            uniforms[`u_texture_${index}`] = { value: this._scenes[key].renderTarget.texture };
            uniforms[`u_textureAlpha_${index}`] = { value: 1 };
            uniforms[`u_stepFactor_${index}`] = { value: 0.5 };

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
}

export default ScreensContainer;
