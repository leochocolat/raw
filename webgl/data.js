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
};

export default data;
