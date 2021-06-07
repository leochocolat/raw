const resources = [
    // Models
    {
        type: 'gltf',
        name: 'hallway',
        namespace: 'hallway',
        path: '/models/scene_hallway.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'LyceenHomme',
        path: '/models/LyceenHomme.glb',
        namespace: 'hallway',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'LyceenFemme',
        path: '/models/LyceenFemme.glb',
        namespace: 'hallway',
        preload: false,
    },
    // Textures
    {
        type: 'basis',
        name: 'texture_hallway',
        namespace: 'hallway',
        path: '/textures/basis/scene_hallway.basis',
        preload: false,
    },

    // Sounds
    {
        type: 'audio',
        name: 'audio_hallway',
        namespace: 'hallway',
        path: '/audio/audio_hallway.mp3',
        preload: true,
    },

];

export default resources;
