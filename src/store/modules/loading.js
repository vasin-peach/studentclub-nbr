// initial state
const state = {
  loading: {
    full: false,
    half: false
  }
};

// mutations
const mutations = {
  fullLoadingChange(state, value) {
    if (state.loading.full) {
      setTimeout(() => {
        state.loading.full = value;
        console.log(value);
      }, 1000);
    } else {
      state.loading.full = value;
      console.log(value);
    }
  },
  halfLoadingChange(state, value) {
    if (state.loading.half) {
      setTimeout(() => {
        state.loading.half = value;
      }, 1000);
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
