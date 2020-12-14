<template>
  <div class="applyHeader">
 <div class="achome">
      <div class="item" :class="{'navActive':item.type==styleName}"  v-for="(item,index) in applylist" :key="index" @click="goto(item)" >
        <div class="achomeIcon achomeIcon1"  v-if="item.type==1"><span></span></div>
        <div class="achomeIcon achomeIcon2" v-if="item.type==4"> <span></span></div>
        <div class="achomeIcon achomeIcon3" v-if="item.type==2"><span></span></div>
        <div class="achomeIcon achomeIcon4" v-if="item.type==3"> <span></span></div>
        <div class="achomeIcon achomeIcon5" v-if="item.type==5"> <span></span></div>
        <p class="p1">
          {{item.siteName}}
          <!-- <i class="tip_icon" v-if="item.type==1">
            <span class="tip">{{item.content}}</span>
          </i> -->
        </p>
        <p class="p2">{{item.siteListNum}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'applyHeader',
  data () {
    return {
      applylist: [
        {
          type: 1,
          siteName: '积分商城',
          content: '',
          siteListNum: 0,
          summary: '个性化配置商城，满足各…'
        },
        {
          type: 5,
          siteName: '分期商城',
          content: '',
          siteListNum: 0
        },
        {
          type: 2,
          siteName: '营销工具',
          content: '',
          siteListNum: 3,
          summary: '满足各种营销场景，配合商…'
        },
        {
          type: 3,
          siteName: '解决方案',
          content: '',
          siteListNum: 6,
          summary: '进入行业一站式服务解决…'
        },
        {
          type: 4,
          siteName: '供应链服务',
          content: '',
          siteListNum: 0,
          summary: '进入行业一站式服务解决…'
        }

      ]
    }
  },
  created () {
    this.sbmitlist()
    this.queryApiSiteList()
  },
  props: {
    styleName: {
      type: [String],
      default: ''
    }
  },
  methods: {
    goto (item) {
      if (item.type === 1) {
        this.$router.push({ name: 'yycenter-sohpp' })
      }
      if (item.type === 2) {
        this.$router.push({ name: 'yycenter-market' })
      }
      if (item.type === 3) {
        this.$router.push({ name: 'yycenter-credit' })
      }
      if (item.type === 4) {
        this.$router.push({ name: 'yycenter-supplyChain' })
      }
      if (item.type === 5) {
        this.$router.push({ name: 'yycenter-installment' })
      }
    },
    // 商城列表
    sbmitlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/querySiteList'),
        method: 'post',
        data: ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          localStorage.setItem('siteListNum', data.siteList.length)
          for (let index = 0; index < this.applylist.length; index++) {
            const element = this.applylist[index]
            if (element.type === 1) {
              element.siteListNum = data.siteList.length
            }
            if (element.type === 5) {
              element.siteListNum = data.resultStageList.length || 0
            }
          }
        }
      })
    },
    queryApiSiteList () {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/mall/mallsite/queryApiSiteList'),
          method: 'post',
          data: ''
        }).then(({ data }) => {
          if (data && data.code === 0) {
            localStorage.setItem('queryApiSites', data.siteList.length)
            for (let index = 0; index < this.applylist.length; index++) {
              const element = this.applylist[index]
              if (element.type === 4) {
                element.siteListNum = data.siteList.length
              }
            }
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.applyHeader{
  .achome {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .item {
      height: 124px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 20px rgba(20, 106,204, 0.16);
      opacity: 1;
      border-radius: 8px;
      // width: 22%;
      width: 248px;
      cursor: pointer;
      position: relative;
      margin-left: 20px;
      .achomeIcon {
        width: 72px;
        height: 72px;
        text-align: center;
        position: absolute;
        right: 32px;
        top: 26px;
        &.achomeIcon1 {
          span {
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(~@/assets/img/s01.png) no-repeat center center;
            background-size: 100%;
          }
        }
        &.achomeIcon2 {
          span {
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(~@/assets/img/s05.png) no-repeat center center;
             background-size: 100%;
          }
        }
        &.achomeIcon3 {
          span {
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(~@/assets/img/s02.png) no-repeat center center;
            background-size: 100%;
          }
        }
        &.achomeIcon4 {
          span {
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(~@/assets/img/s03.png) no-repeat center center;
             background-size: 100%;
          }
        }
         &.achomeIcon5 {
          span {
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(~@/assets/img/s04.png) no-repeat center center;
            background-size: 100%;
          }
        }
        &.achomeIcon6 {
          span {
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(~@/assets/img/icon6.png) no-repeat center center;
            background-size: 100%;
            margin-top: 37px;
          }
        }
      }
      p {
        padding-left: 32px;
        &.p1 {
          height: 22px;
          font-size: 18px;
          line-height: 22px;
          color: #666666;
          text-align: left;
          padding-right: 37px;
          margin-top: 15px;
        }
        &.p2 {
          height: 80px;
          font-size: 58px;
          font-weight: 400;
          line-height: 80px;
          color: #333333;
          text-align: left;
          padding-right: 37px;
          margin-bottom: 8px;
        }
        &.p3 {
          display: block;
          line-height: 34px;
          padding-right: 18px;
          border-top: 1px solid rgba(242, 242, 242, 1);
          padding-top: 13px;
          color: rgba(153, 153, 153, 1);
          padding-left: 18px;
          position: relative;
          span {
            width: 71px;
            height: 34px;
            background: rgba(232, 247, 246, 1);
            border-radius: 4px;
            display: inline-block;
            color: #1985FF;
            font-size: 16px;
            text-align: center;
            line-height: 34px;
            position: absolute;
            right: 18px;
            top: 13px;
          }
        }
      }
      &.navActive {
        background: url(~@/assets/img/sbg.png) no-repeat center center;
        background-size: 100% 100%;

        p{
          color:#ffffff;
        }
         .achomeIcon1 {
          span {
            background: url(~@/assets/img/s01_hover.png) no-repeat center center;
            background-size: 100% 100%;
          }
        }
         .achomeIcon2 {
          span {
            background: url(~@/assets/img/s05_hover.png) no-repeat center center;
            background-size: 100% 100%;
          }
        }
        .achomeIcon3 {
          span {
            background: url(~@/assets/img/s02_hover.png) no-repeat center center;
            background-size: 100% 100%;
          }
        }
        .achomeIcon4 {
          span {
            background: url(~@/assets/img/s03_hover.png) no-repeat center center;
            background-size: 100% 100%;
          }
        }
        .achomeIcon5 {
          span {
            background: url(~@/assets/img/s04_hover.png) no-repeat center center;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}

</style>
