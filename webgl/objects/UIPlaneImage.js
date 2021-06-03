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
        this._side = options.side;
        this._containerBounds = options.containerBounds;

        this.geometry = this._createGeometry();
        this.material = this._createMaterial();

        this._loadTexture();
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

    transitionIn() {
        this.material.uniforms.u_alpha.value = 1;
    }

    transitionOut() {
        this.material.uniforms.u_alpha.value = 0;
    }

    resize(containerBounds) {
        if (containerBounds) this._containerBounds = containerBounds;

        const ratio = this._texture.image.width / this._texture.image.height;

        this._size = new THREE.Vector2(this._containerBounds.width / 2, (this._containerBounds.width / 2) / ratio);
        this._offsetX = this._side === 'left' ? this._size.x / 2 : -this._size.x / 2;

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
            u_image_size: { value: new THREE.Vector2(0, 0) },
            // Animations
            u_alpha: { value: 0 },
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
}

export default UIPlaneImage;
