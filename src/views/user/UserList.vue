<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="15">
          <a-col :md="4" :sm="24">
            <a-form-item label="用户名">
              <a-input placeholder="用户名" v-model="queryParam.username" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="用户组">
              <a-input placeholder="用户组" v-model="queryParam.userGroup" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="用户状态">
              <a-select placeholder="请选择" default-value="0" v-model="queryParam.status">
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="创建时间">
              <a-range-picker style="width: 100%" @change="onDatePickerChange" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleSearchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="username"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :alert="{ show: true, clear: true }"
      :rowSelection="rowSelection"
    >
      <template
        v-for="(col, index) in columns"
        v-show="col.scopedSlots"
        :slot="col.dataIndex"
        slot-scope="text, record"
      >
        <div :key="index">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col, record)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>

      <template slot="roleNames" slot-scope="text">
        <a-tag :color="tagColor(index)" v-for="(roleName, index) in text" :key="index">
          {{ roleName }}
        </a-tag>
      </template>

      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="真的放弃编辑吗?" @confirm="() => cancel(record)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a class="edit" @click="() => edit(record)">修改</a>
            <a-divider type="vertical" />
            <a class="delete" @click="() => del(record)">删除</a>
          </span>
        </div>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import userApi from '@/api/user'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tagColors: ['pink', 'orange', 'green', 'blue', 'purple'],
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '性别',
          dataIndex: 'gender',
          customRender: function (text, value) {
            switch (text) {
              case '0':
                return <a-tag color="green">男性</a-tag>
              case '1':
                return <a-tag color="pink">女性</a-tag>
              default:
                return <a-tag>保密</a-tag>
            }
          }
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          sorter: true,
          needTotal: true,
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '角色',
          dataIndex: 'roleNames',
          needTotal: true,
          scopedSlots: { customRender: 'roleNames' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          customRender: function (text, value) {
            switch (text) {
              case 0:
                return '正常'
              case 1:
                return '禁用'
              default:
                return '禁用'
            }
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          table: '操作',
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, this.queryParam)
        var queryRequest = {
          current: parameter.pageNo,
          pageSize: parameter.pageSize
        }
        requestParameters.queryRequest = queryRequest
        requestParameters.queryRequest = queryRequest

        this.$log.debug('loadData request parameters:', queryRequest)
        return userApi.list(queryRequest).then(res => {
          return {
            pageSize: res.data.pageSize,
            pageNo: res.data.current,
            totalCount: res.data.total,
            totalPage: res.data.pages,
            data: res.data.list
          }
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    tagColor () {
      return function (index) {
        if (index > this.tagColors.length) {
          return this.tagColors[this.tagColors.length % index]
        }
        return this.tagColors[index]
      }
    }
  },
  methods: {
    handleChange (value, key, column, record) {
      record[column.dataIndex] = value
    },
    edit (row) {
      row.editable = true
      // row = Object.assign({}, row)
    },
    // eslint-disable-next-line
    del (row) {
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${row.no} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    save (row) {
      row.editable = false
    },
    cancel (row) {
      row.editable = false
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSearch () {
      console.log('搜索：', this.queryParam)
    },
    handleSearchReset () {
      this.queryParam = {}
    },
    onDatePickerChange (dates, dateStrings) {
      this.queryParam.createFrom = dateStrings[0]
      this.queryParam.createTo = dateStrings[1]
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
