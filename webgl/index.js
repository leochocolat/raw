// Vendor
import gsap from 'gsap';
import * as THREE from 'three';

// Utils
import bindAll from '@/utils/bindAll';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import Debugger from '@/utils/Debugger';

// Scene
import SceneManager from '@/webgl/SceneManager';
import DebugSceneManager from '@/webgl/DebugSceneManager';

class WebglApp {
    constructor(options) {
        this._canvas = options.canvas;
        this._nuxtRoot = options.nuxtRoot;
        this._isDebug = options.isDebug;
        this._debugSceneName = options.debugSceneName;

        this._width = WindowResizeObserver.width;
        this._height = WindowResizeObserver.height;

        this._clock = new THREE.Clock();
        this._fps = 0;

        this._debugger = this._isDebug ? this._createDebugger() : null;
        this._renderer = this._createRenderer();
        this._sceneManager = this._createSceneManager();
        this._debugSceneManager = this._createDebugSceneManager();

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
        if (this._isDebug && this._debugSceneName) return;

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

    _createDebugSceneManager() {
        if (!this._isDebug || !this._debugSceneName) return;

        const debugSceneManager = new DebugSceneManager({
            canvas: this._canvas,
            renderer: this._renderer,
            nuxtRoot: this._nuxtRoot,
            isDebug: this._isDebug,
            debugger: this._debugger,
            width: this._width,
            height: this._height,
            sceneName: this._debugSceneName,
        });

        return debugSceneManager;
    }

    _resize() {
        this._renderer.setSize(this._width, this._height, true);
        this._sceneManager?.resize(this._width, this._height);
        this._debugSceneManager?.resize(this._width, this._height);
    }

    // On Tick
    _update() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();
        const fps = Math.round(1 / delta);
        this._fps = fps;

        this._sceneManager?.update(time, delta, fps);
        this._debugSceneManager?.update(time, delta, fps);

        this._render();
    }

    _render() {
        this._sceneManager?.render();
        this._debugSceneManager?.render();
    }

    _createDebugger() {
        const debugPanel = new Debugger({ title: '.RAW Debugger' });

        const performanceFolder = debugPanel.addFolder({ title: 'Performances', expanded: false });

        performanceFolder.addMonitor(this, '_fps', { label: 'FPS' });
        performanceFolder.addMonitor(this, '_fps', {
            label: 'FPS GRAPH',
            view: 'graph',
            min: 0,
            max: 100,
        });

        return debugPanel;
    }

    _bindAll() {
        bindAll(this, '_tickHandler', '_resizeHandler', '_mousemoveHandler');
    }

    _setupEventListeners() {
        gsap.ticker.add(this._tickHandler);
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
        window.addEventListener('mousemove', this._mousemoveHandler);
    }

    _removeEventListeners() {
        gsap.ticker.remove(this._tickHandler);
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
        window.removeEventListener('mousemove', this._mousemoveHandler);
    }

    _tickHandler() {
        this._update();
    }

    _resizeHandler({ width, height }) {
        this._width = width;
        this._height = height;

        this._resize();
    }

    _mousemoveHandler(e) {
        const position = new THREE.Vector2(e.clientX, e.clientY);
        const relativePosition = new THREE.Vector2(position.x / this._width, position.y / this._height);
        const normalizedPosition = new THREE.Vector2(relativePosition.x - 0.5, 1 - relativePosition.y - 0.5);

        this._sceneManager?.mousemoveHandler({
            position,
            relativePosition,
            normalizedPosition,
        });
    }
}

export default WebglApp;
