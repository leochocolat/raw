const preload = false;

const resources = [
    // Models
    {
        type: 'gltf',
        name: 'supermarket',
        namespace: 'supermarket',
        path: '/models/supermarket/scene_supermarket.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'AdulteHomme',
        namespace: 'supermarket',
        path: '/models/supermarket/AdulteHomme.glb',
        preload,
    },
    {
        type: 'gltf',
        name: 'AdulteVieux',
        namespace: 'supermarket',
        path: '/models/supermarket/AdulteVieux.glb',
        preload,
    },
    // Textures
    {
        type: 'basis',
        name: 'texture_supermarket',
        namespace: 'supermarket',
        path: '/textures/basis/scene_supermarket.basis',
        preload,
    },
    {
        type: 'basis',
        name: 'texture_supermarket_items',
        namespace: 'supermarket',
        path: '/textures/basis/scene_supermarket_items.basis',
        preload,
        options: {
            flipY: true,
        },
    },
    {
        type: 'basis',
        name: 'supermarket_texture_violent',
        namespace: 'supermarket',
        path: '/textures/basis/supermarket_texture_violent.basis',
        preload,
        options: {
            flipY: true,
        },
    },
    // Sounds
    {
        type: 'audio',
        name: 'audio_supermarket',
        namespace: 'supermarket',
        path: '/audio/audio_supermarket.mp3',
        preload: true,
    },
];

export default resources;
