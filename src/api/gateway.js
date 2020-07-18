import { axios } from '@/utils/request'

const gatewayApi = {}

gatewayApi.login = function (parameter) {
  return axios({
    url: '/route/login',
    method: 'get',
    params: parameter
  })
}

gatewayApi.rateLimitLogList = function (parameter) {
  return axios({
    url: '/route/auth/log/data',
    method: 'get',
    params: parameter
  })
}

export default gatewayApi
