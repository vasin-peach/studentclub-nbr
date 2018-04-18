// Import Modules
import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import auth from './modules/auth';
import loading from './modules/loading';

// Use Moduesl
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(VeeValidate);

// Import Assets
import '@scss/app.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Debug
const debug = process.env.NODE_ENV !== 'production';

//Export
export default new Vuex.Store({
  modules: {
    auth,
    loading
  },
  strict: false
});
