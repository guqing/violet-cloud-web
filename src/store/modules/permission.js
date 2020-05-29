import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'

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
    GenerateRoutes ({ commit }) {
      return new Promise(resolve => {
        generatorDynamicRouter().then(res => {
          commit('SET_ROUTERS', res)
          commit('SET_ROLES', ['admin'])
        })
        // const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        resolve()
      })
    }
  }
}

export default permission
