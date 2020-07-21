<template>
  <div>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-form layout="inline">
          <a-row :gutter="15">
            <a-col :md="5" :sm="24">
              <a-form-item label="用户名">
                <a-input placeholder="角色名称" v-model="queryParam.username" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="loadingState.query">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleResetSearchForm" :loading="loadingState.reset">
                  重置
                </a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
        <div style="margin-top: 15px;">
          <a-button type="primary" @click="$refs.userModal.create()"><a-icon type="plus" />新增</a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="handleBatchDelete"><a-icon type="delete" />删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
          </a-dropdown>
        </div>
      </div>

      <a-alert type="info" show-icon>
        <p slot="message" style="padding:0;margin:0px;">
          <span style="margin-right: 12px">
            已选择: <a style="font-weight: 600">{{ selectedRows.length }}</a>
          </span>
          <a style="margin-left: 24px" @click="clearSelect">清空</a>
        </p>
      </a-alert>
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="users"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="$refs.userModal.edit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDeleteById(record)">删除</a>
          </template>
        </span>
      </a-table>
    </a-card>
    <login-modal v-if="!isAuthenticated"></login-modal>
    <user-modal ref="userModal"></user-modal>
  </div>
</template>
<script>
import UserModal from '../modules/UserModal'
import gatewayApi from '@/api/gateway'

export default {
  name: 'RouteUser',
  components: {
    UserModal
  },
  data () {
    return {
      users: [],
      userParam: {},
      pagination: {
        current: 0,
        pageSize: 10
      },
      queryParam: {},
      loadingState: {
        query: false,
        reset: false,
        delete: false
      },
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '角色',
          dataIndex: 'roles'
        },
        {
          title: '创建时间',
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
  computed: {
    isAuthenticated () {
      return !!this.$store.getters.gatewayToken
    }
  },
  created () {
    this.handleListUser()
  },
  methods: {
    handleListUser () {
      const param = Object.assign({}, this.queryParam)
      param.current = this.pagination.current
      param.pageSize = this.pagination.pageSize
      gatewayApi.listUser(param).then(res => {
        this.users = res
      })
      this.handleCountUser()
    },
    handleCountUser () {
      gatewayApi.countUser(this.queryParam).then(res => {
        this.pagination.total = res
      })
    },
    handleDeleteById (record) {
      this.$log.debug('删除:', record)
      this.deleteUser(record.id)
    },
    handleSearch () {
      this.loadingState.query = true
      this.handleListUser()
      setTimeout(() => {
        this.loadingState.query = false
      }, 1500)
    },
    handleResetSearchForm () {
      this.loadingState.reset = true
      this.handleListUser()
      this.queryParam = {}
      setTimeout(() => {
        this.loadingState.reset = false
      }, 1500)
    },
    handleBatchDelete () {
      this.deleteUser(this.selectedRowKeys)
    },
    handleDeleteUser (userIds) {
      const that = this
      this.$confirm({
        title: '警告',
        content: `确定要删除所选中的用户吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.loadingState.delete = true
          gatewayApi.deleteUser().then(res => {
            this.$message.success('删除成功')
          }).finally(() => {
            setTimeout(() => {
              this.loadingState.delete = false
            }, 1500)
          })
        },
        onCancel () {
          that.$log.info('Cancel')
        }
      })
      this.loadingState.delete = true
      gatewayApi.deleteUser().then(res => {
        this.$message.success('删除成功')
      }).finally(() => {
        setTimeout(() => {
          this.loadingState.delete = false
        }, 1500)
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    clearSelect (e) {
      e.preventDefault()
      this.onSelectChange([], [])
    }
  }
}
</script>
