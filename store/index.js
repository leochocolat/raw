export const state = () => ({
    message: '',
    instructions: '',
    isFinalInstruction: false,
});

export const mutations = {
    SET_MESSAGE(state, message) {
        state.message = message;
    },

    SET_INSTRUCTIONS(state, instructions) {
        state.instructions = instructions;
    },

    SET_FINAL_INSTRUCTION(state, bool) {
        state.isFinalInstruction = bool;
    },
};

export const actions = {
    setup({ commit }, payload) {
        commit('SET_MESSAGE', payload.message);
    },

    setInstructions({ commit }, instructions) {
        commit('SET_INSTRUCTIONS', instructions);
    },

    setFinalInstructions({ commit }, bool) {
        commit('SET_FINAL_INSTRUCTION', bool);
    },
};

export const getters = {
    setup({ commit }, payload) {
        commit('SET_MESSAGE', payload.message);
    },

    instructions(state) {
        return state.instructions;
    },

    isFinalInstruction(state) {
        return state.isFinalInstruction;
    },
};
