const mutations = {
    OPEN_OVERLAY(state) {
        state.isOverlayOpen = true;
    },

    CLOSE_OVERLAY(state) {
        state.isOverlayOpen = false;
    },
};

export default mutations;
