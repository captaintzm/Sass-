<template>
  <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
    <!-- 主入口标签页 s -->
    <el-tabs
      v-if="$route.meta.isTab"
      v-model="mainTabsActiveName"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle"
      @click="tabsCloseOtherHandle()"
    >
      <el-dropdown class="site-tabs__tools" :show-timeout="0">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新当前标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane v-for="item in mainTabs" :key="item.name" :label="item.title" :name="item.name">
        <el-card :body-style="siteContentViewHeight">
          <!-- <iframe
            v-if="item.type === 'iframe'"
            :src="item.iframeUrl"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="yes"
          ></iframe> -->
          <keep-alive>
          <router-view v-if="item.name === mainTabsActiveName && $route.meta.keepAlive" />
          </keep-alive>
          <router-view v-if="item.name === mainTabsActiveName && !$route.meta.keepAlive" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card v-else :body-style="siteContentViewHeight">
      <div class="homeWarp" :style="siteContentViewHeight">
        <!-- <keep-alive> -->
        <router-view />
        <!-- </keep-alive> -->
      </div>
    </el-card>
  </main>
</template>

<script>
import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
    }
  },

  '$route' (to, from) {
    // 判断路由是否已经打开
    // 已经打开的 ，将其置为active
    // 未打开的，将其放入队列里
    let flag = false
    for (let item of this.mainTabs) {
      if (item.name === to.name) {
        this.$store.commit('set_active_index', to.path)
        flag = true
        this.tabsCloseOtherHandle()
        break
      }
    }
    if (!flag) {
      this.$store.commit('add_tabs', { route: to.path, name: to.name })
      this.$store.commit('set_active_index', to.path)
    }
  },

  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight }
    },
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    },
    siteContentViewHeight () {
      var height = this.documentClientHeight - 50 - 30 - 2
      if (this.$route.meta.isTab) {
        height -= 40
        return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    }
  },
  methods: {
    // tabs, 选中tab
    selectedTabHandle (tab) {
      console.log(this.mainTabs)
      tab = this.mainTabs.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        this.$router.push({ name: tab[0].name, query: tab[0].paramslist })
      }
    },
    // tabs, 删除tab
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({ name: this.mainTabs[this.mainTabs.length - 1].name }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.menuActiveName = ''
        var url = localStorage.getItem('menuListFirstUrl')
        url = url.replace('/', '')
        if (this.mainTabsActiveName === url) {
          location.reload()
        }
        if (location.host === 'sc.ebaoton.cn') {
          location.href = location.origin + '/admin/#/' + url
        } else if (location.host === 'saas-test.ycb51.cn') {
          location.href = location.origin + '/backend_page/#/' + url
        } else {
          location.href = location.origin + '/#/' + url
        }
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle () {
      this.removeTabHandle(this.mainTabsActiveName)
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.mainTabs = []
      this.menuActiveName = ''
      var url = localStorage.getItem('menuListFirstUrl')
      url = url.replace('/', '')
      if (this.mainTabsActiveName === url) {
        location.reload()
      }
      if (location.host === 'sc.ebaoton.cn') {
        location.href = location.origin + '/admin/#/' + url
      } else if (location.host === 'saas-test.ycb51.cn') {
        location.href = location.origin + '/backend_page/#/' + url
      } else {
        location.href = location.origin + '/#/' + url
      }
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle () {
      var tempTabName = this.mainTabsActiveName
      this.removeTabHandle(tempTabName)
      this.$nextTick(() => {
        this.$router.push({ name: tempTabName })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
/deep/ .el-card.is-always-shadow, s {
  // background :#F3F4FA;
}

.homeWarp {
  margin: -20px;
  background: #F5F8FC;
}
</style>
