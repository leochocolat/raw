const getters = {
    state(state) {
        return state.state;
    },

    step(state) {
        return state.step;
    },

    isComplete(state) {
        return state.state === 'COMPLETED';
    },

    isReady(state) {
        return state.state === 'READY';
    },
};

export default getters;
