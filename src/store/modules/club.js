import axios from 'axios';
import swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import router from '../../router';

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
  club: {}
};

// GETTERS //
const getters = {};

// MUTATIONS //
const mutations = {};

// ACTIONS //
const actions = {};

// export
export default {
  state,
  getters,
  actions,
  mutations
};
