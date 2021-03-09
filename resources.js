/**
 * Fonts
 */
const fonts = [];

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
        name: 'dracoScene_01',
        path: '/models/Scene_01.glb',
    },

    {
        type: 'draco',
        name: 'dracoScene_02',
        path: '/models/Scene_02.glb',
    },
    {
        type: 'draco',
        name: 'dracoScene_03',
        path: '/models/Scene_03.glb',
    },
    {
        type: 'draco',
        name: 'dracoScene_04',
        path: '/models/Scene_04.glb',
    },
    // Videos
    {
        type: 'videoTexture',
        name: 'video_test_0',
        path: '/videos/video_test_0.mp4',
    },
    {
        type: 'videoTexture',
        name: 'video_test_1',
        path: '/videos/video_test_1.mp4',
    },
    {
        type: 'videoTexture',
        name: 'video_test_2',
        path: '/videos/video_test_2.mp4',
    },
    {
        type: 'videoTexture',
        name: 'video_test_3',
        path: '/videos/video_test_3.mp4',
    },
];

const resources = [...fonts, ...images, ...webgl];

export default resources;
