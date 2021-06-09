export const state = () => ({
    message: '',
    isWebglReady: false,
    instructions: '',
    isFinalInstruction: false,
});

export const mutations = {
    SET_MESSAGE(state, message) {
        state.message = message;
    },

    SET_WEBGL_READY(state) {
        state.isWebglReady = true;
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

    setWebglReady({ commit }) {
        commit('SET_WEBGL_READY');
    },

    setInstructions({ commit }, instructions) {
        commit('SET_INSTRUCTIONS', instructions);
    },

    setFinalInstructions({ commit }, bool) {
        commit('SET_FINAL_INSTRUCTION', bool);
    },
};

export const getters = {
    isWebglReady(state) {
        return state.isWebglReady;
    },

    instructions(state) {
        return state.instructions;
    },

    isFinalInstruction(state) {
        return state.isFinalInstruction;
    },
};
