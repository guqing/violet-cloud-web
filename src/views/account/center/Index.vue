<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="8">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar" title="点击可以修改头像">
              <a-upload name="file" :showUploadList="false" :beforeUpload="handleBeforeUpload">
                <div class="ant-upload-preview" type="upload">
                  <img :src="avatar()" />
                </div>
              </a-upload>
            </div>
            <div class="username">{{ nickname() }}</div>
            <div class="bio">{{ userInfo().description }}</div>
          </div>
          <div class="account-center-detail">
            <p>
              <a-icon type="crown" />
              <a-tag v-for="(item, index) in user.roleNames" :key="index">{{ item }}</a-tag>
            </p>
            <p v-if="user.email" title="邮箱地址"><a-icon type="mail" />{{ user.email }}</p>
            <p v-if="user.mobile" title="手机号"><a-icon type="phone" />{{ user.mobile }}</p>
            <p v-if="user.createTime" title="账号年龄"><a-icon type="calendar" />{{ user.createTime | dateToNow }}</p>
            <p v-if="user.lastLoginTime" title="上次登录时间">
              <a-icon type="safety" />{{ user.lastLoginTime | formatDate }}
            </p>
          </div>
          <a-divider />
          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <div>
              <template v-for="(tag, index) in tags">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                  <a-tag :key="tag" :closable="index !== 0" :close="() => handleTagClose(tag)">{{
                    `${tag.slice(0, 20)}...`
                  }}</a-tag>
                </a-tooltip>
                <a-tag v-else :key="tag" :closable="index !== 0" :close="() => handleTagClose(tag)">{{ tag }}</a-tag>
              </template>
              <a-input
                v-if="tagInputVisible"
                ref="tagInput"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                :value="tagInputValue"
                @change="handleInputChange"
                @blur="handleTagInputConfirm"
                @keyup.enter="handleTagInputConfirm"
              />
              <a-tag v-else @click="showTagInput" style="background: #fff; borderStyle: dashed;">
                <a-icon type="plus" />New Tag
              </a-tag>
            </div>
          </div>

          <a-divider :dashed="true" />
        </a-card>
      </a-col>
      <a-col :md="24" :lg="16">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <base-setting v-if="noTitleKey === 'base'"></base-setting>
          <password-page v-else-if="noTitleKey === 'password'"></password-page>
        </a-card>
      </a-col>
    </a-row>

    <avatar-modal ref="modal" @success="handleUploadAvatar"> </avatar-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { PageView, RouteView } from '@/layouts'
import BaseSetting from './page/BaseSetting'
import PasswordPage from './page/PasswordPage'
import AvatarModal from './page/AvatarModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    RouteView,
    PageView,
    AvatarModal,
    BaseSetting,
    PasswordPage
  },
  data () {
    return {
      tags: ['旧街凉风', '坐拥百态', '醉酒入梦', '晚风抚人', '无人及你'],
      tagInputVisible: false,
      tagInputValue: '',
      tabListNoTitle: [
        {
          key: 'base',
          tab: '基础设置'
        },
        {
          key: 'password',
          tab: '密码'
        }
      ],
      noTitleKey: 'base'
    }
  },
  filters: {
    dateToNow (date) {
      return moment(date).toNow(true)
    },
    formatDate (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    user () {
      return this.userInfo()
    }
  },
  methods: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),

    handleBeforeUpload (file) {
      console.log('before upload:', file)
      this.$refs.modal.edit(file)
      return false
    },
    handleUploadAvatar (avatarUrl) {
      this.user['avatar'] = avatarUrl
    },
    handleTabChange (key, type) {
      this[type] = key
    },
    handleTagClose (removeTag) {
      const tags = this.tags.filter(tag => tag !== removeTag)
      this.tags = tags
    },
    // tag
    showTagInput () {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },
    handleInputChange (e) {
      this.tagInputValue = e.target.value
    },
    handleTagInputConfirm () {
      const inputValue = this.tagInputValue
      let tags = this.tags
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue]
      }
      Object.assign(this, {
        tags,
        tagInputVisible: false,
        tagInputValue: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>