<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" style="text-align: left;">
        <!-- <a class="site-navbar__brand-lg" href="javascript:;" @click="backHome">
          <img src="./img/saaslogin.png" alt />
        </a> -->
          <div class="nav-logo" v-if="orgType== 4 && roleType==2">
          <span>{{orgVip.orgName}}</span>
          <img class="svip-img" src="./img/member1.png" alt="" v-if="orgVip.vipType==1">
          <img class="svip-img" src="./img/member2.png" alt="" v-if="orgVip.vipType==2">
          <img class="svip-img" src="./img/member3.png" alt="" v-if="orgVip.vipType==3">
          <div v-if="orgVip.overdueFlag === '0'" class="tip">
            <img src="./img/warning.png" alt="">
            会员已到期,后台将无法新建商城;移动端将无法下单,请您及时续费
          </div>
        </div>
        <el-popover
          placement="top-start"
          width="376"
          trigger="hover"
          v-else>
          <div class="pop-content">
            <div class="con-name">
              <p>{{orgVip.orgName}}</p>
              <p class="con-info" @click="$refs.orgInfo.infoShow = true">查看机构信息 ></p>
            </div>
            <p>会员级别: {{getVipType(orgVip.vipType)}}<span v-if="orgVip.overdueFlag === '0'">(已过期)</span></p>
            <p>会员截止日期: {{vipEndDate}}</p>
            <div class="con-btn">
              <el-button type="primary" @click="$router.push({name: 'Recharge'})">{{memberBtnText()}}</el-button>
              <el-button @click="$router.push({name: 'Recharge'})">了解权益</el-button>
            </div>
            <p style="color: #666; font-size: 12px">会员服务热线: 400 9699 027</p>
          </div>
          <div class="nav-logo" slot="reference">
            <span>{{orgVip.orgName}}</span>
            <img class="svip-img" src="./img/member1.png" alt="" v-if="orgVip.vipType==1">
            <img class="svip-img" src="./img/member2.png" alt="" v-if="orgVip.vipType==2">
            <img class="svip-img" src="./img/member3.png" alt="" v-if="orgVip.vipType==3">
            <div v-if="orgVip.overdueFlag === '0'" class="tip">
              <img src="./img/warning.png" alt="">
              会员已到期,后台将无法新建商城;移动端将无法下单,请您及时续费
            </div>
          </div>
        </el-popover>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <!-- <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>-->
      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <el-menu-item class="site-navbar__avatar" index="2">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link" style="display: block;">
              帮助中心
              <i class="el-icon-caret-bottom" style="color:#1985FF; vertical-align: baseline;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push('/video-teaching')">视频教学</el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/productDynamics')">产品动态</el-dropdown-item>
              <el-dropdown-item @click.native="checkManual">操作手册</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link" style="display: block;">
              <img src="~@/assets/img/avatar.png" :alt="userName" />
              {{ userName+",您好!" }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <org-info :orgInfo="orgVip" ref="orgInfo" @handlePassword="updatePasswordHandle()"></org-info>
  </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import orgInfo from './Member/orgInfo'
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      updatePassowrdVisible: false,
      orgType: '',
      roleType: '',
      orgVip: {},
      vipEndDate: ''
    }
  },
  created () {
    this.orgType = localStorage.getItem('orgType') || ''
    this.roleType = localStorage.getItem('roleType') || ''
    this.getOrgVipDetail()
    console.log(this.orgVip)
  },
  components: {
    UpdatePassword,
    orgInfo
  },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    getOrgVipDetail () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/orgVipDetail'),
        method: 'post',
        params: this.$http.adornParams({
          orgId: localStorage.getItem('orgId')
        })
      }).then(({data}) => {
        console.log(data)
        if (data.code === 0) {
          localStorage.setItem('orgVipDetail', JSON.stringify(data.result))
          this.orgVip = data.result
          this.vipEndDate = data.result.validEndDate ? data.result.validEndDate.split(' ')[0] : '--'
        }
      })
    },
    memberBtnText () {
      if (this.orgVip.vipType === 3 && this.orgVip.overdueFlag === '1') {
        return '立即续费'
      } if (this.orgVip.overdueFlag === '1') {
        return '立即升级'
      }
      return '立即购买'
    },
    getVipType (val) {
      let text = ''
      switch (val) {
        case 1 :
          text = '基础会员'
          break
        case 2 :
          text = 'VIP会员'
          break
        case 3 :
          text = 'PLUS会员'
          break
      }
      return text
    },
    checkManual () {
      window.open('http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20191104/9cfd70d0c3504ae191836f8e1d3e6743.pdf', '_blank')
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/sys/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (localStorage.getItem('isFromYunCai') ==='true') {
              this.$router.push({ name: 'loginYc' })
            } else { 
              this.$router.push({ name: 'login' })
            }
            clearLoginInfo()
            
          }
        })
      }).catch(() => { })
    },
    backHome () {
      // this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.site-navbar {
  .site-navbar__body {
    /deep/ .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
      background-color: #ffffff;
    }
  }
}
.pop-content {
  color: #333;
  font-size: 14px;
  .con-name {
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 16px;
    line-height: 26px;
    .con-info {
      color: #1985FF;
      font-size: 12px;
      font-weight: 400;
      cursor: pointer;
    }
  }
  .con-btn {
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 10px;
  }
}
.nav-logo {
  padding: 0 20px 0 40px;
  display: flex;
  align-items: center;
  display: inline-block;
  span{
    color:rgba(51,51,51,1);
    font-size: 20px;
  }
  .svip-img {
    margin: 0 10px;
    // width: 108px;
    // height: 26px;
  }
  .tip {
    padding: 6px;
    line-height: 20px;
    font-size: 12px;
    color: #333;
    background-color: #FFF2D9;
    border: 1px solid #FFA703;
    display: inline-block;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
      vertical-align: top;
    }
  }
}
</style>
