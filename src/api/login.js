import { axios } from '@/utils/request'

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
export function login (parameter) {
  return axios({
    url: '/auth/oauth/token?grant_type=password',
    method: 'post',
    params: parameter,
    headers: {
      Authorization: 'Basic dmlvbGV0OnZpb2xldC1zZWNyZXQtMTIzNDU2'
    }
  })
}

export function socailSignLogin (parameter) {
  return axios({
    url: '/auth/social/sign/login',
    method: 'post',
    data: parameter
  })
}

export function listSupportSocail () {
  return axios({
    url: '/auth/social/list',
    method: 'get'
  })
}

export var socialLoginApi = axios.defaults.baseURL + `/auth/social/login`

export function getInfo () {
  return axios({
    url: '/auth/oauth/user',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
