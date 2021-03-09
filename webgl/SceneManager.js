// Vendor
import * as THREE from 'three';

// Objects
import ScreensContainer from '@/webgl/objects/ScreensContainer';

// Scenes
import scenesData from '@/webgl/scenes';

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

        this._activeScene = {};

        // Parital Rendering
        this._renderIndex = 0;
        this._updateIndex = 0;

        this._debugFolder = this._createDebugger();

        this._camera = this._createCamera();
        this._scenes = this._createScenes();
        this._screensContainer = this._createScreensContainer();
    }

    /**
     * Public
     */
    get camera() {
        return this._camera;
    }

    get activeScene() {
        return this._activeScene;
    }

    setMenuState(state) {
        this._isMenu = state;

        for (const key in this._scenes) {
            if (state) this._scenes[key].transitionToMenu();
            this._scenes[key].setMenuState(state);
            this._scenes[key].setActive();
        }

        this._activeScene = {};
    }

    setActiveScene(sceneName) {
        const activeScene = this._scenes[sceneName];
        activeScene.transitionIn();
        activeScene.setActive();

        for (const key in this._scenes) {
            if (key === sceneName) continue;
            this._scenes[key].transitionOut();
            this._scenes[key].setInactive();
        }

        this._activeScene = activeScene;
    }

    render() {
        for (const key in this._scenes) {
            const scene = this._scenes[key];
            // Partial Rendering
            if (this._isMenu && this._renderIndex !== scene.sceneId) continue;

            // TODO: Stop Rendering inactive scenes

            this._renderer.setRenderTarget(scene.renderTarget);
            this._renderer.render(scene, scene.camera);
            this._renderer.setRenderTarget(null);
        }

        this._renderer.render(this, this._camera);

        // Partial Rendering
        this._renderIndex = (this._updateIndex + 1) % 4;
    }

    update(time, delta) {
        for (const key in this._scenes) {
            const scene = this._scenes[key];
            // Partial Rendering
            if (this._isMenu && this._updateIndex !== scene.sceneId) continue;

            // TODO: Stop Updating inactive scenes

            scene.update(time, delta);
        }

        this._screensContainer.update(time, delta);

        // Partial Rendering
        this._updateIndex = (this._updateIndex + 1) % 4;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        for (const key in this._scenes) {
            const scene = this._scenes[key];
            scene.resize(width, height);
        }

        this._screensContainer.resize(width, height);

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
        const scenes = {};

        let index = 0;
        for (const key in data.scenes) {
            const scene = new scenesData[key]({
                name: key,
                id: index,
                debugger: this._debugger,
                width: this._width,
                height: this._height,
                isActive: false,
                renderer: this._renderer,
            });
            scenes[key] = scene;
            index++;
        }

        return scenes;
    }

    _createScreensContainer() {
        const screensContainer = new ScreensContainer({
            scenes: this._scenes,
            debugger: this._debugger,
            width: this._width,
            height: this._height,
            isActive: false,
        });

        screensContainer.position.z = 1;

        this.add(screensContainer);

        return screensContainer;
    }

    _createDebugger() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'Scene Manager', expanded: false });

        const activeScene = { name: this._activeScene.name || '' };
        folder
            .addInput(activeScene, 'name', {
                options: { none: '', ...data.scenes },
            })
            .on('change', () => {
                if (activeScene.name === '') {
                    this.setMenuState(true);
                } else {
                    this.setActiveScene(activeScene.name);
                    this.setMenuState(false);
                }
            });

        return folder;
    }
}

export default SceneManager;
