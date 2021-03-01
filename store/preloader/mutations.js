const mutations = {
    SET_LOADING(state) {
        state.state = 'LOADING';
    },

    SET_COMPLETED(state) {
        state.state = 'COMPLETED';
    },
};

export default mutations;
