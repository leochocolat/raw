// Vendor
import * as THREE from 'three';

const RESIZE_DEBOUNCE_VALUE = 200;

class CanvasBlurEditor {
    constructor(options = {}) {
        this._width = options.width;
        this._height = options.height;

        this._debugger = options.debugger;

        this._viewportWidth = options.viewportWidth;
        this._viewportHeight = options.viewportHeight;

        this._allowPaint = false;
        this._allowZoom = false;

        // Settings
        this._isVisible = true;
        this._pencilRelativeRadius = 0.5;
        this._pencilRadius = this._pencilRelativeRadius * this._width / 2;
        this._pencilHardness = 0.5;
        this._pencilOpacity = 0.5;

        this._mousePosition = new THREE.Vector2(0, 0);

        this._container = document.body.querySelector('.js-canvas-size-helper');
        this._canvas = this._createCanvas();
        this._ctx = this._canvas.getContext('2d');

        this._texture = new THREE.CanvasTexture(this._canvas);
        this._texture.needsUpdate = true;
        this._texture.flipY = false;

        this._createHistory();

        this._bindAll();

        this._setupEventListeners();
    }

    /**
     * Public
     */
    get canvas() {
        return this._canvas;
    }

    get texture() {
        return this._texture;
    }

    get visible() {
        return this._isVisible;
    }

    set visible(bool) {
        this._isVisible = bool;
        this._canvas.style.opacity = this._isVisible ? 1 : 0;
    }

    get pencilRelativeRadius() {
        return this._pencilRelativeRadius;
    }

    set pencilRelativeRadius(radius) {
        this._pencilRelativeRadius = radius;
        this._pencilRadius = this._pencilRelativeRadius * this._width / 2;
    }

    get pencilHardness() {
        return this._pencilHardness;
    }

    set pencilHardness(hardness) {
        this._pencilHardness = hardness;
    }

    get pencilOpacity() {
        return this._pencilOpacity;
    }

    set pencilOpacity(opacity) {
        this._pencilOpacity = opacity;
    }

    get allowZoom() {
        return this._allowZoom;
    }

    set allowZoom(bool) {
        this._allowZoom = bool;

        if (bool) {
            this._container.style.pointerEvents = 'none';
            this._canvas.style.pointerEvents = 'none';
        } else {
            this._container.style.pointerEvents = 'all';
            this._canvas.style.pointerEvents = 'all';
        }
    }

    update() {
        // this._draw();

        this._texture.needsUpdate = true;
    }

    resize({ width, height, viewportWidth, viewportHeight }) {
        if (!this._isResizing) {
            this._save();
        }

        this._isResizing = true;

        this._viewportWidth = viewportWidth;
        this._viewportHeight = viewportHeight;

        this._width = width;
        this._height = height;

        this._canvas.width = this._width;
        this._canvas.height = this._height;

        this._canvas.style.width = `${this._width}px`;
        this._canvas.style.height = `${this._height}px`;

        this._pencilRadius = this._pencilRelativeRadius * this._width / 2;

        clearTimeout(this._debounceTimeout);
        this._debounceTimeout = setTimeout(this._resizeEndHandler, RESIZE_DEBOUNCE_VALUE);
    }

    destroy() {
        this._canvas.remove();
        this._removeEventListeners();
    }

    mousemove(e) {
        this._mousePosition.x = e.position.x - ((this._viewportWidth - this._width) / 2);
        this._mousePosition.y = e.position.y - ((this._viewportHeight - this._height) / 2);

        this._draw();
    }

    export(filename) {
        const downloadButton = document.createElement('a');
        downloadButton.download = `${filename}.png`;
        downloadButton.href = this._canvas.toDataURL('image/png');
        downloadButton.click();
    }

    clear() {
        this._ctx.clearRect(0, 0, this._width, this._height);
    }

    revert() {
        this._restore();
    }

    /**
     * Private
     */
    _createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this._width;
        canvas.height = this._height;

        canvas.style.width = `${this._width}px`;
        canvas.style.height = `${this._height}px`;
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.left = 0;
        canvas.style.margin = 'auto';
        // canvas.style.zIndex = 1;
        canvas.style.border = 'solid 1px white';
        canvas.style.pointerEvents = 'all';
        canvas.style.opacity = this._isVisible ? 1 : 0;

        this._container.appendChild(canvas);

        if (this._allowZoom) {
            this._container.style.pointerEvents = 'none';
            canvas.style.pointerEvents = 'none';
        } else {
            this._container.style.pointerEvents = 'all';
            canvas.style.pointerEvents = 'all';
        }

        return canvas;
    }

    _createHistory() {
        this._history = [];
        this._save();
    }

    _draw() {
        this._drawCircle();
    }

    _drawCircle() {
        if (!this._allowPaint) return;

        this._ctx.save();

        this._ctx.filter = `blur(${this._pencilHardness * this._pencilRadius * 0.5}px)`;

        this._ctx.fillStyle = `rgba(255, 255, 255, ${this._pencilOpacity})`;

        this._ctx.beginPath();
        this._ctx.arc(this._mousePosition.x, this._mousePosition.y, this._pencilRadius, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.closePath();

        this._ctx.restore();
    }

    _save() {
        const currentImage = new Image();
        currentImage.src = this._canvas.toDataURL('image/png');
        this._history.push(currentImage);
    }

    _restore() {
        if (this._history.length === 0) return;

        const lastImage = this._history.pop();
        this._ctx.clearRect(0, 0, this._width, this._height);
        // this._ctx.fillRect(0, 0, this._width, this._height);
        this._ctx.drawImage(lastImage, 0, 0, this._width, this._height);
    }

    /**
     * Events
     */
    _bindAll() {
        this._mousedownHandler = this._mousedownHandler.bind(this);
        this._mouseupHandler = this._mouseupHandler.bind(this);
        this._keydownHandler = this._keydownHandler.bind(this);
        this._keyupHandler = this._keyupHandler.bind(this);
        this._resizeEndHandler = this._resizeEndHandler.bind(this);
    }

    _setupEventListeners() {
        this._container.addEventListener('mousedown', this._mousedownHandler);
        window.addEventListener('mouseup', this._mouseupHandler);
        this._container.addEventListener('touchstart', this._mousedownHandler);
        window.addEventListener('touchend', this._mouseupHandler);
        document.addEventListener('keydown', this._keydownHandler);
        document.addEventListener('keyup', this._keyupHandler);
    }

    _removeEventListeners() {
        this._container.removeEventListener('mousedown', this._mousedownHandler);
        window.removeEventListener('mouseup', this._mouseupHandler);
        this._container.removeEventListener('touchstart', this._mousedownHandler);
        window.removeEventListener('touchend', this._mouseupHandler);
        document.removeEventListener('keydown', this._keydownHandler);
        document.removeEventListener('keyup', this._keyupHandler);
    }

    _mousedownHandler(e) {
        this._save();

        this._allowPaint = true;

        this._draw();
    }

    _mouseupHandler(e) {
        this._allowPaint = false;
    }

    _keydownHandler(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            this.revert();
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
            this.clear();
        }

        if (e.metaKey || e.ctrlKey) {
            this.allowZoom = true;
            this._debugger.refresh();
        }

        if (e.code === 'Space') {
            this.visible = false;
            this._debugger.refresh();
        }
    }

    _keyupHandler(e) {
        if (e.code === 'Space') {
            this.visible = true;
            this._debugger.refresh();
        } else {
            this.allowZoom = false;
            this._debugger.refresh();
        }
    }

    _resizeEndHandler() {
        this._isResizing = false;

        this._restore();
    }
}

export default CanvasBlurEditor;
