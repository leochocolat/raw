const getters = {
    sceneEntries(state) {
        return state.sceneEntries;
    },

    entryById(state) {
        return (id) => {
            return state[id];
        };
    },
};

export default getters;
