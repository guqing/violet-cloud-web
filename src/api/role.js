import { axios } from '@/utils/request'

const roleApi = {}

roleApi.listRole = function (parameter) {
  return axios({
    url: '/admin/role/list',
    method: 'get',
    params: parameter
  })
}

export default roleApi
