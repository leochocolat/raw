// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

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

    get scenes() {
        return this._scenes;
    }

    start() {

    }

    setMenuState(state) {
        this._activeScene = state ? {} : this._activeScene;

        // If isMenu state is false assign directly
        if (!state) this._isMenu = state;

        this.menuTimeline = new gsap.timeline();

        if (state) this.menuTimeline.add(this._screensContainer.effectIn(), 0);

        for (const key in this._scenes) {
            if (state) this.menuTimeline.call(this._scenes[key].setVisible, null, 0);
            if (state) this.menuTimeline.call(this._scenes[key].setInactive, null, 0);
            if (state) this.menuTimeline.add(this._scenes[key].transitionToMenu(), 1);
            if (state) this.menuTimeline.add(this._scenes[key].show(), 1);
            this.menuTimeline.call(() => this._scenes[key].setMenuState(state), null, 1);
        }

        // If isMenu state is true assign after transition
        if (state) this.menuTimeline.call(() => { this._isMenu = state; }, null);
    }

    setActiveScene(sceneName) {
        if (!sceneName || sceneName === '') return;

        this._activeScene = this._scenes[sceneName];

        this.activeSceneTimeline = new gsap.timeline();

        let i = 0;
        for (const key in this._scenes) {
            if (key === sceneName) continue;
            i += 1;

            this.activeSceneTimeline.call(this._scenes[key].setInactive, null, 0);
            this.activeSceneTimeline.call(this._scenes[key].setInvisible, null, 0);
            this.activeSceneTimeline.add(this._scenes[key].transitionOut(), 0.1 * i);
            this.activeSceneTimeline.add(this._scenes[key].hide(), 0.1 * i);
        }

        this.activeSceneTimeline.add(this._activeScene.show(), 0);
        this.activeSceneTimeline.call(this._activeScene.setActive, null, 0);
        this.activeSceneTimeline.call(this._activeScene.setVisible, null, 0);

        this.activeSceneTimeline.add(this._activeScene.transitionIn(), 0);
        this.activeSceneTimeline.add(this._screensContainer.effectOut(), 0);
    }

    mousemoveHandler(mouse) {
        for (const key in this._scenes) {
            this._scenes[key].mousemoveHandler(mouse);
        }

        this._screensContainer.mousemoveHandler(mouse);
    }

    render() {
        for (const key in this._scenes) {
            const scene = this._scenes[key];

            // Partial Rendering
            if (this._isMenu && this._renderIndex !== scene.sceneId) continue;

            // Stop Rendering inactive scenes
            if (this._activeScene.sceneId !== undefined && this._activeScene.sceneId !== scene.sceneId) continue;

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

            // Stop Rendering inactive scenes
            if (this._activeScene.sceneId !== undefined && this._activeScene.sceneId !== scene.sceneId) continue;

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
