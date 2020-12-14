<template>
  <div class="yycmarket">
   <applyHeader ref="applyheader"  styleName="2"/>
    <div class="market-tip">
      <div>
        <p>1、根据银行客户不同的营销需求，将对应活动配置到银行客户的公众号、银行APP内，实现流量提升、增加品牌曝光、提升品牌好感度，促活拉新。</p>
        <p>2、针对大型企业客户，营销活动可提高员工参与度，促进员工对福利的满意度。</p>
      </div>
    </div>
    <div class="xmgl">
      <div class="xmgl_item" v-for="(item,index) in markList" :key="index">
        <img :src="item.img" alt />
        <div class="xmglInfo">
          <div class="d1">
            <h5>{{item.title}}</h5>

          </div>
          <div class="d2">{{item.content1}}</div>
          <div class="d2">
            <span v-for="(itemA,indexA) in item.txtlist" :key="indexA">{{indexA+1}},{{itemA.text}}</span>
          </div>

          <el-button
            v-if="!getDisabled(item)"
            type="primary"
            class="btnPrimary"
            @click="isChioceShow = true, actType=item.type"
          >去创建活动</el-button>
          <el-popover placement="bottom-start" trigger="hover" popper-class="recharge-pop">
            <p>营销工具</p>
            <div style="display: flex;">
              <el-button @click="buy(item.price,item.type)" type="primary" style="background:#ffffff;color:#1985FF">立即购买</el-button>
              <el-button @click="$router.push({path: 'memberRecharge'})" type="primary" style="background:#ffffff;color:#1985FF">立即升级</el-button>
            </div>
            <el-button
              v-if="getDisabled(item)"
              type="info"
              class="btnPrimary"
              slot="reference"
            >去创建活动</el-button>
          </el-popover>
        </div>
        <div class="xmgl_content" v-show="item.isshowcontent" v-html="item.summary"></div>
      </div>

      <el-dialog
        title="提示"
        :visible.sync="isChioceShow"
        width="400px"
        heigth="450px"
        :closeOnClickModal="true"
        class="elDialogOpemlist"
      >
        <p>您已开通此功能,选择商城后可进入配置</p>
        <div class="creatsite">
          <el-radio-group v-model="radioGroup">
            <el-radio
              :label="item.id"
              v-for="(item,index) in siteLists"
              :key="index"
              class="radioGroupitem"
            >{{item.siteName}}</el-radio>
          </el-radio-group>
        </div>
        <div style="text-align:right">
          <el-button @click="isChioceShow=false">取消</el-button>
          <el-button type="primary" @click="getGOSite()">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import applyHeader from '../../components/common/applyHeader'
export default {
  data () {
    return {
      // 活动类型：1抽奖 2.签到 3.特惠 4.砍价 5.拼团
      siteListNum: localStorage.getItem('siteListNum'),
      lbNum: localStorage.getItem('lbNum'),
      markList: [
        {
          img: require('./img/05.png'),
          title: '限时特惠',
          tag: '会员专享',
          price: '1680',
          type: 0,
          content1: '短时间内将商品销售完，还会短时间内获得巨大流量',
          content2: '',
          createTime: '2020-10-01',
          isActive: false,
          isshowcontent: false,
          txtlist: [
            {
              text: '创造“抢”的氛围，会有“蜂拥而上”的一种现象'
            },
            {
              text: '有利于吸引对价格敏感度高的用户'
            },
            {
              text: '为商城引流，进而带动高客单价产品的销售'
            }
          ],
          summary:
            '此功能为会员专享，您可免费使用，需到对应商城内配置，流程：<br/>1、在商城【可视化配置】-【营销活动】页面内创建限时特惠活动并设置为开启状态<br/>2、在【可视化配置】-【首页编辑】页面内点击任一模块后，选择【营销活动】选项既可（类似配置商品专题）'
        },
        {
          img: require('./img/04.png'),
          title: '抽奖',
          tag: '会员专享',
          price: '1680',
          type: 1,
          content1: '增加品牌曝光，提升对品牌的好感度',
          content2: '',
          createTime: '',
          isActive: false,
          isshowcontent: false,
          txtlist: [
            {
              text: '让更多人参与进来，增加品牌曝光，提升对品牌的好感度'
            },
            {
              text: '有利于提高用户期望及提升用户体验'
            }
          ],
          summary:
            '此功能为会员专享，您可免费使用，需到对应商城内配置，流程：<br/>1、在商城【可视化配置】-【营销活动】页面内创建抽奖活动并设置为开启状态<br/>2、在【可视化配置】-【首页编辑】页面内点击任一模块后，选择【营销活动】选项既可（类似配置商品专题）'
        },
        {
          img: require('./img/03.png'),
          title: '拼团',
          tag: '敬请期待',
          price: '6800',
          type: 3,
          content1: '较好地解决产品推广和流量问题',
          content2: '',
          createTime: '',
          isActive: false,
          isshowcontent: false,
          txtlist: [
            {
              text: '借助熟人关系链，熟人社交传播快，下单试错成本低，传播快'
            },
            {
              text: '能有效解决库存压力大问题'
            }
          ],
          summary:
            '1、在商城【可视化配置】-【营销活动】页面内创建拼团活动并设置为开启状态<br/>2、在【可视化配置】-【首页编辑】页面内点击任一模块后，选择【营销活动】选项既可（类似配置商品专题）'
        }
        // {
        //   img: require("./img/02.png"),
        //   title: "助力",
        //   tag: "敬请期待",
        //   price: "1688",
        //   type: 4,
        //   content1: "邀请更多的好友“帮助”一下，最终双方都拿到部分奖励",
        //   content2: "",
        //   createTime: "",
        //   isActive: false,
        //   txtlist: [
        //     {
        //       text:
        //         "微信圈子里有天然的好友关系，会相互帮忙助力，能够拉新，同时也促进用户活跃度"
        //     }
        //   ]
        // },
        // {
        //   img: require("./img/01.png"),
        //   title: "砍价",
        //   tag: "敬请期待",
        //   price: "1688",
        //   type: 2,
        //   content1: "裂变经典玩法，非常适合做拉新裂变",
        //   content2: "",
        //   createTime: "",
        //   isActive: false,
        //   txtlist: [
        //     {
        //       text: "好友帮你砍，这个过程其实是能促进社交传播"
        //     },
        //     {
        //       text:
        //         "砍价的本质是以众筹为主，抽奖为辅，需要的还是好友间的认同感，即利他心理"
        //     }
        //   ]
        // }
      ],
      listNoPageList: [],
      siteLists: [],
      isChioceShow: false,
      radioGroup: '',
      actType: ''
    }
  },
  created () {
    this.listNoPage()
    this.getTotalSite()
  },
  mounted () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.orgId = userInfo === null ? '' : userInfo.organizationIds
  },

  methods: {

    showenter (item) {
      item.isshowcontent = true
    },
    showleave (item) {
      item.isshowcontent = false
    },
    addSite () {
      var userInfo = JSON.parse(localStorage.getItem('userInfo'))
      var orgType = userInfo.sysOrganization.type
      if (orgType === 2) {
        this.$router.push({ path: '/basicInfo' })
      } else {
        this.$router.push({ path: '/choiceModel' })
      }
    },
    listNoPage () {
      this.listNoPageList = []
      // this.listNoPageList.push({
      //   createTime: '2020-10-01',
      //   type: 0
      // })
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/org/marketinfo/listNoPage'),
        method: 'post',
        data: this.$http.adornData({})
      }).then(data => {
        if (data && data.data.code === 0) {
          for (let index = 0; index < data.data.list.length; index++) {
            const element = data.data.list[index]

            this.listNoPageList.push({
              createTime: element.createDate,
              type: element.type
            })
          }
          // this.listNoPageList = [...new Set(this.listNoPageList)]
          this.markList.map(item => {
            
            for (let i = 0; i < this.listNoPageList.length; i++) {
              const itemA = this.listNoPageList[i]
              if (item.type === itemA.type) {
                item.isActive = true
                item.createTime = itemA.createTime
              }
            }
          })
          console.log(this.markList)
        } else {
        }
      })
    },
    buy (price, type) {
      // 点击确认后，将扣减您的账户余额1688元！开通后，所属全部商城则均可应用该模块！
      this.$confirm('确认后您所创建的所有商城均可使用该营销活动（使用期限1年），将从您的机构预存款账户内扣除' + price + '元', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/org/marketinfo/buy'),
          method: 'post',
          data: this.$http.adornData(
            {
              payAmount: price,
              availableMonthNum: '12',
              type: type
            },
            true
          )
        }).then(data => {
          if (data && data.data.code === 0) {
            this.$message.success('购买成功')
            this.mktCreat()
            this.listNoPage()
            this.getTotalSite()
          } else {
            this.$message.error(data.data.msg)
          }
        })
      })
    },
    mktCreat () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/org/marketinfo/mktCreat'),
        method: 'post',
        data: this.$http.adornData({}, true)
      }).then(data => {})
    },

    enter (type) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/market/jumpAdmin'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId,
            activityType: type
          },
          true
        )
      }).then(data => {
        if (data && data.data.code === 0) {
        }
      })
    },
    sbmit () {
      this.$http({
        url: this.$http.adornUrl('mall/mallsite/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
        } else {
        }
      })
    },
    getDisabled (item) {
      
      let orgVip = localStorage.getItem('orgVip') != 'undefined' ? JSON.parse(localStorage.getItem('orgVip')) : 'undefined'
      if (orgVip === 'undefined' || (orgVip.vipType === 1 && item.type === 0 && item.isActive === true) || (orgVip.vipType === 2 && item.type === 0 && item.isActive === true) || (orgVip.vipType === 1 && item.type === 1 && item.isActive === true) || (orgVip.vipType === 2 && item.type === 1 && item.isActive === true) || orgVip.vipType === 3 || (item.type === 3 && item.isActive === true)) {
        return false
      }
      return true
    },
    getTotalSite () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/site/siteadvert/getTotalSite'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: localStorage.getItem('orgId')
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.siteLists = res.data.obj
        }
      })
    },
    getGOSite () {
      let actList = {
        0: 'activityList', // 限时特惠
        1: 'luckydrawList', // 抽奖
        3: 'groupProductList' // 拼团
      }
      if (this.radioGroup) {
        localStorage.setItem('pageSiteId', this.radioGroup)
        let item = this.siteLists.filter(item => item.id === this.radioGroup)[0]
        console.log(item.siteName)
        localStorage.setItem('siteName', item.siteName)
        localStorage.setItem('siteType', 1)
        window.open(location.origin + '/frontend-vis/#/' + actList[this.actType], '_blank')
      }
      return this.$message.error('请选取商城')
    }
  },
  components: {
    applyHeader
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';
.yycmarket {
   .market-tip {
    margin-top: 20px;
    padding: 24px;
    color: #333;
    background-color: #F5F8FC;
    border-radius: 6px;

    p {
      line-height: 30px;
    }
  }
  .xmgl {
    display: flex;
    justify-content: start;
    text-align: center;
    flex-wrap: wrap;
    margin-top: 70px;
    position: relative;

    .xmgl_item {
      width:395px;
      background: #fff;
      border-radius: 8px;
      position: relative;
      margin: 20px;
      text-align: left;
      border: 1px solid #dcdfe6;

      img {
        width: 180px;
        display: inline-block;
        margin: 15px;
      }

      .xmglInfo {
        text-align: left;
        display: inline-block;
        width: calc(100% - 230px);
        vertical-align: top;
        margin-top: 15px;
        height: 226px;
        position: relative;
        margin-bottom: 20px;

        p {
          width: 74px;
          height: 27px;
          line-height: 27px;
          background: rgba(220, 235, 255, 1);
          opacity: 1;
          border-radius: 4px;
          display: inline-block;
          text-align: center;
        }

        div {
          font-size: 14px;
          color: #333333;

          &.d1 {
            display: flex;
            justify-content: space-between;

            .d1btn {
              background: #ffffff;
              border: #1985FF 1px solid;

              &:hover {
                color: #1985FF;
              }
            }
          }

          &.d2 {
            text-align: left;
            color: #666666;
            padding: 5px 0;
            line-height: 20px;
            font-size: 12px;
            font-weight: 300;
            span {
              display: block;
            }
          }

          &.d3 {
            text-align: left;
            font-size: 12px;
            position: absolute;
            left: 0;
            bottom: 33px;
          }
        }

        .btnYx {
          font-size: 12px;
          padding: 10px 5px;
        }

        .btnPrimary {
          width: 104px;
          margin-top: 10px;
          position: absolute;
          left: 0;
          bottom: -5px;
        }
      }

      .xmgl_content {
        position: absolute;
        left: -15px;
        top: 15px;
        z-index: 99;
        text-align: left;
        width: 180px;
        margin: 0 30px;
        line-height: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        height: 231px;
        font-size: 12px;
        padding: 10px;
      }
    }
  }
}
.elDialogOpemlist{
  /deep/ .el-dialog__body{
    padding-top: 10px;
  }
  p {
    text-align: left;
  }
  .creatsite{
    max-height: 200px;
    overflow: hidden;
    overflow-y: scroll;
    margin-bottom: 20px;
    .radioGroupitem{
     display: block;
      margin-left: 0;
      line-height: 30px;
      text-align: left;
    }
    .el-radio-group {
      display: block;
    }
  }
}
.recharge-pop {
  background-color: #489AFA;
  background:url('img/buybg.png') no-repeat;
  background-size:100% 100%;
  height:107px;
  border:#489AFA 1px solid;

  p {
    color: #fff;
    line-height: 40px;
  }
  /deep/ .popper__arrow,{
    bottom: -6px !important;
    border-top-color:#489AFA !important;
  }
  /deep/ .popper__arrow::after{
     border-top-color:#489AFA !important;
  }

}
</style>
