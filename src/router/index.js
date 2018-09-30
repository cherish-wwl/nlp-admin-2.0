import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '主页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/dataService',
    component: Layout,
    name: '数据服务',
    children: [{
      path: 'dataService',
      component: () => import('@/views/dataService/index'),
      meta: { title: '数据服务', icon: 'example' }
    }]
  },
  {
    path: '/dataSet',
    component: Layout,
    name: '数据集',
    children: [{
      path: '',
      component: () => import('@/views/dataSet/index'),
      meta: { title: '数据集', icon: 'example' }
    }]
  },
  {
    path: '/solutions',
    component: Layout,
    name: '解决方案',
    children: [{
      path: '',
      component: () => import('@/views/solutions/index'),
      meta: { title: '解决方案', icon: 'example' }
    }]
  },
  {
    path: '/classManage',
    component: Layout,
    redirect: '/classManage/serviceClass',
    name: '分类管理',
    meta: { title: '分类管理', icon: 'example' },
    children: [
      {
        path: 'serviceClass',
        name: '服务分类',
        component: () => import('@/views/classManage/serviceClass/index'),
        meta: { title: '服务分类', icon: 'table' }
      },
      {
        path: 'dataSetClass',
        name: '数据集分类',
        component: () => import('@/views/classManage/dataSetClass/index'),
        meta: { title: '数据集分类', icon: 'tree' }
      }
    ]
  },

  {
    path: '/contentManage',
    component: Layout,
    redirect: '/contentManage/organizationMagage',
    meta: { title: '内容管理', icon: 'example' },
    children: [
      {
        path: 'organizationMagage',
        name: '机构管理',
        component: () => import('@/views/contentManage/organizationMagage/index'),
        meta: { title: '机构管理', icon: 'form' }
      },
      {
        path: 'professorInfoManage',
        name: '教授信息管理',
        component: () => import('@/views/contentManage/professorInfoManage/index'),
        meta: { title: '教授信息管理', icon: 'form' }
      },
      {
        path: 'serverManage',
        name: '服务器管理',
        component: () => import('@/views/contentManage/serverManage/index'),
        meta: { title: '服务器管理', icon: 'form' }
      },
      {
        path: 'photoManage',
        name: '图片管理',
        component: () => import('@/views/contentManage/photoManage/index'),
        meta: { title: '图片管理', icon: 'form' }
      },
      {
        path: 'dictManage',
        name: '数据字典管理',
        component: () => import('@/views/contentManage/dictManage/index'),
        meta: { title: '数据字典管理', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
