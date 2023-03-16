import Vue from 'vue'
import Router from 'vue-router'
// 引入多个动态路由模块
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 静态路由表，项目中每个用户都可以访问的功能
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/excel',
    component: Layout,
    hidden: true, // 不显示到左侧菜单
    children: [{
      path: '',
      component: () => import('@/views/excel/')
    }]
  },
  {
    path: '/',
    component: Layout,
    // 加载为整个 layout
    redirect: '/homepage',
    children: [{
      path: 'homepage',
      name: 'Homepage',
      component: () => import('@/views/homepage/index'),
      // 懒加载
      meta: { title: '首页', icon: 'dashboard' }
      // meta 用于生成左侧的标题和图型
    }]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  // 先空着这里，后面来补充功能
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 控制路由滚动行为  滚动到顶部
  scrollBehavior: () => ({ y: 0 }),
  // 组合到一起组成路由表
  // routes: [...constantRoutes, ...asyncRoutes]
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
