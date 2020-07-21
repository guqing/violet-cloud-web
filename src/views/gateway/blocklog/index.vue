<template>
  <div class="content">
    <login-modal v-if="!isAuthenticated"></login-modal>
    <block-log v-else />
  </div>
</template>
<script>
import LoginModal from '../modules/LoginModal'
import BlockLog from './BlockLog'

export default {
  name: 'GateWayBlockLogIndex',
  components: {
    LoginModal,
    BlockLog
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
