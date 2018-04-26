import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import axios from 'axios';
// const Header = () =>
// Layout route
const layout = () => import('@component/layout');
const login = () => import('@component/auth/login');
const logout = () => import('@component/auth/logout');
const notfound = () => import('@component/notfound');

// Teacher route
const teacher = () => import('@component/teacher/teacher');

// Student route
const student = () => import('@component/student/student');
const student_club = () => import('@component/student/student_club');
const swal = () => import('sweetalert2');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: layout,
      children: [
        // Notfound
        {
          path: '/404',
          component: notfound,
          name: 'Notfound'
        },
        // AUTH
        {
          path: '/login',
          component: login,
          name: 'Login',
          alias: '/',
          meta: { noAuth: true }
        },
        {
          path: '/logout',
          component: logout,
          name: 'Logout',
          meta: { auth: true }
        },
        // STUDENT
        {
          path: '/student',
          component: student,
          meta: { auth: true },
          children: [
            {
              path: 'club',
              component: student_club,
              name: 'Student_Club'
            }
          ]
        }
        // // TEACHER
        // {
        //   path: '/teacher',
        //   component: teacher,
        //   // meta: { auth: true },
        //   children: []
        // }
      ]
    }
  ]
});

// ------------------ //
// -- ROUTER GUARD -- //
// ------------------ //

router.beforeEach((to, from, next) => {
  // check path exist
  to.matched.length ? next() : next({ name: 'Notfound' });

  // request session token every router update
  store.dispatch('session').then(response => {
    if (response.data.token) {
      // check token expired
      store
        .dispatch('checkTokenExpired', response.data.token)
        .then(check => {})
        .catch(err => {
          swal({
            type: 'warning',
            title: 'Authentication',
            text: 'โทเคนหมดอายุ กรุณาเข้าสู่ระบบใหม่',
            timer: 3000
          }).then(() => {
            store.dispatch('logout');
            router.push({ name: 'Login' });
            return;
          });
        });
    }

    // user state
    var userState = store.getters.getUser;

    store.dispatch('userSelf', userState.token);

    // reuqest not login
    if (to.matched.some(record => record.meta.noAuth)) {
      if (userState.token) {
        next({ name: 'Student_Club' });
        return;
      }
    }

    // request login
    if (to.matched.some(record => record.meta.auth)) {
      if (!userState.token) {
        next({ name: 'Login' });
        return;
      }
    }

    // // request club data
    // if (to.fullPath.split('/').indexOf('student') > 0) {
    //   if (!store.getters.getClubAll) {
    //     store.dispatch('clubGet', userState.token);
    //   }
    // }
  });
});

export default router;
