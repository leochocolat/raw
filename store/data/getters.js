const getters = {
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

    isStopped(state) {
        return state.isStopped;
    },
};

export default getters;
