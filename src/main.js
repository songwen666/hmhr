import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

// 导入全局挂载的组件
import Directive from './directive'
import App from './App'
import store from './store'
import router from './router'
import PageTools from './components/PageTools'
import ImagHolder from './components/ImageHolder'
import ElEMENT from 'element-ui'
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElEMENT)
Vue.use(PageTools)
Vue.use(ImagHolder)
Vue.use(Directive)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
