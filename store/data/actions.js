const actions = {
    setSceneCensorshipFactor({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_FACTOR', { id, value });
    },

    setSceneCensorshipDelta({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_DELTA', { id, value });
    },

    setSceneComplete({ commit }, { id, value }) {
        commit('SET_SCENE_COMPLETE', { id, value });
    },
};

export default actions;
