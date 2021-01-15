<template>
  <a-modal v-model="visible" title="新增限流规则" @ok="handleOk" @cancle="handleCancel" destroyOnClose>
    <a-form
      :form="form"
      layout="horizontal"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      <a-form-item label="ID" v-show="false">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="请求URI">
        <a-input
          v-decorator="[
            'requestUri',
            {
              rules: [{ required: true, message: '请输入请求URI' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="请求方式">
        <a-select
          v-decorator="[
            'requestMethod',
            {
              rules: [{ required: true, message: '请选择请求方式' }]
            }
          ]"
        >
          <a-select-option :value="item" v-for="item in requestMethods" :key="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="请求次数">
        <a-input-number
          style="width:100%"
          v-decorator="[
            'count',
            {
              rules: [{ required: true, message: '请输入请求次数' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="时间周期">
        <a-input-number
          v-decorator="[
            'intervalSec',
            {
              rules: [{ required: true, message: '请输入请求周期' }]
            }
          ]"
          style="width:100%"
        />
      </a-form-item>
      <a-form-item label="规则状态">
        <a-switch
          checked-children="正常"
          un-checked-children="禁用"
          v-decorator="['status', { valuePropName: 'checked', initialValue: true }]"
        />
      </a-form-item>
      <a-form-item label="时段限制">
        <a-switch checked-children="开启" un-checked-children="关闭" v-model="limitTimePickVisible" />
      </a-form-item>
      <a-form-item label="时段" v-show="limitTimePickVisible">
        <a-time-picker v-model="limitTimeRange.limitFrom" @change="onLimitTimeFromChange" style="margin-right:8px" />
        <a-time-picker v-model="limitTimeRange.limitTo" @change="onLimitTimeToChange" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import gatewayApi from '@/api/gateway'
import moment from 'moment'
import pick from 'lodash.pick'

export default {
  name: 'RateLimitRuleModal',
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      limitTimeFomartRange: {},
      limitTimeRange: {},
      limitTimePickVisible: false,
      visible: false,
      requestMethods: ['GET', 'POST', 'PUT', 'DELETE', 'ALL']
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'rate_limit_rule_modal' })
  },
  methods: {
    onLimitTimeFromChange(time, timeString) {
      this.limitTimeFomartRange.limitFrom = timeString
    },
    onLimitTimeToChange(time, timeString) {
      this.limitTimeFomartRange.limitTo = timeString
    },
    edit(record) {
      this.visible = true
      this.handleResetTimePicker()
      if (record.limitFrom && record.limitTo) {
        this.limitTimePickVisible = true
      }
      record.status = Boolean(record.status)
      this.$nextTick(() => {
        const fieldsValue = pick(record, 'id', 'requestUri', 'requestMethod', 'count', 'intervalSec', 'status')
        if (record.limitFrom && record.limitTo) {
          this.limitTimeRange = {
            limitFrom: moment(record.limitFrom, 'HH:mm:ss'),
            limitTo: moment(record.limitTo, 'HH:mm:ss')
          }
        }
        this.form.setFieldsValue(fieldsValue)
      })
    },
    add() {
      this.visible = true
      this.handleResetTimePicker()
    },
    handleResetTimePicker() {
      this.limitTimePickVisible = false
      this.limitTimeRange = {}
      this.limitTimeFomartRange = {}
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        Object.assign(values, this.limitTimeFomartRange)
        this.$log.debug('form values:', values)
        if (values.id) {
          this.handleUpdate(values.id, values)
        } else {
          this.handleCreate(values)
        }
      })
    },
    handleCancel() {
      this.handleReset()
    },
    handleCreate(param) {
      gatewayApi.createRateLimitRule(param).then(res => {
        this.$emit('ok', res)
        this.$message.success('添加成功')
        this.handleReset()
      })
    },
    handleUpdate(id, values) {
      gatewayApi.updateRateLimitRule(id, values).then(res => {
        this.$emit('ok', res)
        this.handleReset()
        this.$message.success('更新成功')
      })
    },
    handleReset() {
      this.form.resetFields()
      this.visible = false
      this.limitTimePickVisible = false
    }
  }
}
</script>
