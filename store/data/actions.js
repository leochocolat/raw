const actions = {
    setSceneEntries({ commit }, entries) {
        commit('SET_SCENE_ENTRIES', entries);
    },

    setSceneCensorshipFactor({ commit }, { id, value }) {
        commit('SET_SCENE_CENSORSHIP_FACTOR', { id, value });
    },
};

export default actions;
