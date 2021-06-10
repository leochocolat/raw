const preload = false;

const resources = [
    // Models
    {
        type: 'gltf',
        name: 'bar',
        namespace: 'bar',
        path: '/models/bar/scene_bar_2.glb',
        preload,
    },
    {
        type: 'gltf',
        name: 'BarHomme',
        path: '/models/bar/BarHomme.glb',
        namespace: 'bar',
        preload,
    },
    {
        type: 'gltf',
        name: 'BarFemme',
        path: '/models/bar/BarFemme.glb',
        namespace: 'bar',
        preload,
    },
    {
        type: 'gltf',
        name: 'BarVieux',
        path: '/models/bar/BarVieux.glb',
        namespace: 'bar',
        preload,
    },
    // Textures
    {
        type: 'basis',
        name: 'texture_bar',
        namespace: 'bar',
        path: '/textures/basis/scene_bar.basis',
        preload,
    },
    {
        type: 'basis',
        name: 'texture_bar_items',
        namespace: 'bar',
        path: '/textures/basis/scene_bar_items.basis',
        preload,
        options: {
            flipY: false,
        },
    },
    {
        type: 'basis',
        name: 'bar_texture_violent',
        namespace: 'bar',
        path: '/textures/basis/bar_texture_violent.basis',
        preload,
    },
    // Sounds
    {
        type: 'audio',
        name: 'audio_bar',
        namespace: 'bar',
        path: '/audio/audio_bar.mp3',
        preload: true,
    },
];

export default resources;
