import Vue from 'vue';
import Router from 'vue-router';
import layout from '@component/layout';

Vue.use(Router);

export default new Router({
  routes: [{ path: '/', component: layout, name: layout }]
});
