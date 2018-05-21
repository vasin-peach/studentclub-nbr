import axios from 'axios';
import swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import router from '../../router';

// enable axios set cookie
axios.defaults.withCredentials = true;

// create request config
var config = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
  timeout: 0
};

// initial state
const state = {
  user: {
    studentId: null,
    token: null,
    permission: null
  }
};

// GETTERS //
const getters = {
  getUser: state => state.user
};

// MUTATIONS //
const mutations = {
  // Update User Data
  updateUserState(state, token) {
    if (token) {
      const userState = jwtDecode(token);
      state.user.token = token;
      state.user.studentId = userState.studentId;
      state.user.permission = userState.permission;
    } else {
      state.user.token = null;
      state.user.studentId = null;
      state.user.permission = null;
    }
  },
  updateUserProfile(state, data) {
    if (data) {
      state.user.profile = data;
    } else {
      state.user.profile = null;
    }
  }
};

// ACTION //
const actions = {
  // Get Token Session //
  session({
    commit
  }) {
    return new Promise((resolve, reject) => {
      // loading
      commit('fullLoadingChange', true);

      // create request config
      let config = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        timeout: 0
      };

      //create request
      axios
        .get('http://club.nbr.ac.th:3000/api/session',
          '',
          config
        )
        // request success
        .then(response => {
          if (response.status == 200) {
            commit('updateUserState', response.data.token);
            commit('fullLoadingChange', false);
            resolve(response);
          }
        });
    });
  },

  // Check token expired //
  checkTokenExpired({
    commit
  }, token) {
    return new Promise((resolve, reject) => {
      //create request config
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
          window.location.protocol +
          '//' +
          window.location.host.split(':')[0] +
          ':3000/api/auth/check', {
            token: token
          },
          config
        )
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // User Login //
  login({
    commit
  }, data) {
    commit('fullLoadingChange', true);

    //create request
    axios
      .post(
        window.location.protocol +
        '//' +
        window.location.host.split(':')[0] +
        ':3000/api/auth/token',
        data,
        config
      )
      // login success
      .then(response => {
        if (response.data.success) {
          swal({
            type: 'success',
            title: 'Authentication',
            text: 'ทำการเข้าสู่ระบบด้วย รหัสนักเรียน: ' + data.studentId,
            timer: 3000
          });
        }
        commit('updateUserState', response.data.token);
        commit('fullLoadingChange', false);
        router.push({
          name: 'Student_Club'
        });
        return;
      })

      // login failed
      .catch(err => {
        var payload = err.response.data;

        // user not found
        if (payload.message == 'Authentication failed. User not found.') {

          commit('fullLoadingChange', false);
          //aelrt
          swal({
            type: 'error',
            title: 'Authentication',
            text: 'ไม่พบรหัสนักเรียน: ' + data.studentId,
            timer: 3000
          });
          return;
        } else if (
          // wrong password
          payload.message == 'Authentication failed. Wrong password.'
        ) {
          // alert
          commit('fullLoadingChange', false);
          swal({
            type: 'error',
            title: 'Authentication',
            text: 'รหัสผ่านไม่ถูกต้อง',
            timer: 3000
          });
          return;
        } else if (payload.message == 'server refund student to logged in.') {
          commit('fullLoadingChange', false);
          swal({
            type: 'warning',
            title: 'Authentication',
            text: 'เว็บยังไม่เปิดให้นักเรียนลงทะเบียนชุมนุม',
            timer: 3000
          });
        } else {
          commit('fullLoadingChange', false);
          swal({
            type: 'error',
            title: 'Authentication',
            text: 'เกิดเหตุขัดข้อง กรุณาลองใหม่อีกครั้งภายหลัง',
            timer: 3000
          });
        }
      });
  },
  // Logout //
  logout({
    commit
  }) {
    //create request
    commit('updateUserState', null);
    axios
      .post(
        window.location.protocol +
        '//' +
        window.location.host.split(':')[0] +
        ':3000/api/auth/logout',
        '',
        config
      )
      // login success
      .then(response => {
        router.push({
          name: 'Login'
        });
      });
  },

  // -- Update user -- //
  userUpdate({
    commit
  }, payload) {
    var token = this.getters.getUser.token;
    if (payload && token) {
      return new Promise((resolve, reject) => {
        // loading
        commit('halfLoadingChange', true);

        // create request config
        var config = {
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
            ':3000/api/auth/update', {
              payload: payload
            },
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
  },

  // -- Get self profile -- //
  userSelf({
    commit
  }, token) {
    return new Promise((resolve, reject) => {
      // check token exist
      if (!token) return reject();

      // create request config
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'x-access-token',
          'x-access-token': token
        },
        timeout: 0
      };

      // request
      axios
        .post(
          window.location.protocol +
          '//' +
          window.location.host.split(':')[0] +
          ':3000/api/auth/self',
          null,
          config
        )
        .then(response => {
          if (response.status == 200) {
            commit('updateUserProfile', response.data.data);
            return resolve(response);
          }
        })
        .catch(err => {
          return reject(err.response);
          window.location('/logout');
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