<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-form layout="inline">
        <a-row :gutter="15">
          <a-form-item label="请求URI">
            <a-input placeholder="/admin/menu" v-model="queryParam.requestUri" />
          </a-form-item>

          <a-form-item label="请求IP">
            <a-input placeholder="127.0.0.1" v-model="queryParam.ip" />
          </a-form-item>

          <a-form-item label="请求时间">
            <a-range-picker v-model="dateRange" @change="onQueryPickChange" style="width:240px" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleSearch" :loading="loading.search">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleResetSearch" :loading="loading.reset"> 重置 </a-button>
          </a-form-item>
        </a-row>
      </a-form>
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
      :loading="loading.table"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
    </a-table>
  </a-card>
</template>
<script>
import gatewayApi from '@/api/gateway'

export default {
  name: 'RateLimitLog',
  data() {
    return {
      limitRules: [],
      loading: {
        table: false,
        search: false,
        reset: false
      },
      dateRange: [],
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
          title: '请求IP',
          dataIndex: 'ip'
        },
        {
          title: '访问位置',
          dataIndex: 'location'
        },
        {
          title: '请求时间',
          dataIndex: 'createTime'
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  mounted() {
    this.handleListRateLimitLog()
  },
  methods: {
    handleListRateLimitLog() {
      const queryParam = {
        ...this.queryParam,
        current: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      this.loading.table = true
      const countPromise = gatewayApi.countRateLimitLog(queryParam)
      const dataPromise = gatewayApi.listRateLimitLog(queryParam)
      Promise.all([countPromise, dataPromise])
        .then(values => {
          this.pagination.total = values[0]
          this.limitRules = values[1]
          this.loading.table = false
        })
        .catch(() => {
          setTimeout(() => {
            this.loading.table = false
          }, 500)
        })
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.handleListRateLimitLog()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    clearSelect(e) {
      e.preventDefault()
      this.onSelectChange([], [])
    },
    onQueryPickChange(date, dateString) {
      this.queryParam.createTimeFrom = dateString[0]
      this.queryParam.createTimeTo = dateString[1]
    },
    handleSearch() {
      this.loading.search = true
      this.handleListRateLimitLog()
      setTimeout(() => {
        this.loading.search = false
      }, 500)
    },
    handleResetSearch() {
      this.loading.reset = true
      this.queryParam = {}
      this.dateRange = []
      this.handleListRateLimitLog()
      setTimeout(() => {
        this.loading.reset = false
      }, 500)
    }
  }
}
</script>
