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

export default gatewayApi
