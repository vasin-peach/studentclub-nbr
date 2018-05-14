// Import Modules
import Vue from 'vue';
import Vuex from 'vuex';
import loading from './modules/loading';
import auth from './modules/auth';
import club from './modules/club';
import teacher from './modules/teacher';

// Use Moduesl
Vue.use(Vuex);

// Debug
const debug = process.env.NODE_ENV !== 'production';

//Export
export default new Vuex.Store({
  modules: {
    teacher,
    auth,
    club,
    loading,
  },
  strict: false
});