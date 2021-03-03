const mutations = {
    SET_ACTIVE_SCENE(state, value) {
        state.active = value;
    },

    SET_MENU_SCENE(state) {
        state.menu = true;
    },
};

export default mutations;
