const resources = [
    // Models
    {
        type: 'gltf',
        name: 'library',
        namespace: 'library',
        path: '/models/scene_library.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'LibraryFemme',
        namespace: 'library',
        path: '/models/library/LibraryFemme.glb',
        preload: false,
    },
    {
        type: 'gltf',
        name: 'LibraryVieux',
        namespace: 'library',
        path: '/models/library/LibraryVieux.glb',
        preload: false,
    },

    // Textures
    {
        type: 'basis',
        name: 'texture_library',
        namespace: 'library',
        path: '/textures/basis/scene_library.basis',
        preload: false,
    },

    // Sounds
    // {
    //     type: 'audio',
    //     name: 'audio_library',
    //     namespace: 'library',
    //     path: '/audio/audio_library.mp3',
    //     preload: false,
    // },
];

export default resources;
