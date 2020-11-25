<template>
  <div class="content">
    <login-modal v-if="!isAuthenticated"></login-modal>
    <route-user v-else />
  </div>
</template>
<script>
import LoginModal from '../modules/LoginModal'
import RouteUser from './RouteUser'

export default {
  name: 'GateWayUserIndex',
  components: {
    LoginModal,
    RouteUser
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
