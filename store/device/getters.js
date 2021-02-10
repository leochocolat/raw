const getters = {
    width(state) {
        return state.width;
    },

    height(state) {
        return state.height;
    },

    viewport(state) {
        return { width: state.width, height: state.height };
    },

    breakpoint(state) {
        return state.breakpoint;
    },

    device(state) {
        return state;
    },
};

export default getters;
