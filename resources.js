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
];

const resources = [...fonts, ...images, ...webgl];

export default resources;
