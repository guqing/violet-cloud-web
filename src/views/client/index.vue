<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="15">
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input placeholder="客户端ID" v-model="queryParam.clientId" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
              <a-button style="margin-left: 8px;" @click="handleSearchReset">
                重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" @click="$refs.clientModal.add()" v-action:add>
        新增
      </a-button>
    </div>
    <s-table ref="table" size="default" rowKey="clientId" :columns="columns" :data="loadData">
      <template slot="action" slot-scope="text, record">
        <a-button type="link" @click="$refs.clientModal.edit(record)">编辑</a-button>
      </template>
    </s-table>
    <ClientModal ref="clientModal" @ok="handleModalOk" />
  </a-card>
</template>
<script>
import { STable } from '@/components'
import oauthClientApi from '@/api/oauthClient'
import ClientModal from './modules/ClientModal'

export default {
  name: 'ClientManager',
  components: {
    ClientModal,
    STable
  },
  data() {
    return {
      searchLoading: false,
      queryParam: {},
      columns: [
        {
          title: '客户端ID',
          dataIndex: 'clientId'
        },
        {
          title: 'Scope',
          dataIndex: 'scope'
        },
        {
          title: '认证模式',
          dataIndex: 'authorizedGrantTypes',
          customRender: text => {
            return text.join(', ')
          }
        },
        {
          title: '重定向URI',
          dataIndex: 'webServerRedirectUri'
        },
        {
          title: 'token有效期',
          dataIndex: 'accessTokenValidity',
          customRender: text => text + '秒'
        },
        {
          title: 'refresh token有效期',
          dataIndex: 'refreshTokenValidity',
          customRender: text => text + '秒'
        },
        {
          title: '自动授权',
          dataIndex: 'autoapprove',
          customRender: text => {
            if (text) {
              return <a-tag color="green">是</a-tag>
            }
            return <a-tag color="orange">否</a-tag>
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      clients: [],
      loadData: parameter => {
        const queryRequest = {}
        queryRequest.current = parameter.pageNo
        queryRequest.pageSize = parameter.pageSize
        Object.assign(queryRequest, this.queryParam)
        return oauthClientApi
          .list(queryRequest)
          .then(res => {
            return {
              pageSize: res.data.pageSize,
              pageNo: res.data.current,
              totalCount: res.data.total,
              totalPage: res.data.pages,
              data: res.data.list
            }
          })
          .catch(err => {
            this.$message.error(`加载失败:${err.message}`)
            return {
              pageSize: 0,
              pageNo: 1,
              totalCount: 0,
              totalPage: 0,
              data: []
            }
          })
      }
    }
  },
  methods: {
    handleSearch() {
      this.searchLoading = true
      this.$refs.table.refresh()
      setTimeout(() => {
        this.searchLoading = false
      }, 500)
    },
    handleSearchReset() {
      this.queryParam = {}
    },
    handleModalOk() {
      this.$table.refresh()
    }
  }
}
</script>
