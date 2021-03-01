/**
 * Fonts
 */
const fonts = [];

/**
 * Images
 */
const images = [
    // Test image
    // {
    //     type: 'image',
    //     name: 'bg',
    //     path: '/images/dylk/bg.jpg',
    // },
];

/**
 * WebGL
 */
const webgl = [
    {
        type: 'draco',
        name: 'testDraco',
        path: '/models/modelDraco.gltf',
    },
];

const resources = [...fonts, ...images, ...webgl];

export default resources;
