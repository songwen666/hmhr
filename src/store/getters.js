const getters = {
  userId: state => state.user.userInfo.userId, // 用户ID
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 来自 state.userInfo
  name: state => state.user.userInfo.username, // 来自 state.userInfo
  departmentName: state => state.user.userInfo.departmentName
  // companyId: state => state.user.userInfo.companyId
}
export default getters

