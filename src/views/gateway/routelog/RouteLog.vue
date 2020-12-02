<template>
  <div>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-form layout="inline">
          <a-row :gutter="15">
            <a-form-item label="IP">
              <a-input placeholder="访问ip" v-model="queryParam.ip" />
            </a-form-item>
            <a-form-item label="目标路径">
              <a-input placeholder="目标路径" v-model="queryParam.targetUri" />
            </a-form-item>
            <a-form-item label="请求方式">
              <a-select v-model="queryParam.requestMethod" style="width: 200px">
                <a-select-option :value="item" v-for="item in requestMethods" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch" :loading="loading.search">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleResetSearch"> 重置 </a-button>
            </a-form-item>
            <a-form-item>
              <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                  <a-menu-item key="1" @click="handleDeleteInBatch"><a-icon type="delete" />删除</a-menu-item>
                </a-menu>
                <a-button> 批量操作 <a-icon type="down" /> </a-button>
              </a-dropdown>
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
        :data-source="activities"
        :pagination="pagination"
        :loading="loading.onload"
        @change="handleTableChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDeleteById(record)">删除</a>
          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import gatewayApi from '@/api/gateway'

export default {
  name: 'RouteLog',
  data() {
    return {
      requestMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      activities: [],
      loading: {
        search: false,
        onload: false
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      queryParam: {},
      // 表头
      columns: [
        {
          title: '源路径',
          dataIndex: 'requestUri'
        },
        {
          title: '目标路径',
          dataIndex: 'targetUri'
        },
        {
          title: '请求方式',
          dataIndex: 'requestMethod',
          sorter: true
        },
        {
          title: '目标微服务',
          dataIndex: 'targetServer'
        },
        {
          title: '访问IP',
          dataIndex: 'ip'
        },
        {
          title: '访问者位置',
          dataIndex: 'location',
          sorter: true
        },
        {
          title: '访问时间',
          dataIndex: 'createTime',
          sorter: true
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
    this.handleListActivites()
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.handleListActivites()
    },
    handleSearch() {
      this.loading.search = true
      this.handleListActivites()
      setTimeout(() => {
        this.loading.search = false
      }, 500)
    },
    handleResetSearch() {
      this.queryParam = {}
      this.handleListActivites()
    },
    handleListActivites() {
      this.loading.onload = true
      const queryParam = Object.assign({}, this.queryParam)
      queryParam.current = this.pagination.current
      queryParam.pageSize = this.pagination.pageSize
      this.$log.debug(queryParam)
      // 获取数据总条数
      const countPromise = gatewayApi.countRouteLog(queryParam)
      // 获取数据
      const dataPromise = gatewayApi.listRouteLog(queryParam)
      Promise.all([countPromise, dataPromise])
        .then(values => {
          this.pagination.total = values[0]
          this.activities = values[1]
        })
        .finally(() => {
          setTimeout(() => {
            this.loading.onload = false
          }, 200)
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleDeleteInBatch() {
      const that = this
      this.$confirm({
        title: '警告',
        content: `确定要删除所选日志吗?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          gatewayApi.deleteRouteLogByIds(that.selectedRowKeys).then(res => {
            that.$message.success('删除成功')
            that.handleListActivites()
          })
        },
        onCancel() {}
      })
    },
    handleDeleteById(record) {
      const that = this
      this.$confirm({
        title: '警告',
        content: `确定要删除该条日志吗?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          gatewayApi.deleteRouteLogByIds([record.id]).then(res => {
            that.$message.success('删除成功')
            that.handleListActivites()
          })
        },
        onCancel() {}
      })
    },
    clearSelect(e) {
      e.preventDefault()
      this.onSelectChange([], [])
    }
  }
}
</script>
