const mutations = {
    OPEN_OVERLAY(state) {
        state.isOverlayOpen = true;
    },

    CLOSE_OVERLAY(state) {
        state.isOverlayOpen = false;
    },

    STOP(state) {
        state.isStopped = true;
    },
};

export default mutations;
