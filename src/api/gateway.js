import { axios } from '@/utils/request'

const gatewayApi = {}

const api = {
  login: '/route/login',
  rateLimitLog: '/route/auth/logs',
  rateLimitRule: '/route/auth/rate/limit/rules',
  user: '/route/auth/users',
  routeLog: '/route/auth/logs'
}

gatewayApi.login = function(parameter) {
  return axios({
    url: api.login,
    method: 'get',
    params: parameter
  })
}

gatewayApi.listRateLimitLog = function(parameter) {
  return axios({
    url: `${api.rateLimitLog}/data`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.countRateLimitLog = function(parameter) {
  return axios({
    url: `${api.rateLimitLog}/count`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.listUser = function(parameter) {
  return axios({
    url: `${api.user}/data`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.countUser = function(parameter) {
  return axios({
    url: `${api.user}/count`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.createUser = function(parameter) {
  return axios({
    url: `${api.user}`,
    method: 'post',
    data: parameter
  })
}

gatewayApi.updateUser = function(parameter) {
  return axios({
    url: `${api.user}`,
    method: 'put',
    data: parameter
  })
}

gatewayApi.deleteUser = function(parameter) {
  return axios({
    url: `${api.user}`,
    method: 'delete',
    data: parameter
  })
}

gatewayApi.countRouteLog = function(parameter) {
  return axios({
    url: `${api.routeLog}/count`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.listRouteLog = function(parameter) {
  return axios({
    url: `${api.routeLog}/data`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.deleteRouteLogByIds = function(parameter) {
  return axios({
    url: `${api.routeLog}`,
    method: 'delete',
    data: parameter
  })
}

gatewayApi.listRateLimitRule = function(parameter) {
  return axios({
    url: `${api.rateLimitRule}/data`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.countRateLimitRule = function(parameter) {
  return axios({
    url: `${api.rateLimitRule}/count`,
    method: 'get',
    params: parameter
  })
}

gatewayApi.createRateLimitRule = function(parameter) {
  return axios({
    url: `${api.rateLimitRule}`,
    method: 'post',
    data: parameter
  })
}

gatewayApi.updateRateLimitRule = function(id, parameter) {
  return axios({
    url: `${api.rateLimitRule}/${id}`,
    method: 'put',
    data: parameter
  })
}

gatewayApi.deleteRateLimitRuleByIds = function(parameter) {
  return axios({
    url: `${api.rateLimitRule}`,
    method: 'delete',
    data: parameter
  })
}

export default gatewayApi
