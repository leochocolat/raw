// Vendor
import * as THREE from 'three';

// Data
import data from '../data';
import ResourceLoader from '@/utils/ResourceLoader';
import AnimationComponent from '@/utils/AnimationComponent';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class RenderTargetScene extends THREE.Scene {
    constructor(options) {
        super();

        this._name = options.name;
        this._id = options.id;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;
        this._isActive = options.isActive;
        this._renderer = options.renderer;
        this.background = new THREE.Color(data.colors[this._id]);

        this._renderTarget = this._createRenderTarget();
        this._camera = this._createCamera();
        this._debugCube = this._createDebugCube();
        this._animationController = this._createAnimationController();

        this._orbitControls = this._createOrbitControls();
        this._ambientLight = this._createAmbientLight();

        this._debugFolder = this._createDebugFolder();
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

    get debugFolder() {
        return this._debugFolder;
    }

    get isActive() {
        return this._isActive;
    }

    setActive() {
        this._isActive = true;
        // console.log(`Scene ${this._name} is active`);
    }

    setInactive() {
        this._isActive = false;
        // console.log(`Scene ${this._name} is inactive`);
    }

    update(time, delta) {
        if (!this._isActive) return;

        this._debugCube.rotation.x = time;
        this._debugCube.rotation.y = -time;
        this._animationController.update(delta);
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

    _createOrbitControls() {
        const orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
        return orbitControls;
    }

    _createDebugCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 'red',
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        // Test model with draco compression
        // const mesh = ResourceLoader.get('testDraco').scene;
        // this.add(mesh);
        // this.add(mesh.scene);

        return mesh;
    }

    _createAnimationController() {
        const animationController = new AnimationComponent(this._debugCube);
        animationController.playAnimation(animationController.actionType.Run);

        return animationController;
    }

    _createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.add(ambientLight);

        return ambientLight;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const folder = this._debugger.addFolder({ title: `Scene ${this._name}`, expanded: false });

        return folder;
    }
}

export default RenderTargetScene;
