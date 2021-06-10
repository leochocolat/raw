const preload = false;

const resources = [
    // Models
    {
        type: 'gltf',
        name: 'hallway',
        namespace: 'hallway',
        path: '/models/scene_hallway.glb',
        preload,
    },
    {
        type: 'gltf',
        name: 'LyceenHomme',
        path: '/models/hallway/LyceenHomme.glb',
        namespace: 'hallway',
        preload,
    },
    {
        type: 'gltf',
        name: 'LyceenFemme',
        path: '/models/hallway/LyceenFemme.glb',
        namespace: 'hallway',
        preload,
    },
    // Textures
    {
        type: 'basis',
        name: 'texture_hallway',
        namespace: 'hallway',
        path: '/textures/basis/scene_hallway.basis',
        preload,
    },
    {
        type: 'basis',
        name: 'hallway_texture_violent',
        namespace: 'bar',
        path: '/textures/basis/hallway_texture_violent.basis',
        preload,
    },
    // {
    //     type: 'basis',
    //     name: 'texture_hallway_items',
    //     namespace: 'bar',
    //     path: '/textures/basis/texture_hallway_items.basis',
    //     preload,
    //     options: {
    //         flipY: false,
    //     },
    // },

    // Sounds
    {
        type: 'audio',
        name: 'audio_hallway',
        namespace: 'hallway',
        path: '/audio/audio_hallway.mp3',
        preload: true,
    },
    {
        type: 'audio',
        name: 'audio_hallway_fx',
        namespace: 'hallway',
        path: '/audio/audio_hallway_fx.mp3',
        preload: true,
    },
];

export default resources;
