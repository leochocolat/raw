const getters = {
    sceneCensorshipFactor(state) {
        return (id) => {
            return state.scenes[id].censorshipFactor;
        };
    },

    isSceneComplete(state) {
        return (id) => {
            return state.scenes[id].isComplete;
        };
    },
};

export default getters;
