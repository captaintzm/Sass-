/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import {
  isURL
} from '@/utils/validate'
import {
  clearLoginInfo
} from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
    path: '/404',
    component: _import('common/404'),
    name: '404',
    meta: {
      title: '404未找到'
    }
  },
  {
    path: '/login',
    component: _import('login/login'),
    name: 'login',
    meta: {
      title: '登录'
    }
  },
  {
    path: '/loginYc',
    component: _import('login/loginYc'),
    name: 'loginYc',
    meta: {
      title: '登录'
    }
  },

]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  // redirect: {
  //   name: 'home'
  // },
  meta: {
    title: '主入口整体布局'
  },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {
      path: '/home',
      component: _import('common/home'),
      name: 'home',
      meta: {
        title: '首页',
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/memberRecharge',
      component: _import('Member/recharge'),
      name: 'Recharge',
      meta: {
        title: '会员充值',
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/theme',
      component: _import('common/theme'),
      name: 'theme',
      meta: {
        title: '主题',
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/yycenter-sohpp',
      component: _import('yycenter/sohpp'),
      name: 'yycenter-sohpp',
      meta: {
        title: '商城',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/yycenter-supplyChain',
      component: _import('yycenter/supplyChain'),
      name: 'yycenter-supplyChain',
      meta: {
        title: 'api服务',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/yycenter-installment',
      component: _import('yycenter/installment'),
      name: 'yycenter-installment',
      meta: {
        title: '分期商城',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/yycenter-pack',
      component: _import('yycenter/pack'),
      name: 'yycenter-pack',
      meta: {
        title: '礼包',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/yycenter-credit',
      component: _import('yycenter/credit'),
      name: 'yycenter-credit',
      meta: {
        title: '解决方案',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/yycenter-market',
      component: _import('yycenter/market'),
      name: 'yycenter-market',
      meta: {
        title: '营销工具',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/ceshis-packsinfo',
      component: _import('ceshi/packsinfo'),
      name: 'ceshis-packsinfo',
      meta: {
        title: '测试',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitpack-zidingyi-gitpack',
      component: _import('gitpack/zidingyi/gitpack'),
      name: 'gitpack-zidingyi-gitpack',
      meta: {
        title: '礼包创建',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    // { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } }
    {
      path: '/choiceModel',
      component: _import('setMall/choiceModel'),
      name: 'choiceModel',
      meta: {
        title: '选择模板',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/basicInfo',
      component: _import('setMall/basicInfo'),
      name: 'basicInfo',
      meta: {
        title: '选择信息',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/ceshi-fenfa',
      component: _import('ceshi/fenfa'),
      name: 'ceshi-fenfa',
      meta: {
        title: '礼包分发',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitpack-zidingyi-packfm',
      component: _import('gitpack/zidingyi/packfm'),
      name: 'gitpack-zidingyi-packfm',
      meta: {
        title: '礼包详情',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitpack-zidingyi-packlist',
      component: _import('gitpack/zidingyi/packlist'),
      name: 'gitpack-zidingyi-packlist',
      meta: {
        title: '礼包列表',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitpack-zidingyi-selectshoop',
      component: _import('gitpack/zidingyi/selectshoop'),
      name: 'gitpack-zidingyi-selectshoop',
      meta: {
        title: '挑选商品',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitcredit-creditlist',
      component: _import('gitcredit/creditlist'),
      name: 'gitcredit-creditlist',
      meta: {
        title: '积分列表',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitcredit-gitcredit',
      component: _import('gitcredit/gitcredit'),
      name: 'gitcredit-gitcredit',
      meta: {
        title: '积分创建',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitcredit-distributect',
      component: _import('gitcredit/distributect'),
      name: 'gitcredit-distributect',
      meta: {
        title: '发放积分',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/gitcredit-sensitize',
      component: _import('gitcredit/sensitize'),
      name: 'gitcredit-sensitize',
      meta: {
        title: '企业激活',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/cardticket-cardticketList',
      component: _import('cardticket/cardticketList'),
      name: 'cardticket-cardticketList',
      meta: {
        title: '卡券列表',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/cardticket-gitcardticket',
      component: _import('cardticket/gitcardticket'),
      name: 'cardticket-gitcardticket',
      meta: {
        title: '卡券创建',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/cardticket-setcardticket',
      component: _import('cardticket/setcardticket'),
      name: 'cardticket-setcardticket',
      meta: {
        title: '卡券激活',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/cardticket-yzxlist',
      component: _import('cardticket/yzxlist'),
      name: 'cardticket-yzxlist',
      meta: {
        title: '代金卡券',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {

      path: '/platform',
      component: _import('Commodity/platform'),
      name: 'platform',
      meta: {
        title: '平台商品库',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/orderList',
      component: _import('order/orderList'),
      name: 'orderList',
      meta: {
        title: '商品订单',
        isTab: true,
        keepAlive: true // 不需要缓存
      }
    },
    {
      path: '/orderDetail',
      component: _import('order/orderDetail'),
      name: 'orderDetail',
      meta: {
        title: '订单详情',
        isTab: true,
        keepAlive: false, // 不需要缓存
        query: ''
      }
    },
    {
      path: '/distributionOrderList',
      component: _import('order/distributionOrderList'),
      name: 'distributionOrderList',
      meta: {
        title: '分销订单',
        isTab: true,
        keepAlive: false, // 不需要缓存
        query: ''
      }
    },
    {
      path: '/distributionOrderDetail',
      component: _import('order/distributionOrderDetail'),
      name: 'distributionOrder',
      meta: {
        title: '分销详情',
        isTab: true,
        keepAlive: false, // 不需要缓存
        query: ''
      }
    },
    {
      path: '/apiOrderList',
      component: _import('order/apiOrderList'),
      name: 'apiOrderList',
      meta: {
        title: 'API接口订单',
        isTab: true,
        keepAlive: true // 不需要缓存
      }
    },
    {
      path: '/apiOrderDetail',
      component: _import('order/apiOrderDetail'),
      name: 'apiOrderDetail',
      meta: {
        title: '订单详情',
        isTab: true,
        keepAlive: false, // 不需要缓存
        query: ''
      }
    },
    {

      path: '/system-resource',
      component: _import('system/resource'),
      name: 'system-resource',
      meta: {
        title: '资源管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/modules-sys-sysorganization',
      component: _import('modules/sys/sysorganization'),
      name: 'modules-sys-sysorganization',
      meta: {
        title: '组织架构',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/bucklingpointSet',
      component: _import('Finance/bucklingpointSet'),
      name: 'bucklingpointSet',
      meta: {
        title: '扣点设置',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/financeIndex',
      component: _import('Finance/financeIndex'),
      name: 'financeIndex',
      meta: {
        title: '财务总览',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/rechargeManagement',
      component: _import('Finance/rechargeManagement'),
      name: 'rechargeManagement',
      meta: {
        title: '商城财务',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/transactionDetails',
      component: _import('Finance/transactionDetails'),
      name: 'transactionDetails',
      meta: {
        title: '交易明细',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/orgAccount',
      component: _import('Finance/orgAccount'),
      name: 'orgAccount',
      meta: {
        title: '机构资金',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/commoditiesList',
      component: _import('supplierManagement/commoditiesList'),
      name: 'commoditiesList',
      meta: {
        title: '商品列表',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/commoditiesAdd',
      component: _import('supplierManagement/commoditiesAdd'),
      name: 'commoditiesAdd',
      meta: {
        title: '新增商品',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/smsManagementList',
      component: _import('Finance/smsManagementList'),
      name: 'smsManagementList',
      meta: {
        title: '短信管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/InvoicingManagement',
      component: _import('Finance/InvoicingManagement'),
      name: 'InvoicingManagement',
      meta: {
        title: '商品发票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/apiInvoicingManagement',
      component: _import('Finance/apiInvoicingManagement'),
      name: 'apiInvoicingManagement',
      meta: {
        title: 'API商品发票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/serviceInvoice',
      component: _import('Finance/serviceInvoice'),
      name: 'serviceInvoice',
      meta: {
        title: '服务发票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/freightInvoice',
      component: _import('Finance/freightInvoice'),
      name: 'freightInvoice',
      meta: {
        title: '运费发票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/ServiceCharge',
      component: _import('Finance/ServiceCharge'),
      name: 'ServiceCharge',
      meta: {
        title: '服务费管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/freight',
      component: _import('Finance/freight'),
      name: 'freight',
      meta: {
        title: '运费开票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/goodsInvoicing',
      component: _import('Finance/goodsInvoicing'),
      name: 'goodsInvoicing',
      meta: {
        title: '商品开票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/apigoodsInvoicing',
      component: _import('Finance/apigoodsInvoicing'),
      name: 'apigoodsInvoicing',
      meta: {
        title: 'API商品开票',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    //
    {
      path: '/Picturelibrary',
      component: _import('system/Picturelibrary'),
      name: 'Picturelibrary',
      meta: {
        title: '图片库',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/addressManage',
      component: _import('AddressLibrary/addressManage'),
      name: 'addressManage',
      meta: {
        title: '地址库',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/video-teaching',
      component: _import('video/videoTeaching'),
      name: 'video-teaching',
      meta: {
        title: '视频教程',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/productDynamics',
      component: _import('video/productDynamics'),
      name: 'productDynamics',
      meta: {
        title: '产品动态',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/FinancialAllocation',
      component: _import('Finance/FinancialAllocation'),
      name: 'FinancialAllocation',
      meta: {
        title: '财务配置',
        isTab: true,
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: '/financialManage',
      name: 'financialManage',
      meta: {
        title: '开票管理',
        isTab: true,
        keepAlive: false // 不需要缓存
      },
      component: _import('Finance/financialManage'),
    }
    // SMS Management
  ],
  beforeEnter(to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {

      if (localStorage.getItem('isFromYunCai') === 'true') {
        next({
          name: 'loginYc'
        })
      } else {
        next({
          name: 'login'
        })
      }
      clearLoginInfo()
      localStorage.clear()
      sessionStorage.clear()
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    // console.log(to)
    // console.log(from)
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({
    y: 0
  }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/ybt-backend/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({
      data
    }) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        let toObj = {}
        for (let key in to) {
          toObj[key] = to[key]
        }
        toObj.replace = true
        next(toObj)
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      if (localStorage.getItem('isFromYunCai') === 'true') {
        router.push({
          name: 'loginYc'
        })
      } else {
        router.push({
          name: 'login'
        })
      }
    })
  }
  /* 路由发生改变修改页面的title */
  if (to.meta.title) {
    document.title = 'SaaS云平台-' + to.meta.title
  }
  // next()
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      {
        path: '*',
        redirect: {
          name: '404'
        }
      }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}

export default router