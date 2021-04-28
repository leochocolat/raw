const actions = {
    start({ commit }) {
        commit('SET_LOADING');
    },

    setStep({ commit }, value) {
        commit('SET_STEP', value);
    },

    complete({ commit }) {
        commit('SET_COMPLETED');
    },
};

export default actions;
