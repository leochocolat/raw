// Vendor
import * as THREE from 'three';

// Objects
import Screen from '@/webgl/objects/Screen';

// Scenes
import Scene from '@/webgl/scenes/Scene';

// Data
import data from './data';

const PESPECTIVE = 800;

class SceneManager extends THREE.Scene {
    constructor(options) {
        super();
        this._canvas = options.canvas;
        this._renderer = options.renderer;
        this._nuxtRoot = options.nuxtRoot;
        this._isDebug = options.isDebug;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;

        this._camera = this._createCamera();
        this._scenes = this._createScenes();
        this._screens = this._createScreens();
    }

    /**
     * Public
     */
    get camera() {
        return this._camera;
    }

    render() {
        for (let i = 0; i < this._scenes.length; i++) {
            const scene = this._scenes[i];
            this._renderer.setRenderTarget(scene.renderTarget);
            this._renderer.render(scene, scene.camera);
            this._renderer.setRenderTarget(null);
        }

        this._renderer.render(this, this._camera);
    }

    update(time, delta) {
        for (let i = 0; i < this._scenes.length; i++) {
            const scene = this._scenes[i];
            scene.update(time, delta);
        }
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        for (let i = 0; i < this._scenes.length; i++) {
            const scene = this._scenes[i];
            scene.resize(width, height);

            const screen = this._screens[i];
            screen.resize(width, height);
        }

        this._camera.fov = (180 * (2 * Math.atan(this._height / 2 / PESPECTIVE))) / Math.PI;
        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }

    /**
     * Private
     */
    _createCamera() {
        const fov = (180 * (2 * Math.atan(this._height / 2 / PESPECTIVE))) / Math.PI;

        const camera = new THREE.PerspectiveCamera(fov, this._width / this._height, 1, 1000);
        camera.position.set(0, 0, PESPECTIVE);

        return camera;
    }

    _createScenes() {
        const scenes = [];

        for (let i = 0; i < 4; i++) {
            const scene = new Scene({
                id: i,
                debugger: this._debugger,
                width: this._width,
                height: this._height,
                isActive: false,
            });

            scenes.push(scene);
        }

        return scenes;
    }

    _createScreens() {
        const screens = [];

        for (let i = 0; i < 4; i++) {
            const screen = new Screen({
                id: i,
                width: this._width,
                height: this._height,
                map: this._scenes[i].renderTarget.texture,
                isActive: false,
            });

            this.add(screen);
            screens.push(screen);
        }

        return screens;
    }
}

export default SceneManager;
