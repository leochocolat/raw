const actions = {
    setDebug({ commit }, value) {
        commit('SET_DEBUG', value);
    },

    setProduction({ commit }, value) {
        commit('SET_PRODUCTION', value);
    },

    setDevelopment({ commit }, value) {
        commit('SET_DEVELOPMENT', value);
    },
};

export default actions;
