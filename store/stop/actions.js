const actions = {
    openOverlay({ commit }) {
        commit('OPEN_OVERLAY');
    },

    closeOverlay({ commit }) {
        commit('CLOSE_OVERLAY');
    },

    stop({ commit }) {
        commit('STOP');
    },
};

export default actions;
