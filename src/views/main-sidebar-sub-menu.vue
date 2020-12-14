<template>

  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'"
  >

    <template slot="title">
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.menuId"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes"
    ></sub-menu>
  </el-submenu>

  <el-menu-item
    v-else
    :index="menu.menuId + ''"
    @click="gotoRouteHandle(menu)"
    :class="{'singleItem':menu.name=='应用' || menu.name=='概况' || menu.name=='商品库'}"
  >
    <icon-svg
      :name="menu.icon || ''"
      class="site-sidebar__menu-icon"
      v-if="menu.name=='应用' || menu.name=='概况' || menu.name=='商品库' "
    ></icon-svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    }
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.singleItem {
    padding-left: 15px !important;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    margin: 0 !important;
}

.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.singleItem:focus,
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.singleItem:hover,
.site-sidebar--dark
  .site-sidebar__menu.el-menu
  .el-menu-item.singleItem:active {
  background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
  color: #fff !important;
  border-left: 0 !important;
  padding-left: 15px !important;
}

.site-sidebar--dark
  .site-sidebar__menu.el-menu
  .el-menu-item.singleItem.is-active {
  border-left: 0 !important;
  background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
  color: #fff !important;
  padding-left: 15px !important;
}

.site-sidebar--dark
  .site-sidebar__menu.el-menu
  .el-menu-item.singleItem.is-active,
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.singleItem:hover {
  background:linear-gradient(90deg,rgba(0,107,230,1) 0%,rgba(0,107,230,0.4) 100%);
}
.el-submenu__title i{
 color:#ffffff !important;
}

</style>
