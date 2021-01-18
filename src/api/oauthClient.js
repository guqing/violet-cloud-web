import { axios } from '@/utils/request'

const oauthClientApi = {}

oauthClientApi.list = parameter => {
  return axios({
    url: '/admin/oauth/clients',
    method: 'get',
    params: parameter
  })
}

oauthClientApi.create = parameter => {
  return axios({
    url: '/admin/oauth/clients',
    method: 'post',
    data: parameter
  })
}

oauthClientApi.updateByClientId = (clientId, parameter) => {
  return axios({
    url: `/admin/oauth/clients/${clientId}`,
    method: 'put',
    data: parameter
  })
}

oauthClientApi.existByClientId = parameter => {
  if (parameter.trim().length === 0) {
    return
  }
  return axios({
    url: `/admin/oauth/clients/check/${parameter}`,
    method: 'get'
  })
}

oauthClientApi.getByClientId = parameter => {
  return axios({
    url: `/admin/oauth/clients/${parameter}`,
    method: 'get'
  })
}
export default oauthClientApi
