<template>
  <a-card :bordered="false">
    <a-row :gutter="8" type="flex" justify="center">
      <a-col :lg="8" :md="24" :order="isMobile ? 1 : 0">
        <a-form-model :model="roleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="角色名称">
            <a-input v-model="roleForm.roleName" />
          </a-form-model-item>
          <a-form-model-item label="角色描述">
            <a-textarea
              v-model="roleForm.remark"
              placeholder="角色描述最大长度不能超过150字符"
              :maxLength="150"
              allowClear
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
          <a-form-model-item label="角色权限">
            <a-tree
              v-model="checkedMenuKeys"
              checkable
              :expanded-keys="expandedMenuKeys"
              :auto-expand-parent="autoExpandParent"
              :selected-keys="selectedKeys"
              :tree-data="menuTreeData"
              @expand="onTreeMenuExpand"
              @select="onSelect"
              @check="onTreeMenuCheck"
            />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="roleFormButtonWrapperCol">
            <a-button type="primary" @click="handleSaveOrUpdateRole">保存</a-button>
            <a-button :style="{ marginLeft: '15px' }" @click="handleResetRoleForm">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
      <a-col :lg="16" :md="24">
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          showPagination="auto"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleRoleEdit(record)">编辑</a>
              <a-divider type="vertical" />
            </template>
            <a-dropdown>
              <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">禁用</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import menuApi from '@/api/menu'
import roleApi from '@/api/role'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'TreeList',
  mixins: [baseMixin],
  components: {
    STable
  },
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      roleForm: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          needTotal: true
        },
        {
          title: '角色描述',
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
        return roleApi.listRole(requestParameters).then(res => {
          return {
            pageSize: res.data.pageSize,
            pageNo: res.data.current,
            totalCount: res.data.total,
            totalPage: res.data.pages,
            data: res.data.list
          }
        })
      },
      expandedMenuKeys: [],
      autoExpandParent: false,
      checkedMenuKeys: [],
      selectedKeys: [],
      menuTreeData: [],
      treeParentIds: [],
      editExpandedMenuKeys: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.listTreeMenu()
  },
  computed: {
    roleFormButtonWrapperCol () {
      return {
        span: this.wrapperCol.span,
        offset: this.labelCol.span
      }
    }
  },
  methods: {
    handleRoleEdit (role) {
      var menuIdArray = role.menuIds
      var menuIdStringArray = menuIdArray.map(String)
      var childrenMenuKeys = this.getTreeChildrenIds(menuIdStringArray)
      this.checkedMenuKeys = childrenMenuKeys
      this.expandedMenuKeys = this.editExpandedMenuKeys

      // 回显示到表单
      Object.assign(this.roleForm, role)
    },
    listTreeMenu () {
      menuApi.listTreeMenu().then(res => {
        this.menuTreeData = res.data
      })
    },
    onTreeMenuExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedMenuKeys = expandedKeys
      this.autoExpandParent = false
    },
    onTreeMenuCheck (checkedMenuKeys) {
      console.log('onCheck', checkedMenuKeys)
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    handleClick (e) {
      console.log('handleClick', e)
      this.queryParam = {
        key: e.key
      }
      this.$refs.table.refresh(true)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSaveOrUpdateRole () {
      console.log(this.roleForm)
      console.log(this.checkedMenuKeys)
    },
    handleResetRoleForm () {
      this.roleForm = {}
      this.checkedMenuKeys = []
      this.expandedMenuKeys = []
    },
    getTreeChildrenIds (menuIdArray) {
      this.getTreeParentIds(this.menuTreeData)
      var that = this
      return menuIdArray.filter(function (item) {
        if (!that.treeParentIds.includes(item)) {
          return item
        } else {
          that.editExpandedMenuKeys.push(item)
        }
      })
    },
    getTreeParentIds (treeList) {
      for (var i in treeList) {
        var data = treeList[i]
        if (data.hasChildren) {
          this.treeParentIds.push(data.id)
          this.getTreeParentIds(data.children)
        }
      }
    }
  }
}
</script>

<style lang="less">
.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
