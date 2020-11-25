<template>
  <div class="content">
    <login-modal v-if="!isAuthenticated"></login-modal>
    <rate-limit-rule v-else />
  </div>
</template>
<script>
import LoginModal from '../modules/LoginModal'
import RateLimitRule from './RateLimitRule'

export default {
  name: 'GateWayRateLimitRuleIndex',
  components: {
    LoginModal,
    RateLimitRule
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
