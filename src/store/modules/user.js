import Vue from 'vue'
import { login, logout } from '@/api/login'
import userAPI from '@/api/user'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    refresh_token: '',
    expireTime: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refresh_token = token
    },
    SET_EXPIRETIME: (state, expireTime) => {
      state.expireTime = expireTime
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            if (response.code === 0) {
              Vue.ls.set(ACCESS_TOKEN, response.data, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', response.data)
              resolve(response)
            } else {
              reject(response)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    SocialLogin({ commit }, data) {
      var tokenInfo = data || {}
      return new Promise((resolve, reject) => {
        console.log('social login:', tokenInfo)
        Vue.ls.set(
          ACCESS_TOKEN,
          tokenInfo.access_token,
          7 * 24 * 60 * 60 * 1000
        )
        Vue.ls.set(
          REFRESH_TOKEN,
          tokenInfo.refresh_token,
          8 * 24 * 60 * 60 * 1000
        )

        const current = new Date()
        const expireTime = current.setTime(
          current.getTime() + 1000 * tokenInfo.expires_in
        )
        commit('SET_TOKEN', tokenInfo.access_token)
        commit('SET_REFRESH_TOKEN', tokenInfo.refresh_token)
        commit('SET_EXPIRETIME', expireTime)
        resolve(tokenInfo)
      })
    },
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        userAPI
          .getInfo()
          .then((response) => {
            const result = response.data
            if (result.role && result.role.permissions.length > 0) {
              const role = result.role
              role.permissions = result.role.permissions
              role.permissions.map((per) => {
                if (
                  per.actionEntitySet != null &&
                  per.actionEntitySet.length > 0
                ) {
                  const action = per.actionEntitySet.map((action) => {
                    return action.action
                  })
                  per.actionList = action
                }
              })

              role.permissionList = role.permissions.map((permission) => {
                return permission.identify
              })
              commit('SET_ROLES', result.role)
              commit('SET_INFO', result)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }

            commit('SET_NAME', { name: result.nickname, welcome: welcome() })
            if (result.avatar === '') {
              var avatar = '/avatar2.jpg'
              commit('SET_AVATAR', avatar)
              result.avatar = avatar
            } else {
              commit('SET_AVATAR', result.avatar)
            }
            resolve(result)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
      })
    },
  },
}

export default user
