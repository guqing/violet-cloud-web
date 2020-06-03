import { axios } from '@/utils/request'

const userApi = {}

userApi.list = function (parameter) {
  return axios({
    url: '/admin/user/list',
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export default userApi
