// Vendor
import * as THREE from 'three';

// Objects
import UIPlaneImage from '@/webgl/objects/UIPlaneImage';

class UILayer extends THREE.Object3D {
    constructor(options = {}) {
        super();

        this._renderer = options.renderer;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._scenes = options.scenes;

        this._images = [];
        this._planes = [];

        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Public
     */
    update(time, delta) {
        for (let i = 0; i < this._planes.length; i++) {
            const plane = this._planes[i];
            plane.update(time, delta);
        }
    }

    createImage(image) {
        this._images.push(image);

        const plane = new UIPlaneImage({
            name: image.name,
            side: image.side,
            scale: image.scale,
            containerBounds: image.containerBounds,
            canvasWidth: this._width,
            canvasHeight: this._height,
            debugFolder: this._debugFolder,
            scenes: this._scenes,
        });

        this._planes.push(plane);
        this.add(plane);

        return plane;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        for (let i = 0; i < this._planes.length; i++) {
            const plane = this._planes[i];
            plane.canvasWidth = this._width;
            plane.canvasHeight = this._height;
        }
    }

    destroy() {
        for (let i = 0; i < this._planes.length; i++) {
            const plane = this._planes[i];
            plane.geometry.dispose();
            plane.material.dispose();
        }
    }

    /**
     * Private
     */
    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: 'UI Layer', extended: false });

        return folder;
    }
}

export default UILayer;
