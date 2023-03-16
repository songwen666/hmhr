/**
 * 按钮级权限控制
 */
import store from '@/store'

export default {
  // 自定义时定义的固定配置项
  // 参数1 指令所在的标签
  // 参数2 指令相关联的信息对象
  inserted(el, binding) {
    // console.log('el binding', el, binding)
    // 从 vuex 中取出 points
    const points = store.state.user.userInfo.roles.points
    // console.log('points', points)
    // 如果 points 中有 binding.value 则显示
    // 不存在则隐藏
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
