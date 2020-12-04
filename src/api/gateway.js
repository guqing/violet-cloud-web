import { axios } from '@/utils/request'

const gatewayApi = {}

gatewayApi.login = function(parameter) {
  return axios({
    url: '/route/login',
    method: 'get',
    params: parameter
  })
}

gatewayApi.listRateLimitLog = function(parameter) {
  return axios({
    url: '/route/auth/log/data',
    method: 'get',
    params: parameter
  })
}

gatewayApi.listUser = function(parameter) {
  return axios({
    url: '/route/auth/user/data',
    method: 'get',
    params: parameter
  })
}

gatewayApi.countUser = function(parameter) {
  return axios({
    url: '/route/auth/user/count',
    method: 'get',
    params: parameter
  })
}

gatewayApi.createUser = function(parameter) {
  return axios({
    url: '/route/auth/user',
    method: 'post',
    data: parameter
  })
}

gatewayApi.updateUser = function(parameter) {
  return axios({
    url: '/route/auth/user',
    method: 'put',
    data: parameter
  })
}

gatewayApi.deleteUser = function(parameter) {
  return axios({
    url: '/route/auth/user',
    method: 'delete',
    data: parameter
  })
}

gatewayApi.countRouteLog = function(parameter) {
  return axios({
    url: '/route/auth/log/count',
    method: 'get',
    params: parameter
  })
}

gatewayApi.listRouteLog = function(parameter) {
  return axios({
    url: '/route/auth/log/data',
    method: 'get',
    params: parameter
  })
}

gatewayApi.deleteRouteLogByIds = function(parameter) {
  return axios({
    url: '/route/auth/log',
    method: 'delete',
    data: parameter
  })
}

gatewayApi.listRateLimitRule = function(parameter) {
  return axios({
    url: '/route/auth/rateLimitRule/data',
    method: 'get',
    params: parameter
  })
}

gatewayApi.countRateLimitRule = function(parameter) {
  return axios({
    url: '/route/auth/rateLimitRule/count',
    method: 'get',
    params: parameter
  })
}

gatewayApi.createRateLimitRule = function(parameter) {
  return axios({
    url: '/route/auth/rateLimitRule',
    method: 'post',
    data: parameter
  })
}

gatewayApi.updateRateLimitRule = function(id, parameter) {
  return axios({
    url: `/route/auth/rateLimitRule/${id}`,
    method: 'put',
    data: parameter
  })
}

gatewayApi.deleteRateLimitRuleByIds = function(parameter) {
  return axios({
    url: '/route/auth/rateLimitRule',
    method: 'delete',
    data: parameter
  })
}

export default gatewayApi
