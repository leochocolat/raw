const resources = [
    // Models
    {
        type: 'gltf',
        name: 'supermarket',
        namespace: 'supermarket',
        path: '/models/scene_supermarket_2.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'AdulteHomme',
        namespace: 'supermarket',
        path: '/models/supermarket/AdulteHomme.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'AdulteVieux',
        namespace: 'supermarket',
        path: '/models/supermarket/AdulteVieux.glb',
        preload: false,
    },

    // Textures
    {
        type: 'basis',
        name: 'texture_supermarket',
        namespace: 'supermarket',
        path: '/textures/basis/scene_supermarket.basis',
        preload: false,
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
