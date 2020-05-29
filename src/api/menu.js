import { axios } from '@/utils/request'

const menuAPI = {}

menuAPI.getRouterMap = function () {
  return axios({
    url: '/admin/menu/router',
    method: 'get'
  })
}

export default menuAPI
