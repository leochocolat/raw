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
    update(time, delta) {}

    resize(width, height) {
        this._width = width;
        this._height = height;

        this.scale.set(this._width, this._height, 1);
    }

    /**
     * Private
     */
    _createGeometry() {
        const geometry = new THREE.PlaneGeometry(1, 1, 32);

        return geometry;
    }

    _createMaterial() {
        const uniforms = {};

        let index = 0;
        for (const key in this._scenes) {
            uniforms[`u_texture_${index}`] = { value: this._scenes[key].renderTarget.texture };
            index++;
        }

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader,
            vertexShader,
        });

        return material;
    }
}

export default ScreensContainer;
