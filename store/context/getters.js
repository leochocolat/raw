const getters = {
    isDebug(state) {
        return state.isDebug;
    },

    isProduction(state) {
        return state.isProduction;
    },

    isDevelopment(state) {
        return state.isDevelopment;
    },
};

export default getters;
