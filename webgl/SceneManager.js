// Vendor
import * as THREE from 'three';

// Objects
import Screen from '@/webgl/objects/Screen';
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
        this._screens = this._createScreens();
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
    }

    setActiveScene(sceneName) {
        const activeScene = this._scenes[sceneName];
        const activeScreen = this._screens[sceneName];
        activeScene.setActive();
        activeScreen.setActive();

        this._screensContainer.updateActiveScreen(sceneName, activeScreen.sceneId);

        for (const key in this._scenes) {
            if (key === sceneName) continue;
            this._scenes[key].setInactive();
            this._screens[key].setInactive();
        }

        this._activeScene = activeScene;
    }

    setInactive() {
        this._screensContainer.updateInactiveScreen();

        for (const key in this._scenes) {
            this._scenes[key].setInactive();
            this._screens[key].setInactive();
        }

        this._activeScene = {};
    }

    render() {
        for (const key in this._scenes) {
            const scene = this._scenes[key];
            if (this._isMenu && this._renderIndex !== scene.sceneId) continue;
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

            if (this._isMenu && this._updateIndex !== scene.sceneId) continue;
            scene.update(time, delta);

            const screen = this._screens[key];
            screen.update(time, delta);
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

            const screen = this._screens[key];
            screen.resize(width, height);
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

    _createScreens() {
        const screens = {};

        let index = 0;
        for (const key in data.scenes) {
            const screen = new Screen({
                name: key,
                id: index,
                debugger: this._debugger,
                width: this._width,
                height: this._height,
                map: this._scenes[key].renderTarget.texture,
                isActive: false,
            });
            screens[key] = screen;
            // this.add(screen);
            index++;
        }

        return screens;
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
                    this.setInactive();
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
