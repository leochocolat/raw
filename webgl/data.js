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

        blur: {
            wobbleIntensity: 0.5,
            spreadingTreshold: 0.05,
            intensityFactor: 2,
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
        hallway: { duration: 27.64 },
        library: { duration: 26, blurDelay: 3 },
        supermarket: { duration: 28.66 },
        bar: { duration: 24.33 },
    },

    sceneModelsCount: {
        hallway: 2,
        library: 2,
        supermarket: 2,
        bar: 2,
    },
};

export default data;
