const getters = {
    name(state) {
        return state.name;
    },

    isSafari(state) {
        return state.isSafari;
    },

    isEdge(state) {
        return state.isEdge;
    },

    isIE(state) {
        return state.isIE;
    },

    isFirefox(state) {
        return state.isFirefox;
    },
};

export default getters;
