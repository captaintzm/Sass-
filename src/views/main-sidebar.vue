<template>
  <div class>
    <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
      <div class="site-sidebar__inner">
         <div class="sitelogo"></div>
        <el-menu
          :default-active="menuActiveName || 'home'"
          :collapse="sidebarFold"
          :collapseTransition="false"
          class="site-sidebar__menu"
        >
          <sub-menu
            v-for="menu in menuList"
            :key="menu.menuId"
            :menu="menu"
            v-show="menu.menuType==1"
            :dynamicMenuRoutes="dynamicMenuRoutes"
          ></sub-menu>
        </el-menu>
      </div>
    </aside>
  </div>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
      dynamicMenuRoutes: [],
      status: 0,
      id: 0
    }
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    menuList: {
      get () { return this.$store.state.common.menuList },
      set (val) { this.$store.commit('common/updateMenuList', val) }
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
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.routeHandle(this.$route)
  },
  methods: {
    // getindexs () {
    //   var mlisturl = JSON.parse(localStorage.getItem('menulistsurl'))
    //   var currenturl = location.hash.replace('#', '')
    //   let index = mlisturl.findIndex(item => item === currenturl)
    //   console.log(index)
    //   if (index < 0) {
    //     var gotourl = localStorage.getItem('menuListFirstUrl')
    //     this.$router.push({ path: gotourl })
    //   }
    // },
    conslo () {

    },
    routers (names) {
      this.$router.push({ path: names })
    },
    // 路由操作
    routeHandle (route) {
      if (route.meta.isTab) {
        var tab = this.mainTabs.filter(item => item.name === route.name)[0]
         // tab选中, 不存在先添加
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
            if (!route) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            paramslist: Object.keys(this.$route.query).length > 0 ? this.$route.query : '',
            // query: this.$route.query.orderNo || '',
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || ''
          }
          this.mainTabs = this.mainTabs.concat(tab)
        } else {
          // 选中就覆盖
          for (let index = 0; index < this.mainTabs.length; index++) {
            const element = this.mainTabs[index]
            if (element.name === route.name) {
              element.paramslist = Object.keys(this.$route.query).length > 0 ? this.$route.query : ''
            }
          }
        }
        console.log(this.mainTabs)
        this.menuActiveName = tab.menuId + ''
        this.mainTabsActiveName = tab.name
      }
      // this.getindexs()
    }
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
.site-sidebar-index {
  height: 56px;
  line-height: 56px;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  list-style: none;
  display: inline-block;
  text-align: left;
  margin: 5px;
  padding-left: 20px;
  width: 200px;
  cursor: pointer;
  color: #8a979e;

  i {
    margin-right: 8px;
  }

  &:hover {
    background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
    color: #fff;
    text-decoration: none;
  }

  &.active {
    background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
    color: #fff;
    text-decoration: none;
  }
}

.marstr {
  position: absolute;
  right: 0;
  top: 0;
  background: #FBFCFF;

  /deep/ .el-menu-item {
    height: 36px;
    line-height: 36px;
    background: #FBFCFF;
  }

  /deep/ .el-menu-item.is-active {
    color: #ffffff;
  }

  /deep/ .el-menu-item:hover {
    color: #4486f4;
  }

  /deep/ .el-menu-item.is-active:hover {
    color: #ffffff;
  }
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu {
  background-color: #ffffff;
}

.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item {
  color: #ffffff;
}

.sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title {
  color: #ffffff;
}

.iconso {
  width: 16px;
  height: 16px;
  fill: currentColor;
  margin-right: 5px;
  text-align: center;
  font-size: 16px;
  color: inherit !important;
  vertical-align: top;
}

.site-sidebar__inner {
  // background: #FFFFFF;
  // width: 217px;
}

/deep/ .site-sidebar__menu.el-menu .el-menu-item.is-active {
  color: #256EFD;
}

/deep/ .site-sidebar__menu.el-menu {
  background:none !important;
  width:100%;
  // height:100%;
}
/deep/ .site-sidebar__menu.el-menu  .site-sidebar__menu-icon{
    width:16px !important;
}
/deep/ .el-submenu__title .el-icon-arrow-down:before{
 display:none;
}

/deep/ .site-sidebar__menu.el-menu .el-menu {
  background: #FFFFFF;

  /deep/ .el-submenu__title {
    color: #ffffff !important;
    i{
      display:none
    }
  }
}

/deep/ .el-submenu.is-opened {
  background: #FFFFFF !important;

  /deep/ .el-submenu__title {
    // background: #FFFFFF !important;
  }
}

/deep/ .el-menu-item.is-active {
  background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
}

/deep/ .el-menu-item {
  margin: 5px;
}

/deep/ .el-submenu__title {
  margin: 0;
}
/deep/ .el-submenu:hover {
  // background-color: #F5F8FF !important;
}

/deep/ .el-submenu__title:hover {
  background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
}

/deep/ .el-submenu__title {
  // background-color: #F5F8FF !important;
  color: #256EFD !important;
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active {
 background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%) !important;
  // padding-left: 60px !important;
  color: #ffffff !important;
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item:hover {
 background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%) !important;
  // padding-left: 60px !important;
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu.is-active > .el-submenu__title {
  color: #ffffff;
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title:hover,
 /deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title:active {
  background:#006BE6;
  color: #ffffff;
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title {
  margin: 0;
  // font-weight: bold;
  color: #ffffff;
  font-size: 16px;
  height: 48px;
  line-height: 48px;
  padding: 0 20px 0 15px !important;
}

/deep/ .site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu > .el-submenu__title i{
    color: #fff;
    right: 15px;
    margin-top: -3px;
}
/deep/ .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 40px !important;
    color: #fff !important;
    min-width: 82px;
}
/deep/ .el-submenu .el-menu-item:hover,/deep/ .el-submenu .el-menu-item:active{
   background:#006BE6 !important;
}
 .sitelogo{
      background: url(img/logo.png) no-repeat center top;
      background-size: 100%;
      width: 40px;
      height: 40px;
      margin:0 auto;
      margin-top: 14px;
      margin-bottom: 10px;
    }

</style>
