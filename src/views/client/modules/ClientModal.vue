<template>
  <a-modal title="操作" :visible="visible" @cancel="handleCancel" :width="600" :maskClosable="false">
    <a-spin :spinning="formReadyLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="客户端ID" has-feedback>
          <a-input
            :disabled="!isCreate"
            v-decorator="[
              'clientId',
              {
                rules: [
                  {
                    required: true,
                    validator: clientIdValidator,
                    trigger: 'blur'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="客户端密钥" v-if="isCreate">
          <a-input
            v-decorator="[
              'clientSecret',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入客户端密钥',
                    trigger: 'blur'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="Scope">
          <a-input
            v-decorator="[
              'scope',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择Scope',
                    trigger: 'blur'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="认证模式">
          <a-select
            v-decorator="['authorizedGrantTypes', { rules: [{ required: true, message: '请选择认证模式' }] }]"
            mode="multiple"
            style="width: 100%;"
            placeholder="选择认证模式"
          >
            <a-select-option
              :value="grantType"
              label="authorizedGrantTypes"
              v-for="(grantType, index) in authorizedGrantTypes"
              :key="index"
            >
              {{ grantType }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="token有效期(秒)">
          <a-input-number
            v-decorator="['accessTokenValidity', { rules: [{ required: true, message: '请输入token有效期' }] }]"
            style="width: 100%"
            :min="1"
          />
        </a-form-item>
        <a-form-item label="refresh token有效期(秒)">
          <a-input-number
            v-decorator="[
              'refreshTokenValidity',
              { rules: [{ required: true, message: '请输入refresh token有效期' }] }
            ]"
            style="width: 100%"
            :min="1"
          />
        </a-form-item>
        <a-form-item label="重定向URI">
          <a-input v-decorator="['webServerRedirectUri']" />
        </a-form-item>
        <a-form-item label="自动授权">
          <a-switch
            v-decorator="['autoapprove', { initialValue: true, valuePropName: 'checked' }]"
            checked-children="开"
            un-checked-children="关"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <ReactiveButton
        type="primary"
        @click="handleOk"
        @callback="handleOkCallback"
        :loading="confirmLoading"
        :errored="saveErrored"
      />
    </template>
  </a-modal>
</template>
<script>
import ReactiveButton from '@/components/ReactiveButton'
import oauthClientApi from '@/api/oauthClient'
import pick from 'lodash.pick'

export default {
  name: 'ClientModal',
  components: {
    ReactiveButton
  },
  data() {
    return {
      visible: false,
      isCreate: false,
      formReadyLoading: false,
      confirmLoading: false,
      saveErrored: false,
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 16 },
        sm: { span: 14 }
      },
      labelCol: {
        xs: { span: 24 },
        md: { span: 8 },
        sm: { span: 9 }
      },
      authorizedGrantTypes: ['authorization_code', 'implicit', 'password', 'client_credentials']
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    clientIdValidator(rule, value, callback) {
      if (!value) {
        callback(new Error('客户端ID不能为空'))
      }
      if (!/^[a-zA-Z0-9_-]{3,16}$/.test(value)) {
        callback(new Error('客户端ID不合法'))
      }
      if (this.isCreate) {
        // 创建时校验client id是否存在
        oauthClientApi.existByClientId(value).then(res => {
          if (res.data) {
            callback(new Error('客户端ID已经存在'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    },
    add() {
      this.isCreate = true
      this.visible = true
    },
    edit(record) {
      this.isCreate = false
      this.visible = true
      oauthClientApi.getByClientId(record.clientId).then(res => {
        const client = pick(
          res.data,
          'autoapprove',
          'authorizedGrantTypes',
          'clientId',
          'accessTokenValidity',
          'refreshTokenValidity',
          'scope',
          'webServerRedirectUri'
        )
        this.form.setFieldsValue(client)
      })
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.confirmLoading = true
        this.$log.debug('handle ok', values)
        if (this.isCreate) {
          this.handleCreate(values)
        } else {
          this.handleUpdate(values)
        }
      })
    },
    handleCreate(values) {
      oauthClientApi
        .create(values)
        .then(res => {
          this.confirmLoading = false
          this.saveErrored = false
        })
        .catch(err => {
          this.$log.debug('创建失败', err)
          this.saveErrored = true
          this.confirmLoading = false
        })
    },
    handleUpdate(values) {
      oauthClientApi
        .updateByClientId(values.clientId, values)
        .then(res => {
          this.confirmLoading = false
          this.saveErrored = false
        })
        .catch(err => {
          this.$log.debug('编辑失败', err)
          this.saveErrored = true
          this.confirmLoading = false
        })
    },
    handleCancel() {
      this.visible = false
    },
    handleOkCallback() {
      this.form.resetFields()
      this.visible = false
      this.$emit('ok')
    }
  }
}
</script>
