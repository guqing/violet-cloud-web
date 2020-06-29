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
                  { required: true, pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母或数字', trigger: 'blur' }
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
        <a-form-item label="邮箱">
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

const validateRoles = (rule, value, callback) => {
  if (value.length < 1) {
    callback(new Error('请选择角色'))
  } else {
    callback()
  }
}

export default {
  name: 'UserModal',
  data () {
    return {
      rules: {
        roles: validateRoles
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
      confirmLoading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    console.log('form::', this.form)
  },
  created () {
    this.handleRoleList()
  },
  methods: {
    handleRoleList () {
      roleApi.listRole(this.pagination).then(res => {
        this.roles = res.data.list
        this.pagination.current = res.data.current
        this.pagination.pageSize = res.data.pageSize
        this.pagination.total = res.data.total
      })
    },
    add () {
      this.$log.debug('新增用户', this.form)
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
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        // 验证表单没错误
        console.log('form values', values)

        _this.confirmLoading = true
        // 模拟后端请求 2000 毫秒延迟
        new Promise((resolve) => {
          setTimeout(() => resolve(), 2000)
        }).then(() => {
          // Do something
          _this.$message.success('保存成功')
          _this.$emit('ok')
        }).catch(() => {
          // Do something
        }).finally(() => {
          _this.confirmLoading = false
          _this.close()
        })
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>
