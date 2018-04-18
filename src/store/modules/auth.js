import axios from 'axios';
import swal from 'sweetalert2';

// initial state
const state = {};

// getters
const getters = {};

// actions
const actions = {
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
          ':3000/api/token',
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

// mutations
const mutations = {};

// export
export default {
  state,
  getters,
  actions,
  mutations
};
