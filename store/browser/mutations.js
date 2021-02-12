const mutations = {
    SET_NAME(state, value) {
        state.name = value;
    },

    SET_SAFARI(state, value) {
        state.isSafari = value;
    },

    SET_EDGE(state, value) {
        state.isEdge = value;
    },

    SET_IE(state, value) {
        state.isIE = value;
    },

    SET_FIREFOX(state, value) {
        state.isFirefox = value;
    },
};

export default mutations;
