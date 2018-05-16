// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import router from './router';
import store from './store';

// Vue.use(VeeValidate);
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
});
Vue.use(BootstrapVue);


// Import Assets
import '@scss/app.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
});