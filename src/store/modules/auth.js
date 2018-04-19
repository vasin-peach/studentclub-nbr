import axios from 'axios';
import swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import router from '../../router';

// enable axios set cookie
axios.defaults.withCredentials = true;

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
    }
  },
  saveToken(state, token) {}
};

// ACTION //
const actions = {
  // Get Token Session //
  session({ commit }) {
    return new Promise((resolve, reject) => {
      // loading
      commit('fullLoadingChange', true);
      // create request config
      let config = {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 0
      };

      //create request
      axios
        .get(
          window.location.protocol +
            '//' +
            window.location.host.split(':')[0] +
            ':3000/api/session',
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

  // User Login //
  login({ commit }, data) {
    commit('fullLoadingChange', true);

    // create request config
    let config = {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 0
    };

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
        router.push({ name: 'Student_Club' });
        return;
      })

      // login failed
      .catch(err => {
        var payload = err.response.data;

        // user not found
        if (payload.message == 'Authentication failed. User not found.') {
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
          swal({
            type: 'error',
            title: 'Authentication',
            text: 'รหัสผ่านไม่ถูกต้อง',
            timer: 3000
          });
          return;
        }
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
