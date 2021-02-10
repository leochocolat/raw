const actions = {
    setViewportSize({ commit }, { width, height }) {
        commit('SET_VIEWPORT_SIZE', { width, height });
    },

    setWidth({ commit }, width) {
        commit('SET_WIDTH', width);
    },

    setHeight({ commit }, height) {
        commit('SET_HEIGHT', height);
    },

    setBreakpoint({ commit }, breakpoint) {
        commit('SET_BREAKPOINT', breakpoint);
    },
};

export default actions;
