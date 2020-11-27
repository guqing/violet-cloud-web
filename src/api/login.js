import { axios } from '@/utils/request'

const clientIdAndSecretKey = 'Basic dmlvbGV0OnZpb2xldC1zZWNyZXQtMTIzNDU2'
/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: '/auth/oauth/token?grant_type=password',
    method: 'post',
    params: parameter,
    headers: {
      Authorization: clientIdAndSecretKey
    }
  })
}

/**
 * 刷新token
 * @param {String} parameter refresh token value
 */
export function refreshToken(parameter) {
  return axios({
    url: '/auth/oauth/token?grant_type=refresh_token',
    method: 'post',
    params: {
      refresh_token: parameter
    },
    headers: {
      Authorization: clientIdAndSecretKey
    }
  })
}

/**
 * 检查token是否有效
 * @param {String} parameter token value
 */
export function checkToken(parameter) {
  return axios({
    url: '/auth/oauth/check_token',
    method: 'get',
    params: {
      token: parameter
    },
    headers: {
      Authorization: clientIdAndSecretKey
    }
  })
}

export function bindSocial(parameter) {
  return axios({
    url: '/auth/social/bind',
    method: 'post',
    data: parameter
  })
}

export function unbindSocial(parameter) {
  return axios({
    url: `/auth/social/unbind/${parameter}`,
    method: 'post'
  })
}

export function socailSignLogin(parameter) {
  return axios({
    url: '/auth/social/sign/login',
    method: 'post',
    data: parameter
  })
}

export function listSupportSocail() {
  return axios({
    url: '/auth/social/list',
    method: 'get'
  })
}

export function listUserConnectedSocail() {
  return axios({
    url: '/auth/social/providers',
    method: 'get'
  })
}

export var socialLoginApi = axios.defaults.baseURL + `/auth/social/login`

export function getInfo() {
  return axios({
    url: '/auth/oauth/user',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
