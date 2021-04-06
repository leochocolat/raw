const mutations = {
    SET_SCENE_ENTRIES(state, entries) {
        // Prevent mutation errors
        const newEntries = JSON.parse(JSON.stringify(entries));
        state.sceneEntries = newEntries;

        for (const key in entries) {
            state[key] = entries[key];
        }
    },

    SET_SCENE_CENSORSHIP_FACTOR(state, { id, value }) {
        state[id].censorshipFactor = value;
    },
};

export default mutations;
