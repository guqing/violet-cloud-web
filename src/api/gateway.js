import { axios } from '@/utils/request'

const gatewayApi = {}

gatewayApi.login = function (parameter) {
  return axios({
    url: '/route/login',
    method: 'get',
    params: parameter
  })
}

gatewayApi.listRateLimitLog = function (parameter) {
  return axios({
    url: '/route/auth/log/data',
    method: 'get',
    params: parameter
  })
}

gatewayApi.listUser = function (parameter) {
  return axios({
    url: '/route/auth/user/data',
    method: 'get',
    params: parameter
  })
}

gatewayApi.countUser = function (parameter) {
  return axios({
    url: '/route/auth/user/count',
    method: 'get',
    params: parameter
  })
}

gatewayApi.createUser = function (parameter) {
  return axios({
    url: '/route/auth/user',
    method: 'post',
    data: parameter
  })
}

gatewayApi.updateUser = function (parameter) {
  return axios({
    url: '/route/auth/user',
    method: 'put',
    data: parameter
  })
}

gatewayApi.deleteUser = function (parameter) {
  return axios({
    url: '/route/auth/user',
    method: 'delete',
    data: parameter
  })
}
export default gatewayApi
