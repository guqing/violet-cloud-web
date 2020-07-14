import { axios } from '@/utils/request'

const supportApi = {}

supportApi.sendEmailCaptcha = function (parameter) {
  return axios({
    url: '/admin/mail/captcha',
    method: 'get',
    params: parameter
  })
}
export default supportApi
