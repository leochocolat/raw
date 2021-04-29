const mutations = {
    SET_DEBUG(state, value) {
        state.isDebug = value;
    },

    SET_PRODUCTION(state, value) {
        state.isProduction = value;
    },

    SET_DEVELOPMENT(state, value) {
        state.isDevelopment = value;
    },
};

export default mutations;
