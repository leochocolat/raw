export const state = () => ({
    message: '',
    instructions: '',
});

export const mutations = {
    SET_MESSAGE(state, message) {
        state.message = message;
    },

    SET_INSTRUCTIONS(state, instructions) {
        state.instructions = instructions;
    },
};

export const actions = {
    setup({ commit }, payload) {
        commit('SET_MESSAGE', payload.message);
    },

    setInstructions({ commit }, instructions) {
        commit('SET_INSTRUCTIONS', instructions);
    },
};

export const getters = {
    setup({ commit }, payload) {
        commit('SET_MESSAGE', payload.message);
    },

    instructions(state) {
        return state.instructions;
    },
};
