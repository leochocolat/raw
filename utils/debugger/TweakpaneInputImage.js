class TweakpaneInputImage {
    constructor(image, options) {
        this._options = options;

        this._image = image;
        this._source = this._image.src;
        this._image.alt = this._source.replace(/^.*[\\\/]/, '');
        this._image.preview = '';

        this._button = this._createButton();
        this._input = this._createInput();
        this._monitor = this._createMonitor();
        this._previewMonitor = this._createPreviewMonitor();
        this._fileReader = this._createFileReader();

        this._isOriginalImage = true;

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    on(event, callback) {
        if (event === 'update') {
            this._updateCallback = callback;
        }
    }

    /**
     * Private
     */
    _createButton() {
        const button = this._options.folder.addButton({
            title: this._options.title,
            label: this._options.label,
        });

        return button;
    }

    _createInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg, image/jpg';
        document.body.append(input);

        return input;
    }

    _createMonitor() {
        const monitor = this._options.folder.addMonitor(this._image, 'alt', { label: 'name' });

        return monitor;
    }

    _createPreviewMonitor() {
        const monitor = this._options.folder.addMonitor(this._image, 'preview', {
            bufferSize: 10,
        });

        const el = monitor.controller_.view.valueElement;
        const container = el.querySelector('div');
        container.innerHTML = '';
        container.style.overflow = 'hidden';
        container.style.cursor = 'pointer';
        container.style.fontSize = 0;
        el.style.backgroundColor = 'white';
        this._image.style.width = '100%';
        this._image.style.height = 'auto';
        this._image.style.height = 'auto';

        container.appendChild(this._image);

        monitor.el = container;

        return monitor;
    }

    _createFileReader() {
        const reader = new FileReader();
        return reader;
    }

    _readFile() {
        this._fileReader.readAsDataURL(this._input.files[0]);
    }

    _updateImage() {
        this._image.alt = this._input.files[0].name;
        this._image.src = this._fileReader.result;
    }

    _bindAll() {
        this._clickHandler = this._clickHandler.bind(this);
        this._inputHandler = this._inputHandler.bind(this);
        this._fileReadHandler = this._fileReadHandler.bind(this);
        this._loadImageHandler = this._loadImageHandler.bind(this);
        this._previewMouseenterHandler = this._previewMouseenterHandler.bind(this);
        this._previewMouseleaveHandler = this._previewMouseleaveHandler.bind(this);
        this._previewClickHandler = this._previewClickHandler.bind(this);
    }

    _setupEventListeners() {
        this._button.on('click', this._clickHandler);
        this._input.addEventListener('input', this._inputHandler);
        this._fileReader.addEventListener('load', this._fileReadHandler);
        this._image.addEventListener('load', this._loadImageHandler);
        this._previewMonitor.el.addEventListener('mouseenter', this._previewMouseenterHandler);
        this._previewMonitor.el.addEventListener('mouseleave', this._previewMouseleaveHandler);
        this._previewMonitor.el.addEventListener('click', this._previewClickHandler);
    }

    _removeEventListeners() {
        this._input.removeEventListener('input', this._inputHandler);
        this._fileReader.removeEventListener('load', this._fileReadHandler);
        this._image.removeEventListener('load', this._loadImageHandler);
        this._previewMonitor.el.removeEventListener('mouseenter', this._previewMouseenterHandler);
        this._previewMonitor.el.removeEventListener('mouseleave', this._previewMouseleaveHandler);
        this._previewMonitor.el.removeEventListener('click', this._previewClickHandler);
    }

    _clickHandler() {
        this._input.click();
    }

    _inputHandler() {
        this._isOriginalImage = false;
        this._readFile();
    }

    _fileReadHandler() {
        this._updateImage();
    }

    _loadImageHandler() {
        if (this._isOriginalImage) return;
        if (this._updateCallback) this._updateCallback(this._image);
    }

    _previewMouseenterHandler() {
        this._previewMonitor.el.style.opacity = 0.8;
    }

    _previewMouseleaveHandler() {
        this._previewMonitor.el.style.opacity = 1;
    }

    _previewClickHandler() {
        this._input.click();
    }
}

export default TweakpaneInputImage;
