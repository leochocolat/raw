const preload = false;

const resources = [
    // Models
    {
        type: 'gltf',
        name: 'supermarket',
        namespace: 'supermarket',
        path: '/models/scene_supermarket_2.glb',
        preload,
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
