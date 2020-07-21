<template>
  <div class="content">
    <login-modal v-if="!isAuthenticated"></login-modal>
    <black-list v-else />
  </div>
</template>
<script>
import LoginModal from '../modules/LoginModal'
import BlackList from './BlackList'

export default {
  name: 'GateWayBlackListIndex',
  components: {
    LoginModal,
    BlackList
  },
  computed: {
    isAuthenticated () {
      if (this.$store.getters.gatewayToken) {
        return true
      }
      return false
    }
  }
}
</script>
