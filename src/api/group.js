import { axios } from '@/utils/request'

const groupApi = {}

groupApi.list = function(parameter) {
  return axios({
    url: '/admin/group/list',
    method: 'get',
    params: parameter
  })
}

groupApi.getById = function(parameter) {
  return axios({
    url: `/admin/group/${parameter}`,
    method: 'get'
  })
}

groupApi.createOrUpdate = function(parameter) {
  return axios({
    url: `/admin/group/save`,
    method: 'post',
    data: parameter
  })
}

export default groupApi
