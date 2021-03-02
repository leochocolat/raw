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
    {
        type: 'draco',
        name: 'testDraco',
        path: '/models/modelDraco.gltf',
    },
    {
        type: 'draco',
        name: 'dracoPeople',
        path: '/models/Scene_People-D.glb',
    },
];

const resources = [...fonts, ...images, ...webgl];

export default resources;
