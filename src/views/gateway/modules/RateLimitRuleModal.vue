<template>
  <a-modal v-model="visible" title="新增限流规则" @ok="handleOk">
    <a-form
      :form="form"
      layout="horizontal"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
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
        <a-switch checked-children="开启" un-checked-children="关闭" v-model="limitDatePickVisible" />
      </a-form-item>
      <a-form-item label="时段" v-show="limitDatePickVisible">
        <a-range-picker v-decorator="['limitRange']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import gatewayApi from '@/api/gateway'
export default {
  name: 'RateLimitRuleModal',
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      limitDatePickVisible: false,
      visible: false,
      requestMethods: ['GET', 'POST', 'PUT', 'DELETE', 'ALL']
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'rate_limit_rule_modal' })
  },
  methods: {
    onLimitDateChange(date, dateString) {
      this.$form.setFieldsValue({
        limitFrom: dateString[0],
        limitTo: dateString[1]
      })
    },
    add() {
      this.visible = true
    },
    handleOk() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        const limitRangeTimeValue = fieldsValue['limitRange']
        if (limitRangeTimeValue) {
          delete fieldsValue.limitRange
          const values = {
            ...fieldsValue,
            limitFrom: limitRangeTimeValue[0].format('YYYY-MM-DD'),
            limitTo: limitRangeTimeValue[1].format('YYYY-MM-DD')
          }
          this.$log.debug('form values:', values)
          this.handleCreate(values)
        } else {
          this.$log.debug('form values:', fieldsValue)
          this.handleCreate(fieldsValue)
        }
      })
    },
    handleCreate(param) {
      gatewayApi.createRateLimitRule(param).then(res => {
        this.$emit('ok', res)
        this.$message.success('添加成功')
        this.visible = false
      })
    }
  }
}
</script>
