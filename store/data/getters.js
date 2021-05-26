const getters = {
    sceneData(state) {
        return (id) => {
            return state.scenes[id];
        };
    },

    sceneCensorshipFactor(state) {
        return (id) => {
            return state.scenes[id].censorshipFactor;
        };
    },

    sceneCensorshipDelta(state) {
        return (id) => {
            return state.scenes[id].censorshipDelta;
        };
    },

    isSceneComplete(state) {
        return (id) => {
            return state.scenes[id].isComplete;
        };
    },

    isComplete(state) {
        return state.isComplete;
    },
};

export default getters;
