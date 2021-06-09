// Vendor
import * as THREE from 'three';
import ResourceLoader from '@/utils/resource-loader';
import gsap from 'gsap';

// Shader
import fragment from '@/webgl/shaders/ui-image/fragment.glsl';
import vertex from '@/webgl/shaders/ui-image/vertex.glsl';

class UIPlaneImage extends THREE.Mesh {
    constructor(options = {}) {
        super();

        this._canvasWidth = options.canvasWidth;
        this._canvasHeight = options.canvasHeight;

        this._name = options.name;
        this._scale = options.scale;
        this._side = options.side;
        this._containerBounds = options.containerBounds;
        this._scenes = options.scenes;
        this._debugFolder = options.debugFolder;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        // this._loadTexture();

        this._setupDebug();
    }

    /**
     * Public
     */
    get canvasWidth() {
        return this._canvasWidth;
    }

    set canvasWidth(width) {
        this._canvasWidth = width;
        this.material.uniforms.u_resolution.x = width;
    }

    get canvasHeight() {
        return this._canvasHeight;
    }

    set canvasHeight(height) {
        this.material.uniforms.u_resolution.y = height;
        this._canvasHeight = height;
    }

    update(time, delta) {
        this.material.uniforms.u_time.value = time;

        if (this._scenes && this._scenes[this._name].blurScreen) {
            const texture = this._scenes[this._name].blurScreen.meshTexture;
            this.material.uniforms.u_texture.value = texture;

            if (!this._texture) {
                this._texture = texture;
                this.material.needsUpdate = true;
                this.resize();
            }
        }
    }

    transitionIn() {
        this.timelineOut?.kill();

        this.timelineIn = new gsap.timeline();

        this.timelineIn.set(this.material.uniforms.u_alpha, { value: 0.5 });
        this.timelineIn.fromTo(this.material.uniforms.u_wobble_intensity, { duration: 0.3, value: 2 }, { value: 0.2 }, 0);
        this.timelineIn.fromTo(this.material.uniforms.u_distortion_intensity, { duration: 0.3, value: 0.1 }, { value: 0.005 }, 0);

        const rbgshiftTimeline = new gsap.timeline();
        rbgshiftTimeline.to(this.material.uniforms.u_rgb_shift_angle.value, { duration: 0.1, x: 10, y: 0 });
        rbgshiftTimeline.to(this.material.uniforms.u_rgb_shift_angle.value, { duration: 0.1, x: 10, y: 10 });
        rbgshiftTimeline.to(this.material.uniforms.u_rgb_shift_angle.value, { duration: 0.1, x: 5, y: 2.5 });
        rbgshiftTimeline.to(this.material.uniforms.u_rgb_shift_angle.value, { duration: 0.1, x: 2, y: 8 });
        rbgshiftTimeline.fromTo(this.material.uniforms.u_rgb_shift_amount, { duration: 0.4, value: 0.05 }, { value: 0.005 }, 0);

        this.timelineIn.add(rbgshiftTimeline, 0);
    }

    transitionOut() {
        this.timelineIn?.kill();

        this.timelineOut = new gsap.timeline();

        this.timelineOut.to(this.material.uniforms.u_wobble_intensity, { duration: 0.2, value: 2 }, 0);
        this.timelineOut.to(this.material.uniforms.u_distortion_intensity, { duration: 0.2, value: 0.1 }, 0);
        this.timelineOut.to(this.material.uniforms.u_rgb_shift_angle.value, { duration: 0.1, x: 2, y: 8 }, 0);
        this.timelineOut.to(this.material.uniforms.u_rgb_shift_amount, { duration: 0.3, value: 0.05 }, 0);
        this.timelineOut.set(this.material.uniforms.u_alpha, { value: 0 });
    }

    resize(containerBounds) {
        if (containerBounds) this._containerBounds = containerBounds;

        const videoAspectRatio = this._texture.image.videoWidth / this._texture.image.videoHeight;
        const aspectRatio = this._texture.image.width / this._texture.image.height;

        const ratio = aspectRatio || videoAspectRatio;

        const planeWidth = this._containerBounds.width / 2;
        const planeHeight = (this._containerBounds.width / 2) / ratio;

        this._size = new THREE.Vector2(planeWidth * this._scale, planeHeight * this._scale);
        this._offsetX = this._side === 'left' ? (this._size.x / 2) / this._scale : -(this._size.x / 2) / this._scale;

        this.scale.set(this._size.x, this._size.y, 1);
        this.position.set(this._offsetX, 0, 0.1);

        this.material.uniforms.u_image_size.value = this._size;
    }

    /**
     * Private
     */
    _createGeometry() {
        const geometry = new THREE.PlaneGeometry(1, 1, 1);

        return geometry;
    }

    _createMaterial() {
        const uniforms = {
            u_texture: { value: null },
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_time: { value: 0 },
            u_image_size: { value: new THREE.Vector2(0, 0) },
            // Distortions
            u_wobble_intensity: { value: 1 },
            u_distortion_intensity: { value: 0.04 },
            u_distortion_speed: { value: 2.5 },
            u_distortion_size: { value: 0.05 },
            // RGB Shift
            u_rgb_shift_amount: { value: 0.08 },
            u_rgb_shift_angle: { value: new THREE.Vector2(0.0, 1.0) },
            // Alpha
            u_alpha: { value: 0.0 },
            u_black_filter: { value: 0.05 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
            transparent: true,
        });

        return material;
    }

    _loadTexture() {
        ResourceLoader.load(this._name).then((texture) => {
            this._texture = texture;
            this.material.uniforms.u_texture.value = this._texture;
            this.material.needsUpdate = true;

            this.resize();
        });
    }

    _setupDebug() {
        if (!this._debugFolder) return;
        const folder = this._debugFolder.addFolder({ title: 'UI Plane Image', extended: false });
        // Distortion
        folder.addInput(this.material.uniforms.u_wobble_intensity, 'value', { label: 'Wooble', min: 0, max: 1 });
        folder.addInput(this.material.uniforms.u_distortion_intensity, 'value', { label: 'Distortion Intensity', min: 0, max: 0.5 });
        folder.addInput(this.material.uniforms.u_distortion_speed, 'value', { label: 'Distortion Speed', min: 0, max: 5 });
        folder.addInput(this.material.uniforms.u_distortion_size, 'value', { label: 'Distortion Size Y', min: 0, max: 0.1 });
        // RGB Shift
        folder.addInput(this.material.uniforms.u_rgb_shift_amount, 'value', { label: 'RGB Shift amount', min: 0, max: 0.1 });
        folder.addInput(this.material.uniforms.u_rgb_shift_angle, 'value', { label: 'RGB Shift angle' });
    }
}

export default UIPlaneImage;
