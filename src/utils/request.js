import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 网关路径前缀
const GATEWAY_PATH = '/route/auth'
let retryCount = 0

// 异常拦截处理器
const errorHandler = error => {
  console.log('请求异常:', error.response)
  const res = error.response

  const data = res.data
  // 从 localstorage 获取 token
  const token = storage.get(ACCESS_TOKEN)
  if (token && token.expireTime < Date.now()) {
    if (retryCount > 3) {
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    }
    // retry count auto increase
    retryCount++
    // token 过期换取token
    return store
      .dispatch('RefreshToken', token.refresh_token)
      .then(() => {
        console.log('token过期, 自动刷新token')
        // 重新请求
        return request(res.config)
      })
      .catch(() => {
        notification.error({
          message: 'Unauthorized',
          description: '登录已过期,请重新登录'
        })
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      })
  }
  // 从 localstorage 获取 token
  if (res.status === 401 && isGateWayRequest(res.config.url)) {
    notification.error({
      message: 'Unauthorized',
      description: '认证已失效，请重新认证'
    })
    sessionStorage.removeItem('GateWay_Token')
  }
  if (res.status === 403 && isGateWayRequest(res.config.url)) {
    notification.error({
      message: 'Forbidden',
      description: '抱歉，你无此操作权限，禁止访问'
    })
  } else {
    notification.error({
      message: '请求失败',
      description: data.message
    })
  }

  return Promise.reject(res)
}

// request interceptor
request.interceptors.request.use(config => {
  const gatewayToken = store.getters.gatewayToken
  if (gatewayToken && isGateWayRequest(config.url)) {
    // 网关服务请求带网关的token
    config.headers['Authorization'] = 'bearer ' + gatewayToken
  } else {
    const token = storage.get(ACCESS_TOKEN)
    // 防止已经携带Authorization header被覆盖
    const authorizationHeader = config.headers['Authorization']
    if (token && !authorizationHeader) {
      // 其他请求带认证服务器的token
      config.headers['Authorization'] = 'bearer ' + token.access_token
    }
  }

  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

function isGateWayRequest(url) {
  return url.startsWith(GATEWAY_PATH)
}

export default request

export { installer as VueAxios, request as axios }
