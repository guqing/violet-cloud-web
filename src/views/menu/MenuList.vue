<template>
  <a-card :bordered="false">
    <a-row :gutter="8" type="flex" justify="center">
      <a-col :lg="12" :md="24" :order="isMobile ? 1 : 0">
        <a-tree
          v-model="checkedMenuKeys"
          checkable
          blockNode
          :expanded-keys="expandedMenuKeys"
          :auto-expand-parent="autoExpandParent"
          :selected-keys="selectedKeys"
          :tree-data="menuTreeData"
          @expand="onTreeMenuExpand"
          @select="onSelect"
          @check="onTreeMenuCheck"
        />
      </a-col>
      <a-col :lg="12" :md="24">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="上级菜单">
            <a-tree-select
              v-model="menuForm.parentId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="menuTreeData"
              tree-default-expand-all
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item label="菜单标题">
            <a-input placeholder="例如：用户管理" v-model="menuForm.title" />
          </a-form-item>
          <a-form-item label="资源类型">
            <a-radio-group default-value="0" button-style="solid" v-model="menuForm.type">
              <a-radio-button value="0">
                菜单
              </a-radio-button>
              <a-radio-button value="1">
                按钮
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="访问路径">
            <a-input v-model="menuForm.path" placeholder="以 / 开头，例如：/user/list" />
          </a-form-item>
          <a-form-item label="组件名称">
            <a-input v-model="menuForm.name" placeholder="只能是英文，例如：UserList" />
          </a-form-item>
          <a-form-item label="组件路径">
            <a-input v-model="menuForm.component" placeholder="相对于views下的组件，例如:user/UserList" />
          </a-form-item>
          <a-form-item label="权限标识">
            <a-input v-model="menuForm.perms" placeholder="使用冒号分割层级，例如,user:list" />
          </a-form-item>
          <a-form-item label="图标">
            <a-input v-model="menuForm.icon" placeholder="选择一个图标可以展示在菜单标题左侧" />
          </a-form-item>
          <a-col :style="{ display: moreFormItem ? 'block' : 'none' }">
            <a-form-item label="重定向地址">
              <a-input v-model="menuForm.redirect" placeholder="如果填写，点击时会重定向到该地址" />
            </a-form-item>
            <a-form-item label="是否缓存组件">
              <a-switch v-model="menuForm.keepAlive" checked-children="是" un-checked-children="否" default-checked />
            </a-form-item>
            <a-form-item label="是否隐藏菜单栏">
              <a-switch v-model="menuForm.hidden" checked-children="显示" un-checked-children="隐藏" />
            </a-form-item>
            <a-form-item label="排序">
              <a-input v-model="menuForm.orderIndex" placeholder="菜单显示排序" />
            </a-form-item>
          </a-col>
          <a-form-item :wrapper-col="menuFormButtonWrapperCol">
            <a-button type="primary" @click="handleSaveOrUpdateMenu">
              保存
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleResetMenuForm">
              重置
            </a-button>
            <a :style="{ marginLeft: '8px' }" @click="moreFormItem = !moreFormItem">
              更多 <a-icon :type="moreFormItem ? 'up' : 'down'" />
            </a>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import menuApi from '@/api/menu'
import { baseMixin } from '@/store/app-mixin'

export default {
  name: 'TreeList',
  mixins: [baseMixin],
  data () {
    return {
      menuForm: {},
      moreFormItem: false,
      menuFormButtonWrapperCol: { span: 14, offset: 4 },
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      // 查询参数
      queryParam: {},
      expandedMenuKeys: [],
      autoExpandParent: false,
      checkedMenuKeys: [],
      selectedKeys: [],
      menuTreeData: []
    }
  },
  created () {
    this.listTreeMenu()
  },
  computed: {
  },
  methods: {
    handleRoleEdit (role) {
      var menuIdArray = role.menuIds
      var menuIdStringArray = menuIdArray.map(String)
      this.checkedMenuKeys = menuIdStringArray
      this.expandedMenuKeys = menuIdStringArray
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
    onSelect (selectedKeys, event) {
      this.handleToggleTreeMenu(selectedKeys, event)

      this.selectedKeys = selectedKeys
      var id = selectedKeys[0]
      if (id) {
        menuApi.getById(id).then(res => {
          this.menuForm = res.data
          if (res.data.parentId === 0) {
            this.menuForm.parentId = null
          }
        })
      }
    },
    handleToggleTreeMenu (selectedKeys, event) {
      // 控制树形菜单的展开与折叠
      if (event.node.dataRef.hasChildren) {
        this.expandedMenuKeys = selectedKeys
      }
    },
    handleSaveOrUpdateMenu () {
      console.log(this.menuForm)
    },
    handleResetMenuForm () {
      this.menuForm = {}
      this.checkedMenuKeys = []
      this.expandedMenuKeys = []
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
