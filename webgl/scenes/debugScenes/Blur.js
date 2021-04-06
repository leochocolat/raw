// Vendor
import * as THREE from 'three';

// Postprocessing
import PostprocessScene from '../../objects/PostprocessScene';

// Shader
import vertex from '../../shaders/blur/vertex.glsl';
import fragment from '../../shaders/blur/fragment.glsl';

// Scene
import DebugScene from './DebugScene';

class Blur extends DebugScene {
    constructor(options) {
        super(options);

        this._postprocessScene = this._createPostprocessScene();
        this._postprocessPlane = this._createPostprocessPlane();
        this._finalPlane = this._createFinalPlane();
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

    render() {
        this._renderer.setRenderTarget(this._postprocessScene.renderTarget);
        this._renderer.render(this._postprocessScene, this._postprocessScene.camera);
        this._renderer.setRenderTarget(null);
        super.render();
    }

    /**
     * Private
     */
    _createPostprocessScene() {
        const scene = new PostprocessScene(this._width, this._height);

        return scene;
    }

    _createPostprocessPlane() {
        const geometry = new THREE.PlaneGeometry(this._width, this._height, 1);

        const texture = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1615431921909-37c4aed74df5?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60');

        const uniforms = {
            u_texture: { value: texture },
            u_blur_direction: { value: new THREE.Vector2(0, 1) },
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

        this._postprocessScene.add(mesh);

        return mesh;
    }

    _createFinalPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        const uniforms = {
            u_texture: { value: this._postprocessScene.renderTarget.texture },
            u_blur_direction: { value: new THREE.Vector2(1, 0) },
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
        const firstPath = this._debugFolder.addFolder({ title: 'First Path' });
        firstPath.addInput(this._postprocessPlane.material.uniforms.u_blur_direction, 'value', { label: 'Blur Direction' });

        const secondPath = this._debugFolder.addFolder({ title: 'Second Path' });
        secondPath.addInput(this._finalPlane.material.uniforms.u_blur_direction, 'value', { label: 'Blur Direction' });
    }
}

export default Blur;
