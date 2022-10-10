import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import LoginView from '../views/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/home',
    component: () => import('../views/HomeView.vue'),
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('../views/IndexView.vue'),
      },
      {
        path: '/employ',
        component: () => import('../views/EmployeeView.vue'),
      },
      {
        path: '/department',
        component: () => import('../views/DepartmentView.vue'),
      },
      {
        path: '/attendance',
        component: () => import('../views/AttendanceView.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
