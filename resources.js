/**
 * Fonts
 */
const fonts = [
    {
        type: 'font',
        name: 'Default Sans',
    },
];

/**
 * Images
 */
const images = [
    {
        type: 'texture',
        name: 'tex1',
        path: '/images/tex1.jpg',
    },
    {
        type: 'texture',
        name: 'tex2',
        path: '/images/tex2.jpg',
    },
    {
        type: 'texture',
        name: 'tex3',
        path: '/images/tex3.jpg',
    },
];

/**
 * Images
 */
const textures = [
    {
        type: 'texture',
        name: 'tex1',
        path: '/images/tex1.jpg',
    },
    {
        type: 'texture',
        name: 'tex2',
        path: '/images/tex2.jpg',
    },
    {
        type: 'texture',
        name: 'tex3',
        path: '/images/tex3.jpg',
    },
];
/**
 * WebGL
 */
const webgl = [
    // Models
    {
        type: 'draco',
        name: 'CameraMovement',
        path: '/models/CameraMovement.glb',
    },
    {
        type: 'draco',
        name: 'scene_hallway',
        path: '/models/scene_hallway.gltf',
    },
    {
        type: 'gltf',
        name: 'soldier',
        path: '/models/Soldier.glb',
    },
    // Videos
    {
        type: 'videoTexture',
        name: 'video_test_0',
        path: '/videos/video_test_0.mp4',
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

const resources = [...fonts, ...images, ...textures, ...webgl];

export default resources;
