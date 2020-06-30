<template>
  <a-modal title="操作" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户名" has-feedback>
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                  },
                  {
                    validator: rules.username,
                    trigger: 'blur'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="密码" has-feedback>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: '请输入密码', whitespace: true },
                  { required: true, min: 3, message: '字符长度必须大于3' }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="邮箱" has-feedback>
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    type: 'email',
                    message: '邮箱地址格式不正确'
                  },
                  {
                    validator: rules.email,
                    trigger: 'blur'
                  },
                  {
                    required: true,
                    message: '请输入邮箱地址'
                  }
                ]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="角色">
          <a-select
            v-decorator="['roleIds', { rules: [{ required: true, validator: rules.roles }] }]"
            mode="multiple"
            style="width: 100%"
            placeholder="选择角色"
          >
            <a-select-option :value="role.id" label="roleName" v-for="(role, index) in roles" :key="index">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import roleApi from '@/api/role'
import userApi from '@/api/user'

const validateRoles = (rule, value, callback) => {
  if (value.length < 1) {
    callback(new Error('请选择角色'))
  } else {
    callback()
  }
}
const validateUsername = (rule, value, callback) => {
  if (!/^[A-Za-z0-9]+$/.test(value)) {
    callback(new Error('只能输入字母或数字'))
  } else {
    userApi.checkUsername(value).then(res => {
      if (res.data) {
        callback(new Error('用户名已经存在'))
      } else {
        callback()
      }
    })
  }
}

export default {
  name: 'UserModal',
  data () {
    return {
      rules: {
        roles: validateRoles,
        username: validateUsername
      },
      roles: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.$log.debug('form::', this.form)
  },
  created () {
    this.handleRoleList()
  },
  methods: {
    handleRoleList () {
      roleApi.options().then(res => {
        this.roles = res.data
      })
    },
    add () {
      this.visible = true
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        // 验证表单没错误
        that.$log.debug('form values', values)

        that.confirmLoading = true
        userApi.create(values).then(res => {
          that.$message.success('保存成功')
          that.$emit('ok')
        }).finally(() => {
          that.confirmLoading = false
          that.close()
        })
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>
