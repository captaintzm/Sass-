import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import {
  clearLoginInfo
} from '@/utils'
import {
  format
} from 'path';

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})


/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // config.headers['token'] = localStorage.getItem("token") // Vue.cookie.get('token') // 请求头带上token
  config.headers['token'] = localStorage.getItem("token") + '.' + localStorage.getItem("orgId") + '.' + localStorage.getItem("pageSiteId") // Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

// http.interceptors.request.use(
//   config => {
//     console.log(1111)
//     if (localStorage.getItem("token")) { //判断token是否存在
//       console.log(32222)
//       config.headers.Authorization = localStorage.getItem("token");  //将token设置成请求头
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   }
// );

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    if (localStorage.getItem('isFromYunCai') ==='true') {
      router.push({
        name: 'loginYc'
      })
    } else {
      router.push({
        name: 'login'
      })
    }
    clearLoginInfo()
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */

function getFormData(obj = {}) { // 参数序列化
  let formData = new FormData()
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key])
  })
  return formData
}

http.adornData = (data = {}, formData) => {
  data = formData ? getFormData(data) : data
  return data
}

export default http