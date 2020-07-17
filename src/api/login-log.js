import { axios } from '@/utils/request'

const loginLogApi = {}

loginLogApi.list = function (parameter) {
  return axios({
    url: '/admin/log/login',
    method: 'get',
    params: parameter
  })
}
export default loginLogApi
