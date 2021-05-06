const actions = {
    openOverlay({ commit }) {
        commit('OPEN_OVERLAY');
    },

    closeOverlay({ commit }) {
        commit('CLOSE_OVERLAY');
    },
};

export default actions;
