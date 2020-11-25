<template>
  <div class="content">
    <login-modal v-if="!isAuthenticated"></login-modal>
    <route-log v-else />
  </div>
</template>
<script>
import LoginModal from '../modules/LoginModal'
import RouteLog from './RouteLog'

export default {
  name: 'GateWayRouteLogIndex',
  components: {
    LoginModal,
    RouteLog
  },
  computed: {
    isAuthenticated() {
      if (this.$store.getters.gatewayToken) {
        return true
      }
      return false
    }
  }
}
</script>
