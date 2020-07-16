import Vue from 'vue'
import store from '@/store'

// 只要包含列出的任意一个权限，元素就会显示
const hasAnyPermission = Vue.directive('hasAnyPermission', {
  inserted: function (el, binding, vnode) {
    const actionNames = binding.arg
    const permissions = store.getters.userInfo.permissions
    const elVal = vnode.context.$route.meta.permission
    for (const actionName of actionNames) {
      var action = elVal + ':' + actionName
      if (!permissions.includes(action)) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    }
  }
})

export default hasAnyPermission
