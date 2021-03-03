const actions = {
    setActiveScene({ commit }, value) {
        commit('SET_ACTIVE_SCENE', value);
    },

    setMenuScene({ commit }, value) {
        commit('SET_MENU_SCENE', value);
    },
};

export default actions;
