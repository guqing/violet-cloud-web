import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'
import menuApi from '@/api/menu'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        menuApi
          .listRouterMap()
          .then(res => {
            var result = res.data
            getDnamicRouter(result, commit)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

function getDnamicRouter(data, commit) {
  generatorDynamicRouter(data).then(res => {
    commit('SET_ROUTERS', res)
  })
}
export default permission
