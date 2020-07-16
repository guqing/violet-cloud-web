import { axios } from '@/utils/request'

const logApi = {}

logApi.list = function (parameter) {
  return axios({
    url: '/admin/log',
    method: 'get',
    params: parameter
  })
}
export default logApi
