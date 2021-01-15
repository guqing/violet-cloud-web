<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-form layout="inline">
        <a-row :gutter="15">
          <a-form-item label="请求URI">
            <a-input placeholder="请求URI" v-model="queryParam.username" />
          </a-form-item>
          <a-form-item label="请求IP">
            <a-input placeholder="请求IP" v-model="queryParam.username" />
          </a-form-item>
          <a-form-item label="请求时间">
            <a-input placeholder="请求时间" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 8px"> 重置 </a-button>
          </a-form-item>
        </a-row>
      </a-form>
      <div style="margin-top: 15px">
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
      :data-source="list"
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
  </a-card>
</template>
<script>
import gatewayApi from '@/api/gateway'

export default {
  name: 'BlackLog',
  data() {
    return {
      list: [],
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
          title: '请求IP',
          dataIndex: 'ip'
        },
        {
          title: '访问位置',
          dataIndex: 'location'
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
    this.loadData()
  },
  methods: {
    loadData() {
      const promises = [gatewayApi.listBlockLog(), gatewayApi.countBlockLog()]
      Promise.all(promises).then(values => {
        this.list = values[0]
        this.pagination.total = values[1]
      })
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
    }
  }
}
</script>
