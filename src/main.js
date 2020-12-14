import Vue from 'vue'
import App from '@/App'
import router from '@/router' // api: https://github.com/vuejs/vue-router
import store from '@/store' // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie' // api: https://github.com/alfhen/vue-cookie
import '@/element-ui' // api: https://github.com/ElemeFE/element
import '@/icons' // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/scss/base.css'
import VJstree from 'vue-jstree'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import * as http from '@/assets/js/service/request'
import 'babel-polyfill'
import {
  isAuth
} from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import VueParticles from 'vue-particles'
import LightTimeline from 'vue-light-timeline'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {

  globalMethods
}
  from '@/assets/js/mixins/mixin.js'
// 导入字体图标
import './assets/font/iconfont.css'
import echarts from 'echarts'
Vue.use(VueParticles)
Vue.use(LightTimeline)
Vue.use(VueQuillEditor)
Vue.use(VueCookie)
Vue.use(VJstree)
Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype._http = http
Vue.prototype.isAuth = isAuth // 权限方法
// 全局混入全局状态
Vue.mixin(globalMethods)
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
