const mutations = {
    SET_FROM_COOKIES(state, data) {
        for (const key in state) {
            state[key] = data[key];
        }

        state.isComplete = data.isComplete;
    },

    SET_SCENE_CENSORSHIP_FACTOR(state, { id, value }) {
        state.scenes[id].censorshipFactor = value;
    },

    SET_SCENE_CENSORSHIP_DELTA(state, { id, value }) {
        state.scenes[id].censorshipDelta = value;
    },

    SET_SCENE_CENSORSHIP_MESSAGE(state, { id, message }) {
        state.scenes[id].message = message;
    },

    SET_SCENE_COMPLETE(state, { id, value }) {
        state.scenes[id].isComplete = value;

        // Set Global Complete state if all scenes are completed
        for (const key in state.scenes) {
            if (!state.scenes[key].isComplete) return;
        }

        state.isComplete = true;
    },

    SET_STOPPED(state) {
        state.isStopped = true;
    },
};

export default mutations;
