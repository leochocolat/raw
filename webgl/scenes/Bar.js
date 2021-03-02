// Vendor
import * as THREE from 'three';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';

class Bar extends THREE.Scene {
    constructor(options) {
        super();

        console.log(options);

        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;

        this.background = new THREE.Color(data.colors[this._id]);

        this._renderTarget = this._createRenderTarget();
        this._camera = this._createCamera();
        this._debugCube = this._createDebugCube();

        this._createDebugFolder();
    }

    /**
     * Public
     */
    get camera() {
        return this._camera;
    }

    get renderTarget() {
        return this._renderTarget;
    }

    update(time, delta) {
        // this._debugCube.rotation.x = time * (this._id + 1);
        // this._debugCube.rotation.y = -time * (this._id + 1);
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._renderTarget.setSize(this._width, this._height);
    }

    /**
     * Private
     */
    _createRenderTarget() {
        const renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);

        return renderTarget;
    }

    _createCamera() {
        const camera = new THREE.PerspectiveCamera(75, this._width / this._height, 0.1, 1000);
        camera.position.z = 2;

        return camera;
    }

    _createDebugCube() {
        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({
        //     color: 'red',
        // });

        // const mesh = new THREE.Mesh(geometry, material);
        // this.add(mesh);

        // Test model with draco compression
        const mesh = ResourceLoader.get('testDraco').scene;
        this.add(mesh);

        return mesh;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        this._debugger.addFolder({ title: `Scene ${this._id}`, expanded: false });
    }
}

export default Bar;
