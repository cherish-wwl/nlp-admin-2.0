import request from '@/utils/request'

// export function getDictList(params) {
//   return request({
//     url: '/dict/list',
//     method: 'post',
//     data: params
//   })
// }
export function getlevelOneData() {
  return request({
    url: '/dataset/attrlist',
    method: 'get'
  })
}
export function getlevelTwoData(params) {
  return request({
    url: '/dataset/dataTypelist',
    method: 'get',
    params
  })
}
export function getTableList(params) {
  return request({
    url: '/dataset/datalist',
    method: 'post',
    params
  })
}
