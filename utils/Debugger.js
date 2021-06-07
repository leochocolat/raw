// Vendor
import Tweakpane from 'tweakpane';

// Utils
import bindAll from './bindAll';
import DragManager from './DragManager';
import TweakpaneInputMedia from './debugger/TweakpaneInputMedia';

class Debugger extends Tweakpane {
    constructor(options) {
        super();

        this._title = options.title;

        this._customInstances = [];

        this.__bindAll();
        this.__setup();
    }

    /**
     * Public
     */
    destroy() {
        this.dispose();
        this.__removeEventListeners();

        for (let i = 0; i < this._customInstances.length; i++) {
            if (this._customInstances[i].destroy) this._customInstances[i].destroy();
        }
    }

    addFolder(options) {
        const folder = super.addFolder(options);
        folder.refresh = this.refresh;

        return folder;
    }

    addInputMedia(media, options) {
        const inputMedia = new TweakpaneInputMedia(media, options);

        this._customInstances.push(inputMedia);

        return inputMedia;
    }

    /**
     * Private
     */
    __setup() {
        this.__offset = { x: 0, y: 0 };

        this.__setupStyle();
        this.__createDragButton();
        // this.__createExportButton();
        this.__setupEventListeners();
    }

    __setupStyle() {
        this.element.style.position = 'fixed';
        this.element.style.right = '10px';
    }

    __createDragButton() {
        this.__dragButton = this.addButton({ title: this._title });
        this.__dragButtonElement = this.__dragButton.controller_.view.element;
        this.__dragButtonElement.style.cursor = 'grab';
    }

    __createExportButton() {
        this.__exportButton = this.addButton({ title: 'Export Setting' });
        this.__exportButton.on('click', this.__exportButtonClickHandler);
    }

    __bindAll() {
        bindAll(this, '__dragHandler', '__dragButtonMousedownHandler', '__dragButtonMouseupHandler', '__tapHandler', '__exportButtonClickHandler');
    }

    __setupEventListeners() {
        this.__dragManager = new DragManager({ el: this.__dragButtonElement });
        this.__dragManager.addEventListener('drag', this.__dragHandler);
        this.__dragManager.addEventListener('tap', this.__tapHandler);
        this.__dragButtonElement.addEventListener('mousedown', this.__dragButtonMousedownHandler);
        this.__dragButtonElement.addEventListener('mouseup', this.__dragButtonMouseupHandler);
    }

    __removeEventListeners() {
        this.__dragManager.close();
        this.__dragButtonElement.removeEventListener('mousedown', this.__dragButtonMousedownHandler);
        this.__dragButtonElement.removeEventListener('mouseup', this.__dragButtonMouseupHandler);
    }

    __dragHandler(e) {
        this.__offset.x -= e.delta.x;
        this.__offset.y -= e.delta.y;
        this.element.style.transform = `translate(${this.__offset.x}px, ${this.__offset.y}px)`;
    }

    __tapHandler() {}

    __dragButtonMousedownHandler() {
        this.__dragButtonElement.style.cursor = 'grabbing';
    }

    __dragButtonMouseupHandler() {
        this.__dragButtonElement.style.cursor = 'grab';
    }

    __exportButtonClickHandler() {}
}

export default Debugger;
