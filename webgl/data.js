const data = {
    scenes: {
        hallway: 'hallway',
        library: 'library',
        supermarket: 'supermarket',
        bar: 'bar',
    },

    positions: [
        { x: -0.25, y: 0.25 },
        { x: 0.25, y: 0.25 },
        { x: -0.25, y: -0.25 },
        { x: 0.25, y: -0.25 },
    ],

    settings: {
        mouseInteractions: {
            isEnable: true,
            positionFactor: { x: 5, y: 2 },
            // Degrees
            rotationFactor: { x: -30, y: 30 },
            damping: 0.1,
        },
    },

    colors: [
        'green',
        'yellow',
        'blue',
        'purple',
        //
    ],

    seconds: {
        hallway: 2,
        library: 48,
        supermarket: 21,
        bar: 33,
    },

    animations: {
        hallway: { duration: 26 },
        library: { duration: 10 },
        supermarket: { duration: 23 },
        bar: { duration: 24 },
    },

    sceneModelsCount: {
        hallway: 2,
        library: 2,
        supermarket: 2,
        bar: 2,
    },
};

export default data;
