// Scenes Resources
import hallway from './scenes/hallway';
import library from './scenes/library';
import supermarket from './scenes/supermarket';
import bar from './scenes/bar';

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
    // Scenes
    ...hallway,
    ...library,
    ...supermarket,
    ...bar,

    // Global
    {
        type: 'gltf',
        name: 'CameraMovement',
        path: '/models/CameraMovement.glb',
        preload: false,
    },

    // Test Animations
    {
        type: 'texture',
        name: 'tex1',
        path: '/textures/tex1.jpg',
        namespace: 'animTexture',
        preload: false,
    },

    // Test Blur
    {
        type: 'texture',
        name: 'test-blur',
        path: '/textures/test-blur.png',
        preload: false,
        options: {
            flipY: true,
        },
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
        path: '/videos/gore_test_0.mp4',
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
