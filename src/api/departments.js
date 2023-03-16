import request from '@/utils/request'
/**
 *
 *
 * @export
 * @return Promise
 */
export function getDepartmentsListAPI() {
  return request({
    url: '/company/department'
  })
}
/**
 *
 * @returns 部门负责人列表数据
 */
export function getEmployeeSimpleAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *@description: 新增子部门
 *@returns 精简的员工信息
 *@param {object} data 发送参数： name, code, manager, introduce, pid
 * @param {object} data 发送参数： 部门名称, 部门编码, 部门管理者, 部门介绍, 新增的这个子部门的上级部门
 */
// 参数必须用data param 会把数据通过在浏览器的url上的
export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data // 前端form表单的参数名, 直接和接口的对应, 这里可以少写很多属性名代码
  })
}
/**
 *
 *
 * @export 根据id获得部门信息 实现数据回显
 * @param {*} id
 * @return
 */
export function getDepartDetailAPI(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 *
 *
 * @export更新部门数据
 * @param {*} data: form表单数据 但是要有id, 父级的频道id
 * @return
 */
export function updateDepartmentsAPI(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

/**
 *
 *
 * @export 删除部门 - 注意: 有子部门不能删除
 * @param {*} id 当前点击的操作按钮 所在的项的id(部门id)
 * @return {*}
 */
export function delDepartmentAPI(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

