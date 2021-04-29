const mutations = {
    SET_LOADING(state) {
        state.state = 'LOADING';
    },

    SET_COMPLETED(state) {
        state.state = 'COMPLETED';
    },

    SET_READY(state) {
        state.state = 'READY';
    },

    SET_STEP(state, value) {
        state.step = value;
    },
};

export default mutations;
