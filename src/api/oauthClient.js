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

export default oauthClientApi
