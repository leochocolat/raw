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

        this._images = [];
        this._planes = [];
    }

    /**
     * Public
     */
    createImage(image) {
        this._images.push(image);

        const plane = new UIPlaneImage({
            name: image.name,
            side: image.side,
            containerBounds: image.containerBounds,
            canvasWidth: this._width,
            canvasHeight: this._height,
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
}

export default UILayer;
