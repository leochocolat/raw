class CanvasBlurEditor {
    constructor(options = {}) {
        this._width = options.width;
        this._height = options.height;

        this._isVisible = false;

        this._container = document.body.querySelector('.js-canvas-size-helper');
        this._canvas = this._createCanvas();
        this._ctx = this._canvas.getContext('2d');
    }

    /**
     * Public
     */
    get visible() {
        return this._isVisible;
    }

    set visible(bool) {
        this._isVisible = bool;
        this._canvas.style.opacity = this._isVisible ? 1 : 0;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    destroy() {
        this._canvas.remove();
    }

    /**
     * Private
     */
    _createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = this._width;
        canvas.height = this._height;

        canvas.style.width = this._width;
        canvas.style.height = this._height;
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.left = 0;
        canvas.style.margin = 'auto';
        canvas.style.zIndex = 1;
        canvas.style.border = 'solid 1px black';
        canvas.style.opacity = this._isVisible ? 1 : 0;

        this._container.appendChild(canvas);

        return canvas;
    }
}

export default CanvasBlurEditor;
