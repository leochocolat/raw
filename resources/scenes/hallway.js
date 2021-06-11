const preload = false;

const resources = [
    // Models
    {
        type: 'gltf',
        name: 'hallway',
        namespace: 'hallway',
        path: '/models/hallway/scene_hallway.glb',
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
        type: 'video-texture',
        name: 'hallway_texture_violent',
        namespace: 'bar',
        path: '/videos/hallway_texture_violent.mp4',
        preload,
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
        name: 'hallway_texture_mask',
        namespace: 'hallway',
        path: '/textures/hallway_texture_mask.png',
        preload,
        options: {
            flipY: false,
        },
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
