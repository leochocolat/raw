// Vendor
import * as THREE from 'three';

// Objects
import UIPlane from '@/webgl/objects/UIPlane';

class UILayer extends THREE.Object3D {
    constructor(options = {}) {
        super();

        this._renderer = options.renderer;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;

        this._images = [];
        this._planes = [];

        // Debug
        const images = [
            {
                width: 500,
                height: 900,
                x: 100,
                y: 300,
            },
        ];

        this.createImages(images);
    }

    /**
     * Public
     */
    createImages(images) {
        this._images = images;

        for (let i = 0; i < this._images.length; i++) {
            const image = this._images[i];
            const plane = new UIPlane({
                width: image.width,
                height: image.height,
                x: image.x,
                y: image.y,
            });
            this._planes.push(plane);
            this.add(plane);
        }
    }

    resizeImages() {

    }
}

export default UILayer;
