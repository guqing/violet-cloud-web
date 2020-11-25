<template>
  <div class="content">
    <login-modal v-if="!isAuthenticated"></login-modal>
    <rate-limit-log v-else />
  </div>
</template>
<script>
import LoginModal from '../modules/LoginModal'
import RateLimitLog from './RateLimitLog'

export default {
  name: 'GateWayRateLimitLogIndex',
  components: {
    LoginModal,
    RateLimitLog
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
