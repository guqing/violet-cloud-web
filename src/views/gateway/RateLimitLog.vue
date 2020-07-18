<template>
  <div>
    限制日志
    <div>
      <a-button @click="handleGatewayAuth">点击认证</a-button>
      <a-button @click="handleRateLimitLogList">点击请求日志列表数据</a-button>
      {{ rateLimit }}
    </div>
  </div>
</template>
<script>
import gatewayApi from '@/api/gateway'
import { mapActions } from 'vuex'

export default {
  name: 'RateLimitLog',
  data () {
    return {
      rateLimit: []
    }
  },
  methods: {
    ...mapActions(['GateWayLogin']),
    handleGatewayAuth () {
      this.GateWayLogin({ username: 'guqing', password: '123456' }).then(res => {
        this.$log.debug('网关认证token:', res)
      })
    },
    handleRateLimitLogList () {
      gatewayApi.rateLimitLogList().then(res => {
        this.$log.debug(res)
        this.rateLimit = res
      })
    }
  }
}
</script>
