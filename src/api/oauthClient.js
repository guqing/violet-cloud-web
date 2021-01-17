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

oauthClientApi.existByClientId = parameter => {
  return axios({
    url: `/admin/oauth/clients/check/${parameter}`,
    method: 'get'
  })
}

export default oauthClientApi
