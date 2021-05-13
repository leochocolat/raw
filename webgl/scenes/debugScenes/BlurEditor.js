// Vendor
import * as THREE from 'three';

// Module
import CanvasBlurEditor from '@/webgl/objects/CanvasBlurEditor';

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

        this._controlZoom = 1;

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

        // const zoom = this.orbitControls.target.distanceTo(this.orbitControls.object.position);
        // console.log(zoom);
    }

    destroy() {
        this._canvasBlurEditor?.destroy();
        this._removeEventListeners();
    }

    /**
     * Private
     */
    _setup() {
        this._texture = this._resources.get('texture-gore-test');
        this._texture.flipY = false;

        this._plane = this._createPlane();
        this._canvasBlurEditor = new CanvasBlurEditor({ width: this._texture.image.width, height: this._texture.image.height });

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

        this._planeSize = new THREE.Vector2(width, height);
        this._plane.scale.set(width, height);
        this._canvasBlurEditor.resize(width, height);
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
        console.log(this._canvasBlurEditor);
        drawSettingsFolder.addInput(this._canvasBlurEditor, 'visible');

        // Export

        this._debugFolder.expanded = true;
    }

    // Events
    _bindAll() {
        this._loadCompleteHandler = this._loadCompleteHandler.bind(this);
        this._imageUpdateHandler = this._imageUpdateHandler.bind(this);
        this._controlsChangeHandler = this._controlsChangeHandler.bind(this);
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._loadCompleteHandler);
        this.orbitControls.addEventListener('change', this._controlsChangeHandler);
    }

    _removeEventListeners() {
        this._resources.removeEventListener('complete', this._loadCompleteHandler);
        this.orbitControls.dispose();
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

    _controlsChangeHandler(e) {
        this._controlZoom = e.target.object.zoom;
        this._canvasBlurEditor.resize(this._planeSize.x * this._controlZoom, this._planeSize.y * this._controlZoom);
    }
}

export default BlurEditor;
