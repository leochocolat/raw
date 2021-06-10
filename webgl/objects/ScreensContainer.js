// Vendor
import * as THREE from 'three';
import gsap from 'gsap';

// Shaders
import fragmentShader from '@/webgl/shaders/screen/fragment.glsl';
import vertexShader from '@/webgl/shaders/screen/vertex.glsl';

class ScreensContainer extends THREE.Mesh {
    constructor(options) {
        super();

        this._scenes = options.scenes;
        this._debugger = options.debugger;
        this._width = options.width;
        this._height = options.height;

        this._scrollY = 0;

        this._bindAll();

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        this._debugFolder = this._createDebugFolder();
    }

    /**
     * Public
     */
    get scrollY() {
        return this._scrollY;
    }

    set scrollY(value) {
        this.material.uniforms.u_scroll_offset.value = value / this._height;
        this._scrollY = value;
    }

    effectIn() {
        this._timelineEffectOut?.kill();

        this._timelineEffectIn = new gsap.timeline();
        this._timelineEffectIn.to(this.material.uniforms.u_global_intensity, { value: 1.0, duration: 2, ease: 'power0.none' });

        return this._timelineEffectIn;
    }

    effectOut() {
        this._timelineEffectIn?.kill();

        this._timelineEffectOut = new gsap.timeline();
        this._timelineEffectOut.to(this.material.uniforms.u_global_intensity, { value: 0.3, duration: 1.5, ease: 'power0.none' });

        return this._timelineEffectOut;
    }

    mousemoveHandler(mouse) {}

    update(time, delta) {
        this.material.uniforms.u_time.value = time;

        for (const key in this._scenes) {
            const index = this._scenes[key].sceneId;
            this.material.uniforms[`u_texture_${index}`].value = this._scenes[key].uniforms[`u_texture_${index}`].value;
            this.material.uniforms[`u_texture_alpha_${index}`].value = this._scenes[key].uniforms[`u_texture_alpha_${index}`].value;
            this.material.uniforms[`u_step_factor_${index}`].value = this._scenes[key].uniforms[`u_step_factor_${index}`].value;

            // Debug
            // uniforms[`u_texture_${index}`] = { value: ResourceLoader.get(`video_test_${index}`) };
        }
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this.scale.set(this._width, this._height, 1);
        this.material.uniforms.u_resolution.value.set(this._width, this._height);
    }

    destroy() {
        this.geometry.dispose();
        this.geometry = null;

        this.material.dispose();
        this.material = null;
    }

    /**
     * Private
     */
    _createGeometry() {
        const geometry = new THREE.PlaneGeometry(1, 1, 2);

        return geometry;
    }

    _createMaterial() {
        const scenesUniforms = [];
        for (const key in this._scenes) {
            const sceneUniform = this._scenes[key].uniforms;
            scenesUniforms.push(sceneUniform);
        }

        const screenEffectUniforms = {
            u_global_intensity: { value: 1 },
            // Color filter
            u_red_filter_intensity: { value: -0.1 },
            u_green_filter_intensity: { value: 0 },
            u_blue_filter_intensity: { value: 0 },
            // CRT Displacement
            u_crt_bending: { value: 0.2 },
            // Scanline
            u_scanline_vertical: { value: false },
            u_scanline_amount_factor: { value: 1.67 },
            u_scanline_speed: { value: 20 },
            u_scanline_min_intensity: { value: 0.01 },
            u_scanline_max_intensity: { value: 0.06 },
            // RGB Shift
            u_rgb_shift_amount: { value: 0.002 },
            u_rgb_shift_angle: { value: new THREE.Vector2(0.0, 1.0) },
            // Noise
            u_noise_intensity: { value: 0.02 },
            u_noise_scale: { value: 400.0 },
            // Noise
            u_vignette_intensity: { value: 22.0 },
            u_vignette_scale: { value: 0.15 },
            // Completed
            u_wobble_intensity: { value: 0.2 },
            u_line_intensity: { value: 2.0 },
            u_distortion_intensity: { value: 0.04 },
            // Rewind
            u_rewind_wobble_intensity: { value: 0.6 },
            u_rewind_distortion_size: { value: 0.05 },
            u_rewind_distortion_speed: { value: 1.5 },
            u_rewind_distortion_intensity: { value: 0.02 },
            // Scroll
            u_scroll_offset: { value: 0.0 },
        };

        const uniforms = {
            // Basics
            u_resolution: { value: new THREE.Vector2(this._width, this._height) },
            u_time: { value: 0.0 },
            // Screens
            ...scenesUniforms[0],
            ...scenesUniforms[1],
            ...scenesUniforms[2],
            ...scenesUniforms[3],
            // Screen Effect
            ...screenEffectUniforms,
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader,
            vertexShader,
            transparent: true,
        });

        return material;
    }

    _createDebugFolder() {
        if (!this._debugger) return;

        const debugFolder = this._debugger.addFolder({ title: 'Screens Container', expanded: false });

        debugFolder.addInput(this.material.uniforms.u_global_intensity, 'value', { label: 'Effect Intensity', min: 0, max: 1 });
        debugFolder.addInput(this.material.uniforms.u_crt_bending, 'value', { label: 'CRT Bending', min: 0, max: 1 });

        const colorFilter = debugFolder.addFolder({ title: 'Color filter', expanded: false });
        colorFilter.addInput(this.material.uniforms.u_red_filter_intensity, 'value', { label: 'Red', min: -1, max: 1 });
        colorFilter.addInput(this.material.uniforms.u_green_filter_intensity, 'value', { label: 'Green', min: -1, max: 1 });
        colorFilter.addInput(this.material.uniforms.u_blue_filter_intensity, 'value', { label: 'Blue', min: -1, max: 1 });

        const scanline = debugFolder.addFolder({ title: 'Scanline', expanded: false });
        scanline.addInput(this.material.uniforms.u_scanline_vertical, 'value', { label: 'Vertical' });
        scanline.addInput(this.material.uniforms.u_scanline_speed, 'value', { label: 'Speed', min: 0, max: 100 });
        scanline.addInput(this.material.uniforms.u_scanline_amount_factor, 'value', { label: 'Amount factor', min: 1, max: 3 });
        scanline.addInput(this.material.uniforms.u_scanline_min_intensity, 'value', { label: 'Min intensity', min: 0, max: 1 });
        scanline.addInput(this.material.uniforms.u_scanline_max_intensity, 'value', { label: 'Max intensity', min: 0, max: 1 });

        const RGBShift = debugFolder.addFolder({ title: 'RGB Shift', expanded: false });
        RGBShift.addInput(this.material.uniforms.u_rgb_shift_amount, 'value', { label: 'amount', min: 0, max: 0.1 });
        RGBShift.addInput(this.material.uniforms.u_rgb_shift_angle, 'value', { label: 'angle' });

        const noise = debugFolder.addFolder({ title: 'Noise', expanded: false });
        noise.addInput(this.material.uniforms.u_noise_intensity, 'value', { label: 'intensity', min: 0, max: 0.5 });
        noise.addInput(this.material.uniforms.u_noise_scale, 'value', { label: 'scale', min: 10, max: 500 });

        const vignette = debugFolder.addFolder({ title: 'Vignette', expanded: false });
        vignette.addInput(this.material.uniforms.u_vignette_intensity, 'value', { label: 'intensity', min: 0, max: 50 });
        vignette.addInput(this.material.uniforms.u_vignette_scale, 'value', { label: 'scale', min: 0, max: 2 });

        const animations = debugFolder.addFolder({ title: 'Animations', expanded: false });
        animations.addButton({ title: 'Animate out' }).on('click', this._debugAnimationOutClickHandler);
        animations.addButton({ title: 'Animate in' }).on('click', this._debugAnimationInClickHandler);

        const completed = debugFolder.addFolder({ title: 'Completed', expanded: false });
        completed.addInput(this.material.uniforms.u_wobble_intensity, 'value', { label: 'Wobble', min: 0, max: 1.0 });
        completed.addInput(this.material.uniforms.u_line_intensity, 'value', { label: 'Line', min: 0, max: 10 });
        completed.addInput(this.material.uniforms.u_distortion_intensity, 'value', { label: 'scan distortion', min: 0, max: 10 });

        const rewind = debugFolder.addFolder({ title: 'Rewind', expanded: false });
        rewind.addInput(this.material.uniforms.u_rewind_wobble_intensity, 'value', { label: 'Wooble', min: 0, max: 1 });
        rewind.addInput(this.material.uniforms.u_rewind_distortion_intensity, 'value', { label: 'Distortion Speed', min: 0, max: 0.5 });
        rewind.addInput(this.material.uniforms.u_rewind_distortion_speed, 'value', { label: 'Distortion Speed', min: 0, max: 5 });
        rewind.addInput(this.material.uniforms.u_rewind_distortion_size, 'value', { label: 'Distortion Size Y', min: 0, max: 0.1 });

        const scroll = debugFolder.addFolder({ title: 'Scroll' });
        scroll.addInput(this.material.uniforms.u_scroll_offset, 'value', { label: 'Wooble', min: 0, max: 1 });

        return debugFolder;
    }

    /**
     * Events
     */
    _bindAll() {
        this._debugAnimationOutClickHandler = this._debugAnimationOutClickHandler.bind(this);
        this._debugAnimationInClickHandler = this._debugAnimationInClickHandler.bind(this);
    }

    _debugAnimationOutClickHandler() {
        this.effectOut();
    }

    _debugAnimationInClickHandler() {
        this.effectIn();
    }
}

export default ScreensContainer;
