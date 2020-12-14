<template>
  <div class="siteWrapper">
    <div class="tips" v-if="orgInfo.vipType === 1">
      <img src="./../img/warning.png" alt />
      <span>您目前为基础会员,最多能创建5个商城,目前还可建{{5-siteListNum}}个</span>
    </div>
    <ybtSteps stepText1="选择商城模板" stepText2="填写基本信息" stepText3="配置商城" styleName="1"></ybtSteps>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabsNav">
      <el-tab-pane label="标准商城模板" name="first">
        <p class="tabP">
          标准商城模板是指由驿宝通预设商品、提供首页样式，您可自行运营，包含商城的商品更新、改价、界面图片更新等；
          创建完成后，不可更改类型。
        </p>
        <div class="marketingAct">
          <ul>
            <li class="actItem" v-for="(item,index) in siteModelList" :key="index">
              <div class="actImg">
                <img :src="item.imgSrc" alt />
              </div>
              <div class="details">
                <h3>{{item.siteName}}</h3>
                <p class="detailstxt">{{item.mallInstruction}}</p>
                <h3>预设商品{{item.count}}款</h3>
                <p>价格区间：{{item.priceMin}}~{{item.priceMax}}，利润率范围：{{item.profitMin}}~{{item.profitMax}}</p>
                <p class="detailsfenl">
                  商品分类：
                  <span
                    v-for="(itemA,index) in item.countMaplist"
                    :key="index"
                  >{{itemA.name}}({{itemA.num}})、</span>
                </p>
                <div class="info-wrap">
                  <!-- <el-button type="primary" plain @click="showlookGoods(item)" class="actBtn">查看商品</el-button> -->
                  <el-button type="primary" plain @click="goToSite(item)" class="actBtn">选择模板</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义商城模板" name="second">
        <p class="tabP">
          自定义商城模板是指由驿宝通提供首页样式，不预设商品，您自行添加商品、运营，包含商城的商品更新、改价、界面图片更新等；
          创建完成后，不可更改类型。
        </p>
        <div class="marketingAct">
          <ul>
            <li class="actItem">
              <div class="actImg">
                <img
                  src="http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/77e45321c4e243a68dddeec460186a2f.png"
                />
              </div>
              <div class="details">
                <h3>自定义商城</h3>
                <p class="detailstxt">该模板内无商品，商品及专题完全自定义</p>
                <h3>预设商品--款</h3>
                <p>价格区间：--~--，利润率范围：--~--</p>
                <p class="detailsfenl">商品分类：--</p>
                <div class="info-wrap">
                  <el-button type="primary" plain @click="goTozdySite()" class="actBtn">选择模板</el-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
    <lookGoods ref="lookGoods" />
  </div>
</template>

<script>
import ybtSteps from '@/components/steps/ybtSteps'
import lookGoods from '@/components/setMall/lookGoods'

export default {
  name: 'site-wrapper',
  data () {
    return {
      activeName: 'first',
      siteModelList: [],
      isZdyList: false,
      orgInfo: {},
      siteListNum: localStorage.getItem('siteListNum'),
      type: this.$route.query.type
    }
  },
  created () {
    this.sbmitlist()
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
    handleClick (tab, event) {
      if (tab.index === 1) {

      }
    },
    lookModel () {
      window.open(require('./img/Apic.png'))
    },
    goTozdySite () {
      this.$router.push({ path: '/basicInfo', query: { type: this.type } })
    },
    showlookGoods (item) {
      this.$refs.lookGoods.inint(item)
    },
    goToSite (item) {
      this.$router.push({ path: '/basicInfo', query: { copyId: item.id, decimalDigits: item.decimalDigits, type: this.type } })
    },
    sbmitlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/queryYijiSiteList'),
        method: 'post',
        data: ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var newsiteList = []
          for (let index = 0; index < data.siteList.length; index++) {
            const item = data.siteList[index]
            if (item.id !== 1211) {
              newsiteList.push(item)
              var mallTemplateConfig = JSON.parse(item.mallTemplateConfig)
              if (mallTemplateConfig.modeList !== undefined) {
                item.imgSrc = mallTemplateConfig.modeList.banner.imgs === undefined ? JSON.parse(mallTemplateConfig.modeList.banner).imgs[0].src : mallTemplateConfig.modeList.banner.imgs[0].src
              }
              if (mallTemplateConfig.modelist !== undefined) {
                item.imgSrc = mallTemplateConfig.modelist.banner.imgs === undefined ? JSON.parse(mallTemplateConfig.modeList.banner).imgs[0].src : mallTemplateConfig.modelist.banner.imgs[0].src
              }
              // item.imgSrc = mallTemplateConfig === null ? '' : mallTemplateConfig.modeList.banner.imgs[0].src
              item.countMaplist = []
              for (let i in item.countMap) {
                item.countMaplist.push({
                  name: i,
                  num: item.countMap[i]
                })
              }
            }
          }

          this.siteModelList = newsiteList
        }
      })
    }
  },
  components: {
    ybtSteps,
    lookGoods
  }

}
</script>

<style lang="scss" scoped>
.tips {
  margin-bottom: 10px;
  padding: 6px;
  line-height: 20px;
  background-color: #fff2d9;
  border: 1px solid #ffa703;
  text-align: left;
  img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: top;
  }
}
.tabsNav {
  .tabP {
    margin: 20px;
    line-height: 20px;
    background-color: #f1f4f5;
    padding: 20px;
  }
  /deep/ .el-tabs__header {
    border: 0;
    width: 500px;
    margin: 0 auto;
    top: 0px;
  }
  /deep/ .el-tabs__nav {
    margin: 0 auto;
    width: 500px;
    border-radius: 50px !important;
    border-bottom: 1px solid #e4e7ed !important;
  }
  /deep/ .el-tabs__item {
    border: 0 !important;
    width: 50%;
    text-align: center;
    &.is-active {
      background: #1985ff;
      color: #ffffff;
    }
    &:first-child {
      border-radius: 50px 0 0 50px;
    }
    &:nth-child(2) {
      border-radius: 0 50px 50px 0;
    }
  }
}
.marketingAct {
  ul {
    padding: 10px;
    overflow: hidden;

    .actItem {
      width: 30%;
      height: 450px;
      padding: 16px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      border-radius: 4px;
      margin: 20px 20px 20px 10px;
      position: relative;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
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
        height: 190px;
        margin-right: 16px;
        overflow: hidden;
        margin-bottom: 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .details {
        // position: relative;
        h3 {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
        }
        p {
          color: #666;
          font-size: 14px;
          line-height: 18px;
          margin-bottom: 10px;
        }
        .detailstxt {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .detailsfenl {
          height: 54px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .info-wrap {
          position: absolute;
          bottom: 20px;
        }
        .actBtn {
          padding: 10px 5px;
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
