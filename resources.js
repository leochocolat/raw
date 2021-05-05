/**
 * Fonts
 */
const fonts = [
    {
        type: 'font',
        name: 'Default Sans',
        path: '/',
        preload: true,
        options: {
            weight: 300,
        },
    },
];

/**
 * WebGL
 */
const webgl = [
    // Models
    {
        type: 'gltf',
        name: 'CameraMovement',
        path: '/models/CameraMovement.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'library',
        namespace: 'library',
        path: '/models/scene_library-d.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'hallway',
        namespace: 'hallway',
        path: '/models/scene_hallway-d.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'HommeAdulte',
        path: '/models/HommeAdulte-d.glb',
        namespace: 'animTexture',
        preload: false,
    },
    // Textures
    {
        type: 'basis',
        name: 'texture_library',
        namespace: 'library',
        path: '/textures/basis/scene_library.basis',
        preload: false,
    },
    {
        type: 'basis',
        // type: 'texture',
        name: 'texture_hallway',
        namespace: 'hallway',
        path: '/textures/basis/scene_hallway.basis',
        // path: '/textures/scene_hallway.jpg',
        preload: false,
    },
    // Test Blur
    {
        type: 'texture',
        name: 'texture-test-blur',
        path: '/textures/texture_test_blur.png',
        namespace: 'blur',
        preload: false,
    },
    {
        type: 'texture',
        name: 'blur-mask-test',
        path: '/textures/blur-mask-test.jpg',
        namespace: 'blur',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'texture',
        name: 'tex1',
        path: '/textures/tex1.jpg',
        namespace: 'animTexture',
        preload: false,
    },
    // Test Videos
    {
        type: 'video-texture',
        name: 'video_test_0',
        path: '/videos/video_test_0.mp4',
        preload: false,
        namespace: 'screen',
        options: {
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
        },
    },
    // Test Violent content
    {
        type: 'texture',
        name: 'texture-gore-test',
        path: '/textures/video-gore-test.jpg',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'video-texture',
        name: 'video_test_0',
        path: '/videos/video_test_0.mp4',
        preload: false,
        namespace: 'screen',
        options: {
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
        },
    },
    {
        type: 'video-texture',
        name: 'video-gore-test',
        path: '/videos/gore_test2.mp4',
        preload: false,
        options: {
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
        },
    },
];

const resources = [...fonts, ...webgl];

export default resources;
