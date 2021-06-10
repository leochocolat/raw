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
        preload: false,
        options: {
            weight: 300,
        },
    },
];

/**
 * Scenes
 */
const scenes = [
    // Scenes
    ...hallway,
    ...library,
    ...supermarket,
    ...bar,
];

/**
 * Shared Audios
 */
const audios = [
    // Main
    {
        type: 'audio',
        name: 'audio_main',
        path: '/audio/audio_main.mp3',
        preload: false,
    },
];

/**
 * Shared WebGL
 */
const webgl = [
    // Main textures
    {
        type: 'basis',
        name: 'texture_adulte_homme',
        path: '/textures/basis/texture_adulte_homme.basis',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'basis',
        name: 'texture_adulte_femme',
        path: '/textures/basis/texture_adulte_femme.basis',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'basis',
        name: 'texture_vieux_femme',
        path: '/textures/basis/texture_vieux_femme.basis',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'basis',
        name: 'texture_vieux_homme',
        path: '/textures/basis/texture_vieux_homme.basis',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'basis',
        name: 'texture_lycee_femme',
        path: '/textures/basis/texture_lycee_femme.basis',
        preload: false,
        options: {
            flipY: true,
        },
    },
    {
        type: 'basis',
        name: 'texture_lycee_homme',
        path: '/textures/basis/texture_lycee_homme.basis',
        preload: false,
        options: {
            flipY: true,
        },
    },
    // Test Animations
    {
        type: 'texture',
        name: 'tex1',
        path: '/textures/tex1.jpg',
        preload: false,
    },
    {
        type: 'texture',
        name: 'tex2',
        path: '/textures/tex2.jpg',
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
        path: '/textures/blur-mask-test.png',
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
        options: {
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
            flipY: true,
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
            flipY: true,
        },
    },
];

const resources = [...scenes, ...fonts, ...webgl, ...audios];

export default resources;
