<template>
  <div>
    <a-card :bordered="false" v-if="isAuthenticated">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
        :alert="false"
        :rowSelection="{ selectedKeys: selectedKeys, onChange: onSelectChange }"
      >
        <span slot="action">
          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
    </a-card>
    <login-modal></login-modal>
  </div>
</template>
<script>
import { GATEWAY_ACCESS_TOKEN } from '@/store/mutation-types'
import LoginModal from './modules/LoginModal'
import { STable } from '@/components'
import gatewayApi from '@/api/gateway'
import storage from 'store'


export default {
  name: 'RouteUser',
  components: {
    LoginModal,
    STable
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'roleName'
        },
        {
          title: '权限',
          dataIndex: 'remark'
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, this.queryParam)
        requestParameters.current = parameter.pageNo
        requestParameters.pageSize = parameter.pageSize
        return gatewayApi.listUser(requestParameters).then(res => {
          console.log(res)
          return {
            pageSize: res.data.pageSize,
            pageNo: res.data.current,
            totalCount: res.data.total,
            totalPage: res.data.pages,
            data: res.data.list
          }
        }).catch(err => {
          this.$message.error(`查询出错:${err}`)
          return {
            pageSize: 0,
            pageNo: 1,
            totalCount: 0,
            totalPage: 0,
            data: []
          }
        })
      },
      selectedKeys: [],
      selectedRows: []
    }
  },
  computed: {
    isAuthenticated () {
      return !!storage.get(GATEWAY_ACCESS_TOKEN)
    }
  },
  methods: {
    onSelectChange (selectedRoleKeys, selectedRoles) {
      this.selectedRoleKeys = selectedRoleKeys
      this.selectedRoles = selectedRoles
    }
  }
}
</script>
