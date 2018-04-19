import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import axios from 'axios';

// Layout route
import layout from '@component/layout';
import login from '@component/auth/login';
import logout from '@component/auth/logout';
import notfound from '@component/notfound';

// Teacher route
import teacher from '@component/teacher/teacher';

// Student route
import student from '@component/student/student';
import student_club from '@component/student/student_club';

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
            { path: 'club', component: student_club, name: 'Student_Club' }
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

router.beforeEach((to, from, next) => {
  store.dispatch('session').then(response => {
    // user state
    var userState = store.getters.getUser;
    // meta guard
    if (to.matched.some(record => record.meta.noAuth)) {
      if (userState.token) {
        next({ name: 'Student_Club' });
        return;
      }
    }
    if (to.matched.some(record => record.meta.auth)) {
      if (!userState.token) {
        next({ name: 'Login' });
        return;
      }
    }
    next();
  });
});

export default router;
