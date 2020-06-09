import { axios } from '@/utils/request'

const roleApi = {}

roleApi.listRole = function (parameter) {
  return axios({
    url: '/admin/role/list',
    method: 'get',
    params: parameter
  })
}
roleApi.createOrUpdate = (parameter) => {
  return axios({
    url: '/admin/role/save',
    method: 'post',
    data: parameter
  })
}
export default roleApi
