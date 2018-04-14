import Vue from 'vue';
import Router from 'vue-router';

// Layout route
import layout from '@component/layout';
import login from '@component/auth/login';

// Teacher route
import teacher from '@component/teacher/teacher';

// Student route
import student from '@component/student/student';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: layout,
      children: [
        // AUTH
        {
          path: '/login',
          component: login,
          name: login,
          alias: '/'
        },
        // TEACHER
        {
          path: '/teacher',
          component: teacher,
          children: []
        },
        // STUDENT
        {
          path: '/student',
          component: student,
          children: []
        }
      ]
    }
  ]
});
