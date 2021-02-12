const actions = {
    setName({ commit }, value) {
        commit('SET_NAME', value);
    },

    setSafari({ commit }, value) {
        commit('SET_SAFARI', value);
    },

    setEdge({ commit }, value) {
        commit('SET_EDGE', value);
    },

    setIE({ commit }, value) {
        commit('SET_IE', value);
    },

    setFirefox({ commit }, value) {
        commit('SET_FIREFOX', value);
    },
};

export default actions;
