import axios from 'axios';
import swal from 'sweetalert2';
// import router from '../../router';
// import jwtDecode from 'jwt-decode';

// enable axios set cookie
axios.defaults.withCredentials = true;

// create request config
var config = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 0
};


// initial state
const state = {};

// getters
const getters = {};

// mutations
const mutations = {};

// actions
const actions = {

  // Request All User
  reqtAllUser({
    commit
  }, token) {
    return new Promise((resolve, reject) => {
      // loading
      commit('fullLoadingChange', true);

      // create header
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        timeout: 0
      };

      //create request
      axios
        .post(
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/user/all', '', config
        )
        .then(response => {
          commit('fullLoadingChange', false);
          return resolve(response);
        })
        .catch(err => {
          commit('fullLoadingChange', false);
          return reject(err);
        });
    });
  },

  // Request All Club
  reqAllClub({
    commit
  }, token) {
    return new Promise((resolve, reject) => {
      // loading
      commit('fullLoadingChange', true);

      // create header
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        timeout: 0
      };

      //create request
      axios
        .post(
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/club/all', '', config
        )
        .then(response => {
          commit('fullLoadingChange', false);
          return resolve(response);
        })
        .catch(err => {
          commit('fullLoadingChange', false);
          return reject(err);
        });
    });
  }
}

// export
export default {
  state,
  getters,
  mutations,
  actions
};