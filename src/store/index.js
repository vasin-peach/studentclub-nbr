// Import Modules
import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import club from './modules/club';
import loading from './modules/loading';

// Use Moduesl
Vue.use(Vuex);

// Debug
const debug = process.env.NODE_ENV !== 'production';

//Export
export default new Vuex.Store({
  modules: {
    auth,
    club,
    loading
  },
  strict: false
});
