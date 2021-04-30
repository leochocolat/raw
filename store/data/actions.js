const actions = {
    setFromCookies({ commit }, data) {
        commit('SET_FROM_COOKIES', data);
    },

    setSceneCensorshipFactor({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_FACTOR', { id, value });
    },

    setSceneCensorshipDelta({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_DELTA', { id, value });
    },

    setSceneComplete({ commit }, { id, value }) {
        commit('SET_SCENE_COMPLETE', { id, value });
    },

    stop({ commit }) {
        commit('SET_STOPPED');
    },
};

export default actions;
