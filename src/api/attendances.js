import request from '@/utils/request'

export function UploadattendanceAPI(data) {
  return request({
    url: '/attendances/import',
    method: 'POST',
    data // 前端form表单的参数名, 直接和接口的对应, 这里可以少写很多属性名代码
  })
}
/**
 *
 *
 * @export查询考勤数据列表
 * @param {*} params {page:当前页,pagesize：每页条数}
 * @return {*}
 */

export function getAttendanceListAPI(params) {
  return request({
    url: '/attendances',
    params
  })
}

