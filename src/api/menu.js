import { axios } from '@/utils/request'

const menuApi = {}

menuApi.listRouterMap = function() {
  return axios({
    url: '/admin/menu/router',
    method: 'get'
  })
}

menuApi.listTreeMenu = function(parameter) {
  return axios({
    url: '/admin/menu',
    method: 'get',
    params: parameter
  })
}

menuApi.getById = function(parameter) {
  return axios({
    url: `/admin/menu/${parameter}`,
    method: 'get'
  })
}
menuApi.saveOrUpdate = function(parameter) {
  return axios({
    url: `/admin/menu/save`,
    method: 'post',
    data: parameter
  })
}

menuApi.deleteByIds = function(parameter) {
  return axios({
    url: `/admin/menu`,
    method: 'delete',
    data: parameter
  })
}

export default menuApi
