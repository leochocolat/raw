// Vendor
import * as THREE from 'three';

// Module
import CanvasBlurEditor from '@/webgl/objects/CanvasBlurEditor';
import BlurScreen from '@/webgl/utils/BlurScreen';

// Utils
import { ResourceManager } from '@/utils/resource-loader';

// Scene
import DebugScene from './DebugScene';

class BlurEditor extends DebugScene {
    constructor(options) {
        super(options);

        this._renderer = options.renderer;
        this._canvas = this._renderer.domElement;
        this._width = options.width;
        this._height = options.height;
        this._renderer = options.renderer;

        this._bindAll();

        this._settings = {
            filename: 'blur-mask',
            blurImageFilename: 'blur-image',
        };

        this._resources = this._setupResources();
        this.camera = this._createOrthoCamera();

        this._controlZoom = 1;

        // this.orbitControls.enableZoom = true;
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

        this._blurScreen?.resize(width, height);
    }

    update(time, delta) {
        super.update(time, delta);

        this._canvasBlurEditor?.update();
        this._blurScreen?.update();
    }

    destroy() {
        this._canvasBlurEditor?.destroy();
        this._removeEventListeners();
    }

    mousemove(e) {
        this._canvasBlurEditor?.mousemove(e);
    }

    /**
     * Private
     */
    _setup() {
        this._texture = this._resources.get('test-blur');
        this._texture.flipY = false;

        this._textureVideo = this._resources.get('video_test_0');
        // this._textureVideo.flipY = false;

        this._plane = this._createPlane();

        this._canvasBlurEditor = new CanvasBlurEditor({
            imageSrc: this._resources.get('blur-mask-test').image.src,
            width: this._texture.image.width,
            height: this._texture.image.height,
            viewportWidth: this._width,
            viewportHeight: this._height,
            debugger: this._debugger,
        });

        this._blurScreen = new BlurScreen({
            blurFactor: 0,
            scenePlane: this._plane,
            maskTexture: this._canvasBlurEditor.texture,
            screenTexture: this._texture,
            renderer: this._renderer,
            width: this._width,
            height: this._height,
        });

        this._resizePlane();
        this._setupDebug();
    }

    _setupResources() {
        const resources = new ResourceManager();
        resources.addByName('test-blur');
        resources.addByName('video_test_0');
        resources.addByName('blur-mask-test');

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

        this._textureSize = new THREE.Vector2(this._texture.image.width || this._texture.image.videoWidth, this._texture.image.height || this._texture.image.videoHeight);

        const width = this._width / 2;
        const height = width / (this._textureSize.x / this._textureSize.y);

        this._planeSize = new THREE.Vector2(width, height);

        this._plane.scale.set(width, height);

        this._canvasBlurEditor.resize({
            width: width * this._controlZoom,
            height: height * this._controlZoom,
            viewportWidth: this._width,
            viewportHeight: this._height,
        });

        this._blurScreen.planeSize = new THREE.Vector2(width, height);
        this._blurScreen.resize(this._width, this._height);
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
        // Export
        this._debugFolder.addButton({ title: 'Export', label: 'Mask' }).on('click', this._clickExportHandler);
        this._debugFolder.addInput(this._settings, 'filename', { label: 'File Name' });

        this._debugFolder.addButton({ title: 'Export', label: 'Blured Image' }).on('click', this._clickExportBlurImageHandler);
        this._debugFolder.addInput(this._settings, 'blurImageFilename', { label: 'Image File Name' });

        // Input image / Video
        const inputImageFolder = this._debugFolder.addFolder({ title: 'Input Image' });
        const inputTabs = inputImageFolder.addTab({
            pages: [
                { title: 'Image' },
                { title: 'Video' },
            ],
        });

        const inputImage = this.debugger.addInputMedia(this._texture.image, {
            type: 'image',
            title: 'Upload file',
            label: 'Image',
            folder: inputTabs.pages[0],
            options: {
                'test-blur': this._resources.get('test-blur').image.src,
            },
        });
        inputImage.on('update', this._imageUpdateHandler);

        const inputVideo = this.debugger.addInputMedia(this._textureVideo.image, {
            type: 'video',
            title: 'Upload file',
            label: 'Video',
            folder: inputTabs.pages[1],
            options: {
                'video_test_0': this._resources.get('video_test_0').image.src,
            },
        });
        inputVideo.on('update', this._videoUpdateHandler);

        // Mask
        const maskFolder = this._debugFolder.addFolder({ title: 'Mask' });

        const maskFolderTabs = maskFolder.addTab({
            pages: [
                { title: 'Select' },
                { title: 'Draw' },
            ],
        });

        // Select
        // maskFolderTabs.pages[0].selected = true;

        maskFolderTabs.pages[0].addInput(this._canvasBlurEditor, 'imageSrc', {
            label: 'Options',
            options: {
                'None': null,
                'Default': this._resources.get('blur-mask-test').image.src,
            },
        });

        maskFolderTabs.pages[0].addButton({ label: 'Image', title: 'Apply' }).on('click', () => {
            this._canvasBlurEditor.drawImage();
        });

        // Draw
        // maskFolderTabs.pages[1].selected = true;

        maskFolderTabs.pages[1].addInput(this._canvasBlurEditor, 'visible');
        maskFolderTabs.pages[1].addInput(this._canvasBlurEditor, 'allowZoom', { label: 'Enable Zoom' });
        maskFolderTabs.pages[1].addInput(this._canvasBlurEditor, 'pencilRelativeRadius', { label: 'Pencil Radius', min: 0, max: 1 });
        maskFolderTabs.pages[1].addInput(this._canvasBlurEditor, 'pencilOpacity', { label: 'Pencil Opacity', min: 0, max: 1 });
        maskFolderTabs.pages[1].addInput(this._canvasBlurEditor, 'pencilHardness', { label: 'Pencil Hardness', min: 0, max: 1 });
        maskFolderTabs.pages[1].addButton({ title: 'Clear (Cmd+x)' }).on('click', this._clickClearHandler);
        maskFolderTabs.pages[1].addButton({ title: 'Revert (Cmd+z)' }).on('click', this._clickRevertHandler);
        maskFolderTabs.pages[1].addButton({ title: 'Toggle Visibility (Spacebar)' }).on('click', () => {
            this._canvasBlurEditor.visible = !this._canvasBlurEditor.visible;
            this._debugger.refresh();
        });

        // Blur
        const blurFolder = this._debugFolder.addFolder({ title: 'Blur Effect' });
        blurFolder.addInput(this._blurScreen, 'blurFactor', { min: 0, max: 1, label: 'Blur Factor' });

        this._debugFolder.expanded = true;
    }

    // Events
    _bindAll() {
        this._loadCompleteHandler = this._loadCompleteHandler.bind(this);
        this._imageUpdateHandler = this._imageUpdateHandler.bind(this);
        this._videoUpdateHandler = this._videoUpdateHandler.bind(this);
        this._controlsChangeHandler = this._controlsChangeHandler.bind(this);
        this._clickExportHandler = this._clickExportHandler.bind(this);
        this._clickClearHandler = this._clickClearHandler.bind(this);
        this._clickRevertHandler = this._clickRevertHandler.bind(this);
        this._clickExportBlurImageHandler = this._clickExportBlurImageHandler.bind(this);
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
        this._blurScreen.screenTexture = this._texture;
        this._resizePlane();
    }

    _videoUpdateHandler(video) {
        this._texture = new THREE.VideoTexture(video);
        this._texture.flipY = false;
        this._texture.needsUpdate = true;
        this._plane.material.map = this._texture;
        this._blurScreen.screenTexture = this._texture;
        this._resizePlane();
    }

    _controlsChangeHandler(e) {
        this._controlZoom = e.target.object.zoom;

        this._canvasBlurEditor.resize({
            width: this._planeSize.x * this._controlZoom,
            height: this._planeSize.y * this._controlZoom,
            viewportWidth: this._width,
            viewportHeight: this._height,
        });
    }

    _clickExportHandler() {
        this._canvasBlurEditor.export(this._settings.filename);
    }

    _clickExportBlurImageHandler() {
        const downloadButton = document.createElement('a');
        downloadButton.download = `${this._settings.blurImageFilename}.png`;
        downloadButton.href = this._canvas.toDataURL('image/png');
        downloadButton.click();
    }

    _clickClearHandler() {
        this._canvasBlurEditor.clear();
    }

    _clickRevertHandler() {
        this._canvasBlurEditor.revert();
    }
}

export default BlurEditor;
