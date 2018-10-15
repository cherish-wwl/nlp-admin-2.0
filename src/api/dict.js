import request from '@/utils/request'

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
