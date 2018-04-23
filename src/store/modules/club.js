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
    if (state.club) {
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
      state.club = 'empty';
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
            commit('updateClubData', response.data.data);
            resolve(response);
            commit('halfLoadingChange', false);
          } else {
            reject();
            commit('halfLoadingChange', false);
          }
        })
        // token expired
        .catch(err => {
          router.push({ name: 'Logout' });
        });
    });
  },
  // -- Update Current(member) -- //
  clubUpdateCurrent({ commit }, data) {
    return new Promise((resolve, reject) => {
      // check payload not empty
      if (data.name && data.amount && data.token) {
        // loading
        commit('halfLoadingChange', true);

        // create request config
        let config = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'x-access-token',
            'x-access-token': data.token
          },
          timeout: 0
        };

        // create payload
        let payload = {
          amount: data.amount,
          name: data.name
        };

        axios
          .post(
            window.location.protocol +
              '//' +
              window.location.host.split(':')[0] +
              ':3000/api/club/update/current',
            payload,
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
          })
          // token expired
          .catch(err => {
            swal({
              type: 'error',
              title: 'ปฎิเสธการดำเนินการ',
              text:
                'มีผู้สมัครชุมนุมแทรก ระหว่างที่คุณกำลังดำเนินการ, กรุณารีเฟรชหน้า'
            });
            return reject();
          });
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
