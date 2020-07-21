<template>
  <a-card :bordered="false">
    <a-modal v-model="visible" :title="title" :confirmLoading="loading" @ok="handleCreateOrUpdateUser">
      <a-form :form="form">
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  { required: true, message: '请输入网关用户名' },
                  { min: 3, max: 50, message: '用户名字符长度必须大于3' },
                  { max: 50, message: '用户名长度不能超过50字符' }
                ]
              }
            ]"
            placeholder="用户名"
          >
            <a-icon slot="prefix" type="user" class="form-icon" />
          </a-input>
        </a-form-item>
        <a-form-item v-if="isCreate">
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: '请输入密码' },
                  { min: 3, max: 50, message: '密码字符长度必须大于3' },
                  { max: 16, message: '密码长度不能超过16字符' }
                ]
              }
            ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" class="form-icon" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-select
            v-decorator="['roles', { rules: [{ required: true, message: '请选择角色' }] }]"
            style="width: 100%"
            placeholder="选择角色"
          >
            <a-select-option :value="role.roleName" label="roles" v-for="role in roles" :key="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import gatewayApi from '@/api/gateway'

export default {
  name: 'RouteUserModal',
  data () {
    return {
      title: '新增用户',
      visible: false,
      userParam: {},
      loading: false,
      roles: [
        { id: 1, roleName: 'admin' },
        { id: 2, roleName: 'user' }
      ]
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'gateway_user_modal' })
  },
  computed: {
    isCreate () {
      if (this.userParam.id) {
        return false
      }
      return true
    }
  },
  methods: {
    edit (record) {
      this.visible = true
      this.title = '编辑用户'
      this.userParam = Object.assign({}, record)
    },
    create () {
      this.visible = true
      this.title = '新增用户'
    },
    handleCreateOrUpdateUser () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        if (this.isCreate) {
          // 创建
          gatewayApi.createUser(this.userParam).then(res => {
            this.$message.success('创建成功')
          }).finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 1500)
          })
        } else {
          // 更新
          gatewayApi.updateUser(this.userParam).then(res => {
            this.$message.success('更新成功')
          }).finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 1500)
          })
        }
        this.visible = false
      })
    }
  }
}
</script>
