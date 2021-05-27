// Vendor
import * as THREE from 'three';

// Shader
import vertex from '../../shaders/customBasicMaterial/vertex.glsl';
import fragment from '../../shaders/customBasicMaterial/fragment.glsl';

// Utils
import cloneSkinnedMesh from '@/utils/cloneSkinnedMesh';
import { ResourceManager } from '@/utils/resource-loader';
import AnimationComponent from '@/utils/AnimationComponent';

import bindAll from '@/utils/bindAll';

// Scene
import DebugScene from './DebugScene';

class AnimTexture extends DebugScene {
    constructor(options) {
        super(options);

        this._bindAll();
        this._isReady = false;
        this._resources = this._setupResources();

        this._modelsCount = 2;

        this._addDebugSettings();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    resize(width, height) {
        super.resize(width, height);
    }

    update(time, delta) {
        if (!this._isReady) return;
        for (let i = 0, il = this._animationControllers.length; i < il; i++) {
            this._animationControllers[0].mixer._root.parent.updateMatrixWorld();
            this._animationControllers[i].update(delta);

            for (let j = 0, jl = this._skeleton.bones.length; j < jl; j++) {
                this._offsetMatrix.multiplyMatrices(this._skeleton.bones[j].matrixWorld, this._skeleton.boneInverses[j]);
                this._offsetMatrix.toArray(this._skeleton.boneMatrices, j * 16 + i * this._skeleton.boneTexture.image.width * this._skeleton.boneTexture.image.height * 4);
            }
            this._skeleton.boneTexture.needsUpdate = true;
        }

        super.update(time, delta);
    }

    /**
     * Private
     */

    _setupResources() {
        const resources = new ResourceManager({
            name: 'hallway',
            namespace: 'hallway',
        });

        resources.load();

        return resources;
    }

    _setup() {
        this._animationControllers = [];

        const texture1 = this._resources.get('tex1');
        const texture2 = this._resources.get('tex2');

        // this._modelsCount = hallway.scene.getObjectByName('Humans').children.length;

        // this._humansEmpty = [...hallway.scene.getObjectByName('Humans').children];

        this._uniforms = {
            time: { value: 0.0 },
            textures: {
                value: [texture1, texture2],
            },
        };

        this._offsetMatrix = new THREE.Matrix4();

        this._material = this._createMaterial();
        // this._mainModel = this._createMainModel();
        this._skinnedModel = this._setupSkinnedModel();
        this._mesh = this._setupMesh();
        this._instancedGeometry = this._createInstancedGeometry();
        this._skeleton = this._createSkeleton();
        this._skinnedMesh = this._createSkinnedMesh();

        this._isReady = true;
    }

    _createMainModel() {
        const model = this._resources.get('hallway');
        // const clone = cloneSkinnedMesh(model);
        model.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = this._material;
            }
        });

        this.add(model.scene);
        return model;
    }

    _createMaterial() {
        const material = new THREE.MeshNormalMaterial();

        return material;
    }

    _setupSkinnedModel() {
        const modelMan = this._resources.get('LyceenHomme');

        // const clone = cloneSkinnedMesh(model);
        // console.log(model);
        // this.add(model.scene);
        return modelMan;
    }

    _createAnimationController(skinnedMesh) {
        const model = this._skinnedModel;
        const animationController = new AnimationComponent(model, skinnedMesh);

        return animationController;
    }

    _setupMesh() {
        console.log(this._skinnedModel);
        const mesh = this._skinnedModel.scene.getObjectByName('skinned_mesh');
        // const mesh = this._skinnedModel.scene.getObjectByName('vanguard_Mesh');

        mesh.frustumCulled = false;
        const material = new THREE.ShaderMaterial({
            skinning: true,
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: this._uniforms,
        });

        mesh.material = material;
        return mesh;
    }

    _createInstancedGeometry() {
        const instanceMatrixColumns0 = [];
        const instanceMatrixColumns1 = [];
        const instanceMatrixColumns2 = [];
        const instanceMatrixColumns3 = [];
        const instanceNormalMatrixColumns0 = [];
        const instanceNormalMatrixColumns1 = [];
        const instanceNormalMatrixColumns2 = [];
        const instanceColors = [];
        const instanceSpeeds = [];
        const textureIdx = [];

        const tmp = new THREE.Object3D();

        for (let i = 0; i < this._modelsCount; i++) {
            tmp.position.set(1 + i, 10 + i, 10 + i);
            // tmp.position.set(0, 0, 0);

            tmp.rotation.set(0, 0, 0);

            // tmp.scale.set(1, 1, 1).multiplyScalar(Math.random() * 0.75 + 0.25);
            // tmp.scale.set(1, 1, 1).multiplyScalar(0.25);

            tmp.updateMatrix();
            tmp.normalMatrix.getNormalMatrix(tmp.matrix);

            for (let j = 0; j < 4; j++) {
                instanceMatrixColumns0.push(tmp.matrix.elements[j]);
                instanceMatrixColumns1.push(tmp.matrix.elements[j + 4]);
                instanceMatrixColumns2.push(tmp.matrix.elements[j + 8]);
                instanceMatrixColumns3.push(tmp.matrix.elements[j + 12]);
            }

            for (let j = 0; j < 3; j++) {
                instanceNormalMatrixColumns0.push(tmp.normalMatrix.elements[j]);
                instanceNormalMatrixColumns1.push(tmp.normalMatrix.elements[j + 3]);
                instanceNormalMatrixColumns2.push(tmp.normalMatrix.elements[j + 6]);
            }

            textureIdx.push(i);
            instanceColors.push(Math.random() * 0.75 + 0.25);
            instanceColors.push(Math.random() * 0.75 + 0.25);
            instanceColors.push(Math.random() * 0.75 + 0.25);
        }

        // with empty humans positions in blender export

        // for (let i = 0; i < this._modelsCount; i++) {
        //     tmp.position.set(this._humansEmpty[i].position.x, this._humansEmpty[i].position.y, this._humansEmpty[i].position.z);

        //     tmp.rotation.set(this._humansEmpty[i].rotation.x, this._humansEmpty[i].rotation.y, this._humansEmpty[i].rotation.z);

        //     tmp.scale.set(this._humansEmpty[i].scale.x, this._humansEmpty[i].scale.y, this._humansEmpty[i].scale.z);
        //     // tmp.scale.set(1, 1, 1).multiplyScalar(0.25);

        //     tmp.updateMatrix();
        //     tmp.normalMatrix.getNormalMatrix(tmp.matrix);

        //     for (let j = 0; j < 4; j++) {
        //         instanceMatrixColumns0.push(tmp.matrix.elements[j]);
        //         instanceMatrixColumns1.push(tmp.matrix.elements[j + 4]);
        //         instanceMatrixColumns2.push(tmp.matrix.elements[j + 8]);
        //         instanceMatrixColumns3.push(tmp.matrix.elements[j + 12]);
        //     }

        //     for (let j = 0; j < 3; j++) {
        //         instanceNormalMatrixColumns0.push(tmp.normalMatrix.elements[j]);
        //         instanceNormalMatrixColumns1.push(tmp.normalMatrix.elements[j + 3]);
        //         instanceNormalMatrixColumns2.push(tmp.normalMatrix.elements[j + 6]);
        //     }

        //     textureIdx.push(i);
        //     instanceColors.push(Math.random() * 0.75 + 0.25);
        //     instanceColors.push(Math.random() * 0.75 + 0.25);
        //     instanceColors.push(Math.random() * 0.75 + 0.25);
        // }

        const instancedGeometry = new THREE.InstancedBufferGeometry();

        instancedGeometry.setAttribute('position', this._mesh.geometry.getAttribute('position'));
        instancedGeometry.setAttribute('normal', this._mesh.geometry.getAttribute('normal'));
        instancedGeometry.setAttribute('uv', this._mesh.geometry.getAttribute('uv'));

        // if (instancedGeometry.getAttribute('uv2')) {
        //     instancedGeometry.setAttribute('uv2', this._mesh.geometry.getAttribute('uv2'));
        // }
        instancedGeometry.setAttribute('skinIndex', this._mesh.geometry.getAttribute('skinIndex'));
        instancedGeometry.setAttribute('skinWeight', this._mesh.geometry.getAttribute('skinWeight'));
        instancedGeometry.setIndex(this._mesh.geometry.getIndex());

        instancedGeometry.setAttribute('textureIdx', new THREE.InstancedBufferAttribute(new Float32Array(textureIdx), 1));
        instancedGeometry.setAttribute('instanceMatrixColumn0', new THREE.InstancedBufferAttribute(new Float32Array(instanceMatrixColumns0), 4));
        instancedGeometry.setAttribute('instanceMatrixColumn1', new THREE.InstancedBufferAttribute(new Float32Array(instanceMatrixColumns1), 4));
        instancedGeometry.setAttribute('instanceMatrixColumn2', new THREE.InstancedBufferAttribute(new Float32Array(instanceMatrixColumns2), 4));
        instancedGeometry.setAttribute('instanceMatrixColumn3', new THREE.InstancedBufferAttribute(new Float32Array(instanceMatrixColumns3), 4));
        instancedGeometry.setAttribute('instanceNormalMatrixColumn0', new THREE.InstancedBufferAttribute(new Float32Array(instanceNormalMatrixColumns0), 3));
        instancedGeometry.setAttribute('instanceNormalMatrixColumn1', new THREE.InstancedBufferAttribute(new Float32Array(instanceNormalMatrixColumns1), 3));
        instancedGeometry.setAttribute('instanceNormalMatrixColumn2', new THREE.InstancedBufferAttribute(new Float32Array(instanceNormalMatrixColumns2), 3));
        instancedGeometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(new Float32Array(instanceColors), 3));
        instancedGeometry.setAttribute('instanceSpeed', new THREE.InstancedBufferAttribute(new Float32Array(instanceSpeeds), 1));

        instancedGeometry.instanceCount = this._modelsCount;

        return instancedGeometry;
    }

    _createSkeleton() {
        const skeleton = this._mesh.skeleton;
        const bones = skeleton.bones;
        // console.log(skeleton.bones);
        let size = Math.sqrt(bones.length * 4);
        size = THREE.Math.ceilPowerOfTwo(size);
        size = Math.max(size, 4);

        const boneMatrices = new Float32Array(size * size * 4 * this._modelsCount);
        boneMatrices.set(skeleton.boneMatrices);

        const boneTexture = new THREE.DataTexture2DArray(boneMatrices, size, size, this._modelsCount);
        console.log(boneTexture);
        boneTexture.format = THREE.RGBAFormat;
        boneTexture.type = THREE.FloatType;
        boneTexture.needsUpdate = true;

        skeleton.boneMatrices = boneMatrices;
        skeleton.boneTexture = boneTexture;
        skeleton.boneTextureSize = size;

        return skeleton;
    }

    _createSkinnedMesh() {
        const instanceSpeeds = [];

        const parent = this._mesh.parent;
        // parent.scale.multiplyScalar(0.5);

        const skinnedMesh = new THREE.SkinnedMesh(this._instancedGeometry, this._mesh.material);
        skinnedMesh.frustumCulled = false;

        skinnedMesh.bind(this._skeleton, this._mesh.matrixWorld);

        skinnedMesh.add(parent.children[0]);

        while (parent.children.length > 0) {
            parent.remove(parent.children[0]);
        }

        parent.add(skinnedMesh);
        this.add(parent);

        // const material = new THREE.MeshBasicMaterial({ map: this._skeleton.boneTexture });
        // const planeMesh = new THREE.PlaneGeometry(1, 1, 1);
        // const mesh = new THREE.Mesh(planeMesh, material);
        // console.log(material);
        // this.add(mesh);

        // TPOSE is making models jumping
        const animations = ['LyceenHomme_TalkArmPush', 'LyceenHomme_Phone'];
        // const animations = ['left', 'right'];
        for (let index = 0; index < this._modelsCount; index++) {
            const animationController = new AnimationComponent(this._skinnedModel, skinnedMesh);

            this._animationControllers.push(animationController);
            animationController.playAnimation({ animation: animationController.actionType[animations[index]], loop: false });
        }
    }

    _addDebugSettings() {
        this._debugFolder.expanded = true;
    }

    /**
     * Events
     */
    _bindAll() {
        bindAll(this, '_resourcesReadyHandler');
    }

    _setupEventListeners() {
        this._resources.addEventListener('complete', this._resourcesReadyHandler);
    }

    _resourcesReadyHandler() {
        this._setup();
    }
}

export default AnimTexture;
