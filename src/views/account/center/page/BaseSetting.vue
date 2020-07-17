<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="昵称" :required="true">
            <a-input placeholder="给自己起个名字" v-model="user.nickname" />
          </a-form-item>
          <a-form-item label="Bio">
            <a-textarea rows="4" placeholder="You are not alone." v-model="user.description" />
          </a-form-item>

          <a-form-item label="电子邮件" :required="false">
            <a-input placeholder="exp@admin.com" v-model="user.email" />
          </a-form-item>

          <a-form-item label="手机号码" :required="false">
            <a-input placeholder="填写一个手机号" v-model="user.telephone" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleUpdateUserInfo">
              保存
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import userApi from '@/api/user'
import { mapActions } from 'vuex'

export default {
  name: 'BaseSetting',
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.loadUser()
  },
  methods: {
    ...mapActions(['GetInfo']),

    loadUser () {
      this.GetInfo().then(res => {
        this.user = res
      })
    },

    handleUpdateUserInfo () {
      if (this.user.nickname === '') {
        this.$message.warning('昵称不能为空')
        return
      }
      if (this.user.description.length > 144) {
        this.$message.warning('个人说明不能超过144个字符')
        return
      }
      userApi.updateUserInfo(this.user).then(res => {
        this.$message.success('保存成功')
        this.loadUser()
        // 更新vuex状态
        this.GetInfo()
      }).catch(err => {
        this.$message.error(`更新用户信息出错,error: ${err.message}`)
      })
    }
  }
}
</script>
