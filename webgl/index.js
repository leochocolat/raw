// Vendor
import gsap from 'gsap';
import * as THREE from 'three';

// Utils
import bindAll from '@/utils/bindAll';
import math from '@/utils/math';
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

        this._mousePosition = {
            current: {
                position: new THREE.Vector2(this._width / 2, this._height / 2),
                relativePosition: new THREE.Vector2(0.5, 0.5),
                normalizedPosition: new THREE.Vector2(0, 0),
            },
            target: {
                position: new THREE.Vector2(this._width / 2, this._height / 2),
                relativePosition: new THREE.Vector2(0.5, 0.5),
                normalizedPosition: new THREE.Vector2(0, 0),
            },
        };

        this._settings = {
            mouseInteractions: {
                isEnable: true,
                positionFactor: { x: 1, y: 1 },
                // Degrees
                rotationFactor: { x: -30, y: -30 },
                damping: 0.1,
            },
        };

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
            antialias: true,
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

        this._updateMousePosition();

        this._render();
    }

    _render() {
        this._sceneManager?.render();
        this._debugSceneManager?.render();
    }

    _updateMousePosition() {
        this._mousePosition.current.position.x = math.lerp(this._mousePosition.current.position.x, this._mousePosition.target.position.x, this._settings.mouseInteractions.damping);
        this._mousePosition.current.position.y = math.lerp(this._mousePosition.current.position.y, this._mousePosition.target.position.y, this._settings.mouseInteractions.damping);

        this._mousePosition.current.relativePosition.x = math.lerp(this._mousePosition.current.relativePosition.x, this._mousePosition.target.relativePosition.x, this._settings.mouseInteractions.damping);
        this._mousePosition.current.relativePosition.y = math.lerp(this._mousePosition.current.relativePosition.y, this._mousePosition.target.relativePosition.y, this._settings.mouseInteractions.damping);

        this._mousePosition.current.normalizedPosition.x = math.lerp(this._mousePosition.current.normalizedPosition.x, this._mousePosition.target.normalizedPosition.x, this._settings.mouseInteractions.damping);
        this._mousePosition.current.normalizedPosition.y = math.lerp(this._mousePosition.current.normalizedPosition.y, this._mousePosition.target.normalizedPosition.y, this._settings.mouseInteractions.damping);

        this._sceneManager?.mousemoveHandler({
            position: { current: this._mousePosition.current.position, target: this._mousePosition.target.position },
            relativePosition: { current: this._mousePosition.current.relativePosition, target: this._mousePosition.target.relativePosition },
            normalizedPosition: { current: this._mousePosition.current.normalizedPosition, target: this._mousePosition.target.normalizedPosition },
            settings: this._settings.mouseInteractions,
        });
    }

    // Debugger
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

        const interactions = debugPanel.addFolder({ title: 'Interactions', expanded: true });
        interactions.addInput(this._settings.mouseInteractions, 'isEnable', { label: 'enable' });
        interactions.addInput(this._settings.mouseInteractions.positionFactor, 'x', { label: 'Position X', min: 0, max: 5 });
        interactions.addInput(this._settings.mouseInteractions.positionFactor, 'y', { label: 'Position Y', min: 0, max: 5 });
        // Degrees
        interactions.addInput(this._settings.mouseInteractions.rotationFactor, 'x', { label: 'Rotation X', min: -90, max: 90 });
        interactions.addInput(this._settings.mouseInteractions.rotationFactor, 'y', { label: 'Rotation Y', min: -90, max: 90 });
        interactions.addInput(this._settings.mouseInteractions, 'damping', { label: 'Damping', min: 0, max: 1 });

        return debugPanel;
    }

    // Events
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
        this._mousePosition.target.position.set(e.clientX, e.clientY);
        this._mousePosition.target.relativePosition.set(this._mousePosition.target.position.x / this._width, this._mousePosition.target.position.y / this._height);
        this._mousePosition.target.normalizedPosition.set(this._mousePosition.target.relativePosition.x - 0.5, 1 - this._mousePosition.target.relativePosition.y - 0.5);
    }
}

export default WebglApp;
