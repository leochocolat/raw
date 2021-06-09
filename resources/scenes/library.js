const preload = false;

const resources = [
    // Models
    {
        type: 'gltf',
        name: 'library',
        namespace: 'library',
        path: '/models/scene_library.glb',
        preload,
    },
    {
        type: 'gltf',
        name: 'LibraryFemme',
        namespace: 'library',
        path: '/models/library/LibraryFemme.glb',
        preload,
    },
    {
        type: 'gltf',
        name: 'LibraryVieux',
        namespace: 'library',
        path: '/models/library/LibraryVieux.glb',
        preload,
    },
    // Textures
    {
        type: 'basis',
        name: 'texture_library',
        namespace: 'library',
        path: '/textures/basis/scene_library.basis',
        preload,
    },
    // Sounds
    {
        type: 'audio',
        name: 'audio_library',
        namespace: 'library',
        path: '/audio/audio_library.mp3',
        preload: true,
    },
    {
        type: 'audio',
        name: 'audio_library_fx',
        namespace: 'library',
        path: '/audio/audio_library_fx.mp3',
        preload: true,
    },

    // Violent
    {
        type: 'basis',
        name: 'image_gore_library',
        path: '/textures/basis/image_gore_library.basis',
        namespace: 'library',
        preload: false,
        options: {
            flipY: false,
        },
    },

    // {
    //     type: 'video-texture',
    //     name: 'video_library_001',
    //     path: '/videos/video_library_001.mp4',
    //     namespace: 'library',
    //     preload: false,
    //     options: {
    //         autoplay: false,
    //         loop: false,
    //         muted: true,
    //         playsinline: true,
    //         flipY: false,
    //         pausedAfterPlay: true,
    //     },
    // },

    {
        type: 'video-texture',
        name: 'video_library_001',
        path: '/videos/video_library_001_shorter.mp4',
        namespace: 'library',
        preload: false,
        options: {
            autoplay: false,
            loop: false,
            muted: true,
            playsinline: true,
            flipY: false,
            pausedAfterPlay: true,
        },
    },
];

export default resources;
