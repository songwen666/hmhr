import request from '@/utils/request'
/**
 * @description 获取所有角色信息
 * @param {*} params  {page, pagesize}
 * @returns
 */
export function getRolesAPI(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params: params
  })
}
/**
 *
 *
 * @export 取公司信息
 * @param {*} companyId
 * @return
 */
export function getCompanyInfoAPI(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
/**
 * @description: 获取某一个角色列表
 * @param {*} id
 * @return {*}
 */
export function getRoleIdAPI(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
// 根据ID更新角色
/**
 *
 *
 * @export 编辑角色后间数据更新
 * @param {*} data
 * @return {*}  编辑的结果
 */
export function updateRoleAPI(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @description: 新增角色
 * @param {*} data {name,description}
 * @return {*}
 */
export function addRoleAPI(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
/**
 * @description: 删除角色
 * @param {*} id 角色id
 * @return {*}
 */
export function deleteRoleAPI(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPermAPI(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
