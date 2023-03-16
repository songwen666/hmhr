import { constantRoutes } from '@/router'
// 静态路由和动态路由和在一其 并且动态合并
export default {
  namespaced: true,
  state: () => ({
    routes: constantRoutes // 默认静态路由
  }),
  mutations: {
    // 设置动态路由方法
    setRoutes(state, asyncRoutes) {
      // 将动态路由和静态路由组合起来
      // console.log('将动态路由和静态路由组合起来')
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  },
  getters: {},
  actions: {}
}

