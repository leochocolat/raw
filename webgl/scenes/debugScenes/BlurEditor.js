// Vendor
import * as THREE from 'three';

// Utils
import { ResourceManager } from '@/utils/resource-loader';

// Scene
import DebugScene from './DebugScene';

class BlurEditor extends DebugScene {
    constructor(options) {
        super(options);

        this._bindAll();

        this._resources = this._setupResources();
        this.camera = this._createOrthoCamera();

        // this.orbitControls.enableZoom = false;
        this.orbitControls.enableRotate = false;
        this.orbitControls.enablePan = false;

        this._setupEventListeners();
    }

    /**
     * Public
     */
    resize(width, height) {
        super.resize(width, height);

        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = -height / 2;
        this.camera.bottom = height / 2;

        this.camera.updateProjectionMatrix();

        this._resizePlane();
    }

    update(time, delta) {
        super.update(time, delta);
    }

    /**
     * Private
     */
    _setup() {
        this._texture = this._resources.get('texture-gore-test');
        this._texture.flipY = false;

        this._plane = this._createPlane();

        this._resizePlane();
        this._setupDebug();
    }

    _setupResources() {
        const resources = new ResourceManager();
        resources.addByName('texture-gore-test');

        resources.load();

        return resources;
    }

    _createPlane() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: this._texture });
        const mesh = new THREE.Mesh(geometry, material);

        this.add(mesh);

        return mesh;
    }

    _resizePlane() {
        if (!this._plane) return;

        this._textureSize = new THREE.Vector2(this._texture.image.width, this._texture.image.height);

        const width = this._width / 2;
        const height = width / (this._textureSize.x / this._textureSize.y);
        this._plane.scale.set(width, height);
    }

    _createOrthoCamera() {
        const left = -this._width / 2;
        const right = this._width / 2;
        const top = this._height / 2;
        const bottom = -this._height / 2;

        const camera = new THREE.OrthographicCamera(left, right, top, bottom, 1, 1000);
        camera.position.z = 1;

        return camera;
    }

    _setupDebug() {
        // Input image
        const inputImageFolder = this._debugFolder.addFolder({ title: 'Input Image' });
        const inputImage = this.debugger.addInputImage(this._texture.image, { title: 'Upload file', label: 'Image', folder: inputImageFolder });
        inputImage.on('update', this._imageUpdateHandler);

        // Drawing
        const drawSettingsFolder = this._debugFolder.addFolder({ title: 'Draw Settings' });

        // Export

        this._debugFolder.expanded = true;
    }

    // Events
    _bindAll() {
        this._loadCompleteHandler = this._loadCompleteHandler.bind(this);
        this._imageUpdateHandler = this._imageUpdateHandler.bind(this);
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._loadCompleteHandler);
    }

    _loadCompleteHandler() {
        this._setup();
    }

    _imageUpdateHandler(image) {
        this._texture = new THREE.Texture(image);
        this._texture.flipY = false;
        this._texture.needsUpdate = true;
        this._plane.material.map = this._texture;
        this._resizePlane();
    }
}

export default BlurEditor;
