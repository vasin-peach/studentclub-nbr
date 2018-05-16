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
const state = {
  userList: null,
  clubList: null
};

// getters
const getters = {
  getUserList: state => state.userList,
  getClubList: state => state.clubList,
};

// mutations
const mutations = {
  updateUserList(state, data) {
    if (data) {
      state.userList = data;
    } else {
      state.userList = null;
    }
  },
  updateClubList(state, data) {
    if (data) {
      state.clubList = data;
    } else {
      state.clubList = null;
    }
  }
};

// actions
const actions = {

  // Request All User
  reqAllUser({
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
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/user/all', {
            token: token
          }, config
        )
        .then(response => {
          // update all userlist in local
          commit('updateUserList', response.data.users);

          // disable loading
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
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/club/all', {
            token: token
          }, config
        )
        .then(response => {
          // update all clublist in local
          commit('updateClubList', response.data.clubs);

          // disable loading
          commit('fullLoadingChange', false);
          return resolve(response);
        })
        .catch(err => {
          commit('fullLoadingChange', false);
          return reject(err);
        });
    });
  },
  // Remove User by StudentID
  userRemove({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      // loading
      commit('fullLoadingChange', true);
      // create header
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': data.token
        },
        timeout: 0
      };

      //create request
      axios
        .post(
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/user/remove', {
            data
          }, config
        )
        .then(response => {
          // disable loading
          commit('fullLoadingChange', false);
          return resolve(response);
        })
        .catch(err => {
          commit('fullLoadingChange', false);
          return reject(err);
        });
    })
  }
}

// export
export default {
  state,
  getters,
  mutations,
  actions
};