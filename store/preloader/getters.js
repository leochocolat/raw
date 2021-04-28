const getters = {
    state(state) {
        return state.state;
    },

    step(state) {
        return state.step;
    },

    isReady(state) {
        return state.state === 'COMPLETED';
    },
};

export default getters;
