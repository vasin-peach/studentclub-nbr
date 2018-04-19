import axios from 'axios';
import swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import router from '../../router';
import store from '../../store';

// enable axios set cookie
axios.defaults.withCredentials = true;

// create request config
var config = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 0
};

// STATE //
const state = {
  club: null
};

// GETTERS //
const getters = {
  getClubAll: state => state.club,
  getClubRange: state => (start, stop) => {
    if (state.club.length) {
      return state.club.slice(start, stop);
    }
  }
};

// MUTATIONS //
const mutations = {
  updateClubData(state, data) {
    if (data) {
      state.club = data;
    } else {
      state.club = null;
    }
  }
};

// ACTIONS //
const actions = {
  // -- Get all club -- //
  clubGet({ commit }, token) {
    return new Promise((resolve, reject) => {
      // loading
      commit('halfLoadingChange', true);

      // create request config
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'x-access-token',
          'x-access-token': token
        },
        timeout: 0
      };

      axios
        .post(
          window.location.protocol +
            '//' +
            window.location.host.split(':')[0] +
            ':3000/api/club/get',
          '',
          config
        )
        .then(response => {
          if (response.status == 200) {
            resolve(response);
            commit('halfLoadingChange', false);
          } else {
            reject();
            commit('halfLoadingChange', false);
          }
        });
    });
  }
};

// export
export default {
  state,
  getters,
  actions,
  mutations
};
