<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-form layout="inline">
        <a-row :gutter="15">
          <a-form-item label="请求URI">
            <a-input placeholder="角色名称" v-model="queryParam.username" />
          </a-form-item>
          <a-form-item label="请求IP">
            <a-input placeholder="角色名称" v-model="queryParam.username" />
          </a-form-item>
          <a-form-item label="请求时间">
            <a-input placeholder="角色名称" />
          </a-form-item>
          <span class="table-page-search-submitButtons">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 8px"> 重置 </a-button>
          </span>
        </a-row>
      </a-form>
      <div style="margin-top: 15px">
        <a-button type="primary"><a-icon type="plus" />新增</a-button>
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
  </a-card>
</template>
<script>
import gatewayApi from '@/api/gateway'

export default {
  name: 'Black',
  data() {
    return {
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
          title: '请求IP',
          dataIndex: 'ip'
        },
        {
          title: '限制开始时间',
          dataIndex: 'limitFrom'
        },
        {
          title: '限制结束时间',
          dataIndex: 'limitTo'
        },
        {
          title: '访问位置',
          dataIndex: 'location'
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: text => {
            if (text === '1') {
              return '启用'
            }
            return '禁用'
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
    this.loadData()
  },
  methods: {
    loadData() {
      const promises = [gatewayApi.listBlackList(), gatewayApi.countBlackList()]
      Promise.all(promises).then(values => {
        this.limitRules = values[0]
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
