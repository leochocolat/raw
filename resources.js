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
        name: 'hallway',
        path: '/models/Hallway.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'scene_hallway',
        path: '/models/scene_hallway.gltf',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'soldier',
        path: '/models/Soldier.glb',
        namespace: 'animTexture',
        preload: false,
    },
    // Textures
    {
        type: 'texture',
        name: 'tex1',
        path: '/images/tex1.jpg',
        namespace: 'animTexture',
        preload: false,
    },
    {
        type: 'texture',
        name: 'tex2',
        path: '/images/tex2.jpg',
        namespace: 'animTexture',
        preload: false,
    },
    {
        type: 'texture',
        name: 'tex3',
        path: '/images/tex3.jpg',
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
