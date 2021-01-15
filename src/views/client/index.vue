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
              <a-button type="primary" @click="handleSearch" :loading="loading.search">查询</a-button>
              <a-button style="margin-left: 8px;" @click="handleSearchReset">
                重置
              </a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary">
        新增
      </a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="clientId"
      :columns="columns"
      :data-source="clients"
      showPagination="auto"
    >
    </a-table>
  </a-card>
</template>
<script>
import oauthClientApi from '@/api/oauthClient'
export default {
  name: 'ClientManager',
  data() {
    return {
      loading: {
        search: false
      },
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
          dataIndex: 'authorizedGrantTypes'
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
            if (text === 'true') {
              return <a-tag color="green">是</a-tag>
            }
            return <a-tag color="orange">否</a-tag>
          }
        }
      ],
      clients: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      oauthClientApi.list(this.queryParam).then(res => {
        this.clients = res.data.list
      })
    },
    handleSearch() {
      this.loading.search = true
      this.loadData()
      setTimeout(() => {
        this.loading.search = false
      }, 500)
    },
    handleSearchReset() {
      this.queryParam = {}
    }
  }
}
</script>
