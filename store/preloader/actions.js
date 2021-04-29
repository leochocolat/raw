const actions = {
    start({ commit }) {
        commit('SET_LOADING');
    },

    setStep({ commit }, value) {
        commit('SET_STEP', value);
    },

    setReady({ commit }) {
        commit('SET_READY');
    },

    setComplete({ commit }) {
        commit('SET_COMPLETED');
    },
};

export default actions;
