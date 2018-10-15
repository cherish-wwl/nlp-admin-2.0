import request from '@/utils/request'

// 根据服务分类id获取服务分类详情
export function getServiceClassInfoById(params) {
  return request({
    url: '/classify/getServiceClassInfoById',
    method: 'post',
    params
  })
}

export function addRowData(params) {
  return request({
    url: '/classify/typeAdd',
    method: 'post',
    params
  })
}

export function editRowData(params) {
  return request({
    url: '/classify/typeUpdate',
    method: 'post',
    data: params
  })
}

export function delRowData(params) {
  return request({
    url: '/classify/typeDel',
    method: 'post',
    params
  })
}
