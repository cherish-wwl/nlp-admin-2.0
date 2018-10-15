import request from '@/utils/request'
// 查询字典表接口：/dict/list
export function dictList(params) {
  return request({
    url: '/dict/list',
    method: 'post',
    params
  })
}
// 查询字典表接口：/dict/list
export function getDictList() {
  return request({
    url: '/dict/list',
    method: 'post'
  })
}

// 获取大学-机构-教授 树结构
export function possessorTreeList() {
  return request({
    url: '/academy/possessorTreeList',
    method: 'post'
  })
}
