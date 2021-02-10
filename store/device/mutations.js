const mutations = {
    SET_VIEWPORT_SIZE(state, { width, height }) {
        state.width = width;
        state.height = height;
    },

    SET_WIDTH(state, width) {
        state.width = width;
    },

    SET_HEIGHT(state, height) {
        state.height = height;
    },

    SET_BREAKPOINT(state, breakpoint) {
        state.breakpoint = breakpoint;
    },
};

export default mutations;
