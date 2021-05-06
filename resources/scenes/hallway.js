const resources = [
    // Models
    {
        type: 'gltf',
        name: 'hallway',
        namespace: 'hallway',
        path: '/models/scene_hallway-d.glb',
        preload: false,
    },

    // Hallway
    {
        type: 'basis',
        // type: 'texture',
        name: 'texture_hallway',
        namespace: 'hallway',
        path: '/textures/basis/scene_hallway.basis',
        // path: '/textures/scene_hallway.png',
        preload: false,
    },
];

export default resources;
