import PageTools from './PageTools'
import UploadImg from './UploadImg'
import ImagHolder from './ImageHolder'

export default {
  install(Vue) {
    // 参数1：名字 ，参数2;内容
    Vue.component('ImagHolder', ImagHolder)
    Vue.component('PageTools', PageTools)
    Vue.component('UploadImg', UploadImg)
  }
}
// - Vue.use 可以接收一个对象，Vue.use(obj)
// - 对象 obj 中需要提供一个 **install** 函数
// - 在 Vue.use(obj) 时，会自动调用该 install 函数，并传入 Vue构造器
// - 如果传入Vue.use()里是一个函数, 直接传入Vue构造器, 直接执行此函数
