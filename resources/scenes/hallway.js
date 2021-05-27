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
        // path: '/models/Soldier.glb',
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
