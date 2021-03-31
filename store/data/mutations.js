const mutations = {
    SET_SCENE_ENTRIES(state, entries) {
        state.sceneEntries = entries;

        for (const key in entries) {
            state[key] = entries[key];
        }
    },

    SET_SCENE_CENSORSHIP_FACTOR(state, { id, value }) {
        state[id].censorshipFactor = value;
    },
};

export default mutations;
