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
      },
      {
        path: '/leave',
        component: () => import('../views/LeaveView.vue'),
      },
      {
        path: '/leaveType',
        component: () => import('../views/LeaveTypeView.vue'),
      },
      {
        path: '/role',
        component: () => import('../views/RoleView.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
