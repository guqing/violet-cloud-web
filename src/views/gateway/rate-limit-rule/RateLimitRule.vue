<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-form layout="inline">
        <a-row :gutter="15">
          <a-form-item label="请求URI">
            <a-input placeholder="请求URI" v-model="queryParam.requestUri" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleFormReset"> 重置 </a-button>
          </a-form-item>
        </a-row>
      </a-form>
      <div style="margin-top: 15px">
        <a-button type="primary" @click="$refs.modal.add()"><a-icon type="plus" />新增</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
    </div>

    <a-alert type="info" show-icon>
      <p slot="message" style="padding: 0; margin: 0px">
        <span style="margin-right: 12px">
          已选择: <a style="font-weight: 600">{{ selectedRows.length }}</a>
        </span>
        <a style="margin-left: 24px" @click="clearSelect">清空</a>
      </p>
    </a-alert>
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="limitRules"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="action">
        <template>
          <a>编辑</a>
          <a-divider type="vertical" />
          <a>删除</a>
        </template>
      </span>
    </a-table>
    <RateLimitRuleModal ref="modal" @ok="handleModalOk" />
  </a-card>
</template>
<script>
import gatewayApi from '@/api/gateway'
import RateLimitRuleModal from '../modules/RateLimitRuleModal'

export default {
  name: 'RateLimitRule',
  components: {
    RateLimitRuleModal
  },
  data() {
    return {
      modalVisible: false,
      limitRules: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      queryParam: {},
      // 表头
      columns: [
        {
          title: '请求URI',
          dataIndex: 'requestUri'
        },
        {
          title: '请求方式',
          dataIndex: 'requestMethod'
        },
        {
          title: '限制开始时间',
          dataIndex: 'limitFrom',
          customRender: text => {
            return text ? text : '所有时间'
          }
        },
        {
          title: '限制结束时间',
          dataIndex: 'limitTo',
          customRender: text => {
            return text ? text : '所有时间'
          }
        },
        {
          title: '请求次数',
          dataIndex: 'count'
        },
        {
          title: '请求间隔',
          dataIndex: 'intervalSec',
          customRender: text => {
            return text + ' 秒'
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: text => {
            if (text === '1') {
              return <a-tag color="green">正常</a-tag>
            }
            return <a-tag color="orange">禁用</a-tag>
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created() {
    this.handleListRateLimitRule()
  },
  methods: {
    handleListRateLimitRule() {
      this.loading = true
      gatewayApi.countRateLimitRule(this.queryParam).then(res => {
        this.pagination.total = res
      })
      gatewayApi
        .listRateLimitRule(this.queryParam)
        .then(res => {
          this.limitRules = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSearch() {
      this.handleListRateLimitRule()
    },
    handleFormReset() {
      this.queryParam = {}
      this.handleListRateLimitRule()
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    clearSelect(e) {
      e.preventDefault()
      this.onSelectChange([], [])
    },
    handleModalOk() {
      this.handleListRateLimitRule()
    }
  }
}
</script>
