const actions = {
    start({ commit }) {
        commit('SET_LOADING');
    },

    complete({ commit }) {
        commit('SET_COMPLETED');
    },
};

export default actions;
