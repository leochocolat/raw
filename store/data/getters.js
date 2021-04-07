const getters = {
    sceneCensorshipFactor(state) {
        return (id) => {
            return state.scenes[id].censorshipFactor;
        };
    },
};

export default getters;
