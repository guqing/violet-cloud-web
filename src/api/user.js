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

userApi.create = function (parameter) {
  return axios({
    url: '/admin/user',
    method: 'post',
    data: parameter
  })
}

userApi.update = function (parameter) {
  return axios({
    url: '/admin/user',
    method: 'put',
    data: parameter
  })
}

userApi.updateProfile = function (parameter) {
  return axios({
    url: '/admin/user/profile',
    method: 'put',
    data: parameter
  })
}

userApi.updateAvatar = function (parameter) {
  return axios({
    url: '/admin/user/avatar',
    method: 'put',
    data: parameter
  })
}

userApi.updateAvatar = function (parameter) {
  return axios({
    url: '/admin/user/avatar',
    method: 'put',
    data: parameter
  })
}

userApi.updateAvatar = function (parameter) {
  return axios({
    url: '/admin/user',
    method: 'delete',
    data: parameter
  })
}

export default userApi
