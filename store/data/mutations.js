const mutations = {
    SET_SCENE_CENSORSHIP_FACTOR(state, { id, value }) {
        state.scenes[id].censorshipFactor = value;
    },

    SET_SCENE_CENSORSHIP_DELTA(state, { id, value }) {
        state.scenes[id].censorshipDelta = value;
    },

    SET_SCENE_COMPLETE(state, { id, value }) {
        state.scenes[id].isComplete = value;

        // Set Global Complete state if all scenes are completed
        for (const key in state.scenes) {
            if (!state.scenes[key].isComplete) return;
        }

        state.isComplete = true;
    },
};

export default mutations;
