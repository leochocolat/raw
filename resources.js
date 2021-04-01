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
const images = [];

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
    // Textures
    {
        type: 'texture',
        name: 'texture_test',
        path: '/textures/texture_test.png',
    },
    // Videos
    {
        type: 'videoTexture',
        name: 'video_test_0',
        path: '/videos/video_test_0.mp4',
    },
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

const resources = [...fonts, ...images, ...webgl];

export default resources;
