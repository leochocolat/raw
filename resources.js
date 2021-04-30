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
        path: '/models/Hallway.glb',
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
        path: '/models/Hallway.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'HommeAdulte',
        path: '/models/HommeAdulte.glb',
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
        name: 'texture_hallway',
        namespace: 'hallway',
        path: '/textures/basis/scene_hallway.basis',
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
    },
    {
        type: 'texture',
        name: 'tex1',
        path: '/textures/tex1.jpg',
        namespace: 'animTexture',
        preload: false,
    },
    // Videos
    {
        type: 'video-texture',
        name: 'video_test_0',
        path: '/videos/video_test_0.mp4',
        preload: false,
        namespace: 'screen',
        options: {
            autoplay: true,
            loop: true,
            muted: false,
        },
    },

    // Videos
    // {
    //     type: 'videoTexture',
    //     name: 'video_test_0',
    //     path: '/videos/video_test_0.mp4',
    // },
    // {
    //     type: 'videoTexture',
    //     name: 'video_test_1',
    //     path: '/videos/video_test_1.mp4',
    // },
    // {
    //     type: 'videoTexture',
    //     name: 'video_test_2',
    //     path: '/videos/video_test_2.mp4',
    // },
    // {
    //     type: 'videoTexture',
    //     name: 'video_test_3',
    //     path: '/videos/video_test_3.mp4',
    // },
];

const resources = [...fonts, ...webgl];

export default resources;
