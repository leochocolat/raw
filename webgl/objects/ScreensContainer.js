// Vendor
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
    }

    /**
     * Public
     */

    updateActiveScreen(sceneName, sceneId) {
        let index = 0;
        for (const key in this._scenes) {
            if (key === sceneName) {
                gsap.to(this.material.uniforms[`u_textureAlpha_${sceneId}`], { value: 1, duration: 0.8, ease: 'power4.inOut' });
                gsap.to(this.material.uniforms[`u_stepFactor_${sceneId}`], { value: 0, duration: 0.8, ease: 'power4.inOut' });
            } else {
                gsap.to(this.material.uniforms[`u_textureAlpha_${index}`], { value: 0, duration: 0.85, delay: 0.1 });
                gsap.to(this.material.uniforms[`u_stepFactor_${index}`], { value: 1, duration: 0.85, delay: 0.1 });
            }
            index++;
        }
        gsap.to(this.material.uniforms.u_size, { value: 0, duration: 0.8, ease: 'power3.inOut' });
        gsap.to(this.material.uniforms.u_scale, { value: 1, duration: 0.8, ease: 'power3.inOut' });
    }

    updateInactiveScreen() {
        let index = 0;

        for (const key in this._scenes) {
            gsap.to(this.material.uniforms[`u_textureAlpha_${index}`], { value: 1, duration: 0.8, ease: 'power3.inOut' });
            gsap.to(this.material.uniforms[`u_stepFactor_${index}`], { value: 0.5, duration: 0.8, ease: 'power3.inOut' });
            index++;
        }
        gsap.to(this.material.uniforms[`u_stepFactor_${index}`], { value: 0.5 });

        gsap.to(this.material.uniforms.u_size, { value: 0.5, duration: 0.5, ease: 'power3.inOut' });
        gsap.to(this.material.uniforms.u_scale, { value: 2, duration: 0.5, ease: 'power3.inOut' });
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
