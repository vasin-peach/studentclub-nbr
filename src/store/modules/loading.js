// initial state
const state = {
  loading: {
    full: true,
    half: true
  }
};

// mutations
const mutations = {
  fullLoadingChange(state, value) {
    if (state.loading.full) {
      setTimeout(() => {
        state.loading.full = value;
      }, 500);
    } else {
      state.loading.full = value;
    }
  },
  halfLoadingChange(state, value) {
    if (state.loading.half) {
      setTimeout(() => {
        state.loading.half = value;
      }, 500);
    } else {
      state.loading.half = value;
    }
  }
};

// getters
const getters = {
  getLoading: state => state.loading
};

// export
export default {
  state,
  getters,
  mutations
};
