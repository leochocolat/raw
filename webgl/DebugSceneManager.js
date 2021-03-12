// Scenes
import scenesData from '@/webgl/scenes';

class DebugSceneManager {
    constructor(options) {
        this._canvas = options.canvas;
        this._renderer = options.renderer;
        this._nuxtRoot = options.nuxtRoot;
        this._isDebug = options.isDebug;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;

        this._sceneName = options.sceneName;

        this._scene = this._createScene();
    }

    /**
     * Public
     */
    resize(width, height) {
        this._scene.resize(width, height);
    }

    update(time, delta) {
        this._scene.update(time, delta);
    }

    render() {
        this._renderer.render(this._scene, this._scene.camera);
    }

    /**
     * Private
     */
    _createScene() {
        if (!scenesData[this._sceneName]) {
            console.error(`Error: Scene '${this._sceneName}' could not be found.`);
            return;
        }

        const scene = new scenesData[this._sceneName]({
            name: this._sceneName,
            debugger: this._debugger,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
        });

        return scene;
    }
}

export default DebugSceneManager;
