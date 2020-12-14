<template>
  <div class="yycsohpp">
    <applyHeader ref="applyheader" styleName="1" />
    <div class="sohpp-tip">
      <div>
        <p>1、满足各种企业个性化发放福利的需求,系统操作简单,交互体验好,可根据用户需求个性化配置商城</p>
        <p>2、约30万平台商品底价输出,也可使用自有商品,营销活动,卡券应用,扫码付,移动审批等满足各场景应用,满足礼业/银行客户需求</p>
      </div>
      <div style="position:relative">
        <el-tooltip placement="bottom" effect="light">
          <div slot="content">
            创建的各商城相互独立，点击【管理项目】按钮后跳转到对应商城管理后台；
            <br />鼠标移入二维码区域，扫码可直接跳转到对应商城移动端
          </div>
          <i class="tip_icon"></i>
        </el-tooltip>
        <el-button v-if="!iscreatedSite()" @click.stop="addSite" type="primary">创建商城</el-button>
        <el-popover placement="bottom-start" trigger="hover" popper-class="recharge-pop">
          <div class="pop-content">
            <p>积分商城</p>
            <el-button @click="$router.push({path: 'memberRecharge'})" size="mini">立即升级</el-button>
          </div>
          <el-button v-if="iscreatedSite()" type="info" slot="reference">创建商城</el-button>
        </el-popover>
      </div>
    </div>
    <div class="marketingAct">
      <ul>
        <li class="actItem" v-for="(item,index) in siteList" :key="index">
          <span class="icon-Offline" v-if="item.isUsable==0"></span>
          <div class="ewm" v-show="item.select==true">
            <div :id="'qrcode'+item.id" class="qrcodeitem"></div>
          </div>
          <div class="actImg">
            <img :src="item.imgSrc" alt />
          </div>
          <div class="details">
            <h3>{{item.siteName}}</h3>
            <p class="detailstxt">{{item.mallInstruction}}&nbsp;&nbsp;</p>
            <h3>预设商品{{item.count}}款</h3>
            <p
              class="mb0"
            >价格区间：{{item.priceMin}}~{{item.priceMax}} ，利润率范围：{{item.profitMin}}~{{item.profitMax}}</p>
            <p class="detailsfenl">
              商品分类：
              <span
                v-for="(itemA,index) in item.countMaplist"
                :key="index"
              >{{itemA.name}}({{itemA.num}}) 、</span>
            </p>
          </div>
          <div class="actBtnlist">
            <div
              style="display: inline;"
              @mouseover="showCodeover(item)"
              @mouseout="showCodeout(item)"
            >
              <el-button
                type="text"
                @click="down(item)"
                class="actBtn"
                v-show="item.select==true"
              >下载二维码</el-button>
              <img src="~@/assets/img/icon5.png" width="36" height="36" v-show="item.select==false" />
            </div>

            <el-button type="primary" @click="copyToSite(item)" class="actBtn">复制商城</el-button>
            <el-button type="primary" @click="goToSite(item)" class="actBtn">管理项目</el-button>
          </div>
          <div
            class="loading"
            v-if="item.selectStatus==true"
            v-loading="loading"
            element-loading-text="预计耗时1分钟，请耐心等待哦~"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import applyHeader from '../../components/common/applyHeader'
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      loading: false,
      siteList: [],
      // siteListNum: localStorage.getItem('siteListNum'),
      lbNum: localStorage.getItem('lbNum'),
      stageMallListNum: localStorage.getItem('stageMallListNum'),
      queryApiSites: [],
      orgInfo: {}
    }
  },
  mounted () {
    this.siteId = ''
    this.timeNum = 0
    this.timer = null
    this.sbmitlist()
    this.packlist()
    window.clearInterval(this.timer)
  },
  created () {
    this.getOrgVipDetail()
  },
  methods: {
    getOrgVipDetail () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/orgVipDetail'),
        method: 'post',
        params: this.$http.adornParams({
          orgId: localStorage.getItem('orgId')
        })
      }).then(({ data }) => {
        console.log(data)
        if (data.code === 0) {
          this.orgInfo = data.result
        }
      })
    },
    showCodeover (item) {
      this.$nextTick(function () {
        this.qrcode(item)
      })
    },
    showCodeout (item) {
      item.select = false
      item.isDown = false
    },
    down (item) {
      item.isDown = true
      this.$nextTick(function () {
        this.qrcode(item)
      })
    },
    //  生成二维码
    qrcode (item) {
      var _this = this
      var canvas = document.getElementById('qrcode' + item.id)
      canvas.innerHTML = ''
      var link = location.origin + '/front_page/home?siteId=' + item.id
      var qrcode = new QRCode(canvas, {
        width: 150,
        height: 150,        // 高度
        text: link   // 二维码内容
      })
      item.select = true
      if (item.isDown === true) {
        clearTimeout(_this.timer)
        _this.timer = setTimeout(() => {
          _this.download(item)
        }, 500)
        console.log(qrcode._elCanvas)
      }
    },
    // 下载渠道二维码图片
    download (item) {
      // var oQrcode = document.querySelectorAll('.channelQrcode img')
      var oQrcode = document.querySelectorAll('#qrcode' + item.id + ' img')
      var url = oQrcode[0].src
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      // 下载图名字
      a.download = item.siteName + '的二维码.jpg'
      a.href = url
      // 合成函数，执行下载
      a.dispatchEvent(event)
      oQrcode = ''
    },
    sbmitlist () {
      this.timeNum = 0
      let stageMallList = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/querySiteList'),
        method: 'post',
        data: ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          for (let index = 0; index < data.siteList.length; index++) {
            const item = data.siteList[index]
            var mallTemplateConfig = JSON.parse(item.mallTemplateConfig)
            item.imgSrc = ''
            if (mallTemplateConfig.modeList !== undefined) {
              item.imgSrc = mallTemplateConfig.modeList.banner.imgs === undefined ? JSON.parse(mallTemplateConfig.modeList.banner).imgs[0].src : mallTemplateConfig.modeList.banner.imgs[0].src
            }
            if (mallTemplateConfig.modelist !== undefined) {
              item.imgSrc = mallTemplateConfig.modelist.banner.imgs === undefined ? JSON.parse(mallTemplateConfig.modelist.banner).imgs[0].src : mallTemplateConfig.modelist.banner.imgs[0].src
            }
            item.selectStatus = false
            item.select = false
            item.isDown = false
            if (item.copyStatus === '1') {
              item.selectStatus = true
              this.timeNum++
            }
            item.countMaplist = []
            for (let i in item.countMap) {
              item.countMaplist.push({
                name: i,
                num: item.countMap[i]
              })
            }
          }
          // this.siteListNum = data.siteList.length
          this.siteList = data.siteList
          // localStorage.setItem('siteListNum', this.siteList.length)
          // this.stageMallListNum = data.stageMallList.length
          // localStorage.setItem('stageMallListNum', data.stageMallList.length)
          if (this.timeNum > 0) {
            this.loading = true
            this.getsetInterval()
          } else {
            this.loading = false
            window.clearInterval(this.timer)
          }
        } else {
          window.clearInterval(this.timer)
        }
      })
    },
    packlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/list'),
        method: 'post',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 100
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.totalPage = data.page.totalCount
          localStorage.setItem('lbNum', data.page.totalCount)
          this.lbNum = localStorage.getItem('lbNum')
        } else {
        }
      })
    },
    getsetInterval () {
      var interval = 5000
      var _this = this
      window.clearInterval(this.timer)
      _this.timer = window.setInterval(function () {
        _this.sbmitlist()
      }, interval)
    },
    // 校验商城是否可以复制  /ybt-backend/mall/mallsite/checkMall
    copyToSite (item) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/checkMall'),
        method: 'post',
        data: this.$http.adornData({
          siteId: item.id
        }, true)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$router.push({ path: '/basicInfo?siteId=' + item.id + '&decimalDigits=' + item.decimalDigits })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    goToSite (item) {
      localStorage.setItem('pageSiteId', item.id)
      localStorage.setItem('siteName', item.siteName)
      localStorage.setItem('siteType', 1)
      window.open(location.origin + '/frontend-vis/#/index', '_blank')
    },
    iscreatedSite () {
      if (this.orgInfo === null || (this.orgInfo.overdueFlag === '1' && this.orgInfo.vipType === 1 && this.siteList.length < 6) || this.orgInfo.overdueFlag === '1' && this.orgInfo.vipType > 1) {
        return false
      }
      return true
    },
    addSite () {
      var userInfo = JSON.parse(localStorage.getItem('userInfo'))
      var orgType = userInfo.sysOrganization.type
      if (orgType === 2) {
        this.$router.push({ path: '/basicInfo' })
      } else {
        this.$router.push({ path: '/choiceModel' })
      }
    }
  },
  components: {
    applyHeader,
    QRCode
  }
}
</script>

<style lang="scss">
.yycsohpp {
  .marketingAct {
    ul {
      padding: 10px;
      overflow: hidden;
      .actItem {
        width: 345px;
        height: 348px;
        padding: 16px;
        box-shadow: 0 0 5px rgba(25, 133, 255, 0.3);
        box-sizing: border-box;
        border-radius: 8px;
        margin: 20px 24px;
        position: relative;
        display: inline-block;
        overflow: hidden;
        vertical-align: top;
        .icon-Offline {
          position: absolute;
          right: 16px;
          top: 16px;
          width: 55px;
          height: 55px;
          background: url('./img/offline.jpg') no-repeat;
          background-size: 100% 100%;
          display: inline-block;
        }
        .ewm {
          width: 100%;
          height: 206px;
          position: absolute;
          z-index: 99;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          bottom: 50px;
          border-radius: 5px;
          padding-top: 30px;
          top: 0;
          left: 0;
          img {
            display: inline-block !important;
          }
        }
        .loading {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 99;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          bottom: 50px;
          border-radius: 5px;
          padding-top: 81px;
          top: 0;
          left: 0;

          /deep/ .el-progress__text {
            color: #ffffff;
          }
        }
        .actImg {
          width: 100%;
          height: 140px;
          margin-right: 16px;
          overflow: hidden;
          margin-bottom: 15px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .details {
          position: relative;
          h3 {
            font-weight: 400;
            font-size: 14px;
            margin-bottom: 8px;
            line-height: 1;
            color: #333333;
          }
          p {
            color: #666;
            font-size: 12px;
            line-height: 18px;
            margin-bottom: 10px;
            font-weight: 400;
          }
          .detailsfenl {
            height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .actBtnlist {
          position: absolute;
          right: 10px;
          bottom: 10px;
          .actBtn {
            padding: 10px 5px;
            margin-top: 10px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.sohpp-tip {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 24px;
  color: #333;
  background-color: #f5f8fc;
  border-radius: 6px;
  p {
    line-height: 30px;
  }
}
.detailstxt {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recharge-pop {
  background-color: #489afa;
  .pop-content {
    display: flex;
    justify-content: space-between;
  }
  p {
    margin-right: 10px;
    color: #fff;
    line-height: 30px;
  }
  .popper__arrow::after {
    border-bottom-color: #489afa !important;
  }
}
.mb0 {
  margin-bottom: 0 !important;
}
</style>
