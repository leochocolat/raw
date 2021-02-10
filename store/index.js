export const state = () => ({
    message: '',
});

export const mutations = {
    SET_MESSAGE(state, message) {
        state.message = message;
    },
};

export const actions = {
    setup({ commit }, payload) {
        commit('SET_MESSAGE', payload.message);
    },
};
