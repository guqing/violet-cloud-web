import { axios } from '@/utils/request'

const userApi = {}

userApi.list = function(parameter) {
  return axios({
    url: '/admin/user/list',
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

userApi.create = function(parameter) {
  return axios({
    url: '/admin/user',
    method: 'post',
    data: parameter
  })
}

userApi.update = function(parameter) {
  return axios({
    url: '/admin/user',
    method: 'put',
    data: parameter
  })
}

userApi.updateProfile = function(parameter) {
  return axios({
    url: '/admin/user/profile',
    method: 'put',
    data: parameter
  })
}

userApi.updateAvatar = function(parameter) {
  return axios({
    url: `/admin/user/avatar?avatar=${parameter}`,
    method: 'put'
  })
}

userApi.updatePassword = function(parameter) {
  return axios({
    url: '/admin/user/password',
    method: 'put',
    data: parameter
  })
}

userApi.resetPassword = function(parameter) {
  return axios({
    url: `/admin/user/reset/${parameter}`,
    method: 'put'
  })
}

userApi.checkUsername = (parameter) => {
  return axios({
    url: `/admin/user/check/username`,
    method: 'get',
    params: { username: parameter }
  })
}

userApi.checkEmail = (parameter) => {
  return axios({
    url: `/admin/user/check/email`,
    method: 'get',
    params: { email: parameter }
  })
}

userApi.lockUser = (parameter) => {
  return axios({
    url: `/admin/user/lock/${parameter}`,
    method: 'put'
  })
}

userApi.unlockUser = (parameter) => {
  return axios({
    url: `/admin/user/unlock/${parameter}`,
    method: 'put'
  })
}

userApi.deleteUser = (parameter) => {
  return axios({
    url: `/admin/user`,
    method: 'delete',
    data: parameter
  })
}
export default userApi
