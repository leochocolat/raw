// Vendor
import gsap from 'gsap';
import * as THREE from 'three';

// Utils
import bindAll from '@/utils/bindAll';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import Debugger from '@/utils/Debugger';

// Scene
import SceneManager from '@/webgl/SceneManager';

class WebglApp {
    constructor(options) {
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._isDebug = options.isDebug;

        this._width = WindowResizeObserver.width;
        this._height = WindowResizeObserver.height;

        this._clock = new THREE.Clock();

        this._debugger = this._isDebug ? this._createDebugger() : null;
        this._renderer = this._createRenderer();
        this._sceneManager = this._createSceneManager();

        this._resize();

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    get sceneManager() {
        return this._sceneManager;
    }

    destroy() {
        this._removeEventListeners();
        this._debugger?.destroy();
    }

    /**
     * Private
     */
    _createRenderer() {
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            canvas: this._canvas,
            alpha: false,
        });

        renderer.setPixelRatio(1);

        return renderer;
    }

    _createSceneManager() {
        const sceneManager = new SceneManager({
            canvas: this._canvas,
            renderer: this._renderer,
            nuxtRoot: this._nuxtRoot,
            isDebug: this._isDebug,
            debugger: this._debugger,
            width: this._width,
            height: this._height,
        });

        return sceneManager;
    }

    _createDebugger() {
        const debugPanel = new Debugger({ title: '.RAW Debugger' });

        return debugPanel;
    }

    _resize() {
        this._renderer.setSize(this._width, this._height, true);
        this._sceneManager.resize(this._width, this._height);
    }

    // On Tick
    _update() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();

        this._sceneManager.update(time, delta);

        this._render();
    }

    _render() {
        this._sceneManager.render();
    }

    _bindAll() {
        bindAll(this, '_tickHandler', '_resizeHandler');
    }

    _setupEventListeners() {
        gsap.ticker.add(this._tickHandler);
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
    }

    _removeEventListeners() {
        gsap.ticker.remove(this._tickHandler);
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
    }

    _tickHandler() {
        this._update();
    }

    _resizeHandler({ width, height }) {
        this._width = width;
        this._height = height;

        this._resize();
    }
}

export default WebglApp;
