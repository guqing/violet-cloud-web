<template>
  <a-card :bordered="false">
    <a-alert type="warning" show-icon>
      <div slot="message" class="alert-message">
        网关模块需要独立认证后才能操作，
        <a @click="handleOpenModal">点击认证</a>
        (该模块功能需要预先开启网关增强)
      </div>
    </a-alert>
    <a-modal v-model="visible" title="网关认证" @ok="handleGatewayAuth">
      <a-form :form="form">
        <a-form-item>
          <a-input
            v-decorator="['username', { rules: [{ required: true, message: '请输入网关用户名' }] }]"
            placeholder="网关用户名"
          >
            <a-icon slot="prefix" type="user" class="form-icon" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" class="form-icon" />
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import gatewayApi from '@/api/gateway'

export default {
  name: 'GateWayLoginModal',
  data () {
    return {
      visible: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'gateway_login' })
  },
  methods: {
    handleOpenModal (e) {
      e.preventDefault()
      this.visible = true
    },
    handleGatewayAuth () {
      this.$log.debug('handleGatewayAuth执行')
      this.form.validateFields((err, values) => {
        if (!err) {
          gatewayApi.login(values).then(res => {
            var token = res.data
            this.visible = false
            this.$store.commit('SET_GATEWAY_TOKEN', token)
          })
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
.alert-message {
  font-size: 16px;
}
.form-icon {
  color: rgba(0, 0, 0, 0.25);
}
</style>
