import router, { asyncRoutes } from './router'
// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
// to：即将要进入的目标
// from：当前导航正要离开的路由
// next：next 是一个函数，通常是指放行，next() 直接放行 ，next(路径) 跳转到某一个页面

// 什么是路由守卫？
// 再路由跳转的过程中通过路由守卫 控制它的跳转
// 有 token  访问login 跳转 其他允许
// 无 token 访问白名单 允许 访问其他跳转到login
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // next()
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()// 如果存在 token，访问的是其他页面，直接放行
      if (!store.getters.name) {
        // 通过 store/modules/user.js 把 登录者的各级权限拿到手上
        const menus = await store.dispatch('user/getUserInfoActions')
        // 根据用户实际的权限 menus 从asyncRouteArr里, 过滤出用户能访问的页面的路由对象
        const filterList = asyncRoutes.filter(routerobj => {
          // 把拿到的路由对象小写 然后一一比对
          const routerName = routerobj.children[0].name.toLowerCase()
          return menus.includes(routerName)
        })
        // 添加动态路由
        router.addRoutes(filterList)
        filterList.push({ path: '*', redirect: '/404', hidden: true })
        store.commit('permission/setRoutes', filterList)
        // router.addRoutes(asyncRoutes)
        // store.commit('permission/setRoutes', asyncRoutes)

        // 解决刷新出现的白屏bug
        next({
          path: to.path, // 保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
  // 隐藏进度条效果
  NProgress.done()
  // finish progress bar
})
