const getters = {
    state(state) {
        return state.state;
    },

    isReady(state) {
        return state.state === 'COMPLETED';
    },
};

export default getters;
