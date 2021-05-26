const actions = {
    setFromCookies({ commit }, data) {
        commit('SET_FROM_COOKIES', data);
    },

    // Censorship factor on new user session
    setSceneCensorshipInitialFactor({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_INITIAL_FACTOR', { id, value });
    },

    // User censorship choice
    setSceneCensorshipFactor({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_FACTOR', { id, value });
    },

    // New censorship factor after user choice
    setSceneCensorshipNewFactor({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_NEW_FACTOR', { id, value });
    },

    setSceneCensorshipDelta({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_DELTA', { id, value });
    },

    setSceneCensorshipMessage({ commit }, { id, message }) {
        commit('SET_SCENE_CENSORSHIP_MESSAGE', { id, message });
    },

    setSceneComplete({ commit }, { id, value }) {
        commit('SET_SCENE_COMPLETE', { id, value });
    },
};

export default actions;
