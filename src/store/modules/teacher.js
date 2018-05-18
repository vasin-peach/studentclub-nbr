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
  userSize: 0,
  userList: null,
  clubList: null
};

// getters
const getters = {
  getUserList: state => state.userList,
  getUserSize: state => state.userSize,
  getClubList: state => state.clubList,
};

// mutations
const mutations = {
  updateUserList(state, data) {
    if (data) {
      state.userSize = data.count;
      state.userList = data.users;
    } else {
      state.userSize = 0;
      state.userList = null;
    }
  },
  updateClubList(state, data) {
    if (data) {
      state.clubList = data;
    } else {
      state.clubList = null;
    }
  },
  updateClubUser(state, data) {
    Object.keys(state.clubList).forEach(key => {
      state.clubList[key].student = data.filter(filter => {
        return state.clubList[key].name == filter.club
      })
    })
  }
};

// actions
const actions = {

  // Find User By Club
  findUserByClub({
    commit
  }, data) {
    return new Promise((resolve, reject) => {

      // create header
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': data.token
        },
        timeout: 0
      };

      var payload = {
        data: [],
        token: data.token
      }

      data.data.forEach((item, count) => {
        payload.data[count] = item.name;
      })


      //create request
      axios
        .post(
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/user/club',
          payload, config
        )
        .then(response => {
          // update all userlist in local
          commit('updateClubUser', response.data.data);

          // disable loading
          commit('fullLoadingChange', false);
          return resolve(response);
        })
        .catch(err => {
          commit('fullLoadingChange', false);
          return reject(err);
        });

    })
  },

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
          commit('updateUserList', response.data);

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
    commit,
    dispatch
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
          dispatch('findUserByClub', {
            token: token,
            data: response.data.clubs
          }).then(response => {
            return resolve(response);
            commit('fullLoadingChange', false);
          }).catch(err => {
            commit('fullLoadingChange', false);
            return reject(err);
          })
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
  },

  // Add User
  userAdd({
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
          window.location.protocol + '//' + window.location.host.split(':')[0] + ':3000/api/teacher/user/add', {
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