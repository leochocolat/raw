const resources = [
    // Models
    {
        type: 'gltf',
        name: 'bar',
        namespace: 'bar',
        path: '/models/scene_bar.glb',
        preload: false,
    },

    // Textures
    {
        type: 'basis',
        name: 'texture_bar',
        namespace: 'bar',
        path: '/textures/basis/scene_bar.basis',
        preload: false,
    },
    // Sounds
    {
        type: 'audio',
        name: 'audio_bar',
        namespace: 'bar',
        path: '/audio/audio_bar.mp3',
        preload: false,
    },
];

export default resources;
