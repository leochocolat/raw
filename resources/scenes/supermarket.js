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
    // Violent
    {
        type: 'video-texture',
        name: 'supermarket_texture_violent',
        path: '/videos/supermarket_texture_violent.mp4',
        namespace: 'supermarket',
        preload: false,
        options: {
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
            flipY: false,
        },
    },
    {
        type: 'texture',
        name: 'supermarket_texture_mask',
        namespace: 'supermarket',
        path: '/textures/supermarket_texture_mask.png',
        preload,
        options: {
            flipY: false,
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
