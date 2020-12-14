<template>
  <div>
    <div class="achome">
      <div class="item">
        <p class="p1">
          <span class="achomeIcon achomeIcon1"></span>订单信息
        </p>

        <p class="p2" @click="getorder(1)">
          待发货订单：
          <span style="color:#FF8800">{{waitDelivery}}</span>
        </p>
        <p class="p2" @click="getorder(0)">
          昨日订单：
          <span>{{orderCountInYesterday}}</span>
        </p>
        <p class="p2" @click="getorder(5)">
          已退款订单：
          <span>{{moneyBack}}</span>
        </p>
      </div>
      <div class="item pack">
        <p class="p1">
          <span class="achomeIcon achomeIcon2"></span>物流信息
        </p>
        <p class="p2" @click="getorder(3)">
          已完成：
          <span>{{finishOrderCount}}</span>
        </p>
        <p class="p2" @click="getorder(2)">
          派送中：
          <span>{{toSendOrderCount}}</span>
        </p>
      </div>
      <div class="item market">
        <p class="p1">
          <span class="achomeIcon achomeIcon3"></span>商品信息
          <i class="tip_icon">
            <span class="tip">商品信息：在售、价格异常（【在售】表示礼品公司下面的全部商城已上架商品数量；【价格异常】表示下面各商城中出现供应价大于销售价的价格异常，点击跳转定位到对应商城内的该商品）</span>
          </i>
        </p>
        <p class="p2" @click="getcommo()">
          在售：
          <span>{{productCount}}</span>
        </p>
        <!-- <p class="p2">售罄：</p> -->
        <el-popover placement="right" width="300" trigger="click" title="价格异常">
          <p>点击数据跳转到对应商城商品库</p>
          <el-table :data="gridData">
            <el-table-column width="150" property="siteName" label="商城"></el-table-column>
            <el-table-column width="100" property="productIsExceptionCount" label="商品数">
              <template slot-scope="scope">
                <i
                  style="color: #1985FF;cursor:pointer"
                  @click="goSite(scope.row)"
                >{{scope.row.productIsExceptionCount}}</i>
              </template>
            </el-table-column>
          </el-table>
          <p slot="reference" class="p2">
            价格异常：
            <span style="color:#FF0000">{{productIsExceptionCount}}</span>
          </p>
        </el-popover>

        <!-- <p class="p2" @click="getcommo()" slot="reference">
          价格异常：
          <span>{{productIsExceptionCount}}</span>
        </p>-->
      </div>
      <div class="item member">
        <p class="p1">
          <span class="achomeIcon achomeIcon4"></span>会员信息
        </p>

        <p class="p2">
          导入：
          <span>{{importmerberCount}}</span>
        </p>
        <p class="p2">
          注册：
          <span>{{registmerberCount}}</span>
        </p>
      </div>
    </div>
    <div class="chartsList">
      <el-row :gutter="35">
        <el-col :span="10" class="chartsItem">
          <div class="grid-content">
            <h3>新增订单趋势</h3>
            <div id="myChart" :style="{height: '350px'}"></div>
          </div>
        </el-col>
        <el-col :span="6" class="chartsItem">
          <div class="grid-content">
            <h3>订单分类</h3>
            <div id="myChartPie" :style="{height: '300px'}"></div>
          </div>
        </el-col>
        <el-col :span="8" class="chartsItem">
          <div class="grid-content">
            <h3>新增会员趋势</h3>
            <div id="myChartHuiyuan" :style="{height: '300px'}"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="productList">
      <el-row :gutter="35">
        <el-col :span="13" class="productItem">
          <div class="grid-content">
            <h3>商品销量排行榜</h3>
            <el-table
              :data="tableDataA"
              style="width: 100%"
              :header-cell-style="{color:'#333',background:'#F5F7FA'}"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="photo" label="产品图片" width="90">
                <template slot-scope="scope">
                  <img :src="scope.row.photo" width="70" height="70" />
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="产品名称">
                <template slot-scope="scope">
                  <span v-html="scope.row.productName" class="s1"></span>
                </template>
              </el-table-column>
              <el-table-column prop="productCode" label="产品编号" width="90"></el-table-column>
              <el-table-column prop="orderCount" label="销量" width="90"></el-table-column>
              <el-table-column prop="totalAmount" label="销售额" width="100"></el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="11" class="productItem">
          <div class="grid-content">
            <h3>商城排行榜</h3>
            <el-table
              :data="tableDataB"
              style="width: 100%"
              :header-cell-style="{color:'#333',background:'#F5F7FA'}"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="siteName" label="商城"></el-table-column>
              <el-table-column prop="orderCount" label="销量"></el-table-column>
              <el-table-column prop="totalAmount" label="销售额"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      waitDelivery: '',
      orderCountInYesterday: '',
      moneyBack: '',
      finishOrderCount: '',
      toSendOrderCount: '',
      productCount: '',
      productIsExceptionCount: '',
      importmerberCount: '',
      registmerberCount: '',
      gridData: [],
      tableDataA: [],
      tableDataB: []
    }
  },
  mounted () {
    this.queryHomePage()
    this.getindexs()
  },
  methods: {
    getindexs () {
      var mlisturl = JSON.parse(localStorage.getItem('menulistsurl'))
      var currenturl = location.hash.replace('#', '')
      let index = mlisturl.findIndex(item => item === currenturl)
      console.log(index)
      if (index < 0) {
        var gotourl = localStorage.getItem('menuListFirstUrl')
        this.$router.push({ path: gotourl })
      }
    },
    goSite (item) {
      console.log(item)
      localStorage.setItem('pageSiteId', item.siteId)
      localStorage.setItem('siteName', item.siteName)
      window.open(location.origin + '/frontend-vis/#/myGoods?relationship=gt', '_blank')
    },
    getorder (type) {
      var getLastDay = ''
      if (type === 0) {
        getLastDay = 1
      }
      this.$router.push('/orderList?type=' + type + '&getLastDay=' + 1)
    },
    getcommo () {
      // this.$router.push('/commoditiesList?operStatus=3')
    },
    drawBar (BarValue, BarData) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#94e493'
            }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#94e493'
          }
        },
        grid: {
          top: '15%', // 距上边距
          left: '60',
          right: '80'
        },

        xAxis: {
          data: BarValue,
          name: '日期'   // x轴名称
        },
        yAxis: {
          type: 'value',
          name: '订单数'   // y轴名称
        },
        series: [{
          name: '订单数',
          type: 'bar',
          data: BarData,
          smooth: true,
          itemStyle: {
            normal: {
              color: '#3e98f6',
              lineStyle: {
                color: '#3e98f6'
              }
            }
          }
        }]
      })
      window.onresize = myChart.resize
    },
    drawPie (jfOrderCount, packsOrderCount) {
      let myChart = this.$echarts.init(document.getElementById('myChartPie'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: ['积分订单', '礼包订单']
        },
        series: [
          {
            name: '订单分类',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: jfOrderCount, name: '积分订单' },
              { value: packsOrderCount, name: '礼包订单' }
            ]
          }
        ],
        color: ['#7A77EB', '#A1F3B2']
      })
    },
    drawLine (BarValue, BarData) {
      let myChart = this.$echarts.init(document.getElementById('myChartHuiyuan'))
      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: BarValue,
          name: '日期'   // x轴名称
        },
        yAxis: {
          type: 'value',
          name: '会员数'   // y轴名称
        },
        series: [{
          data: BarData,
          type: 'line',
          areaStyle: {},
          itemStyle: {
            normal: {
              color: '#3e98f6',
              lineStyle: {
                color: '#3e98f6'
              }
            }
          }
        }]
      })
    },
    // myChartHuiyuan
    queryHomePage () {
      this.tableDataA = []
      this.tableDataB = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/homePage/queryHomePage'),
        method: 'post',
        data: this.$http.adornData({

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.waitDelivery = data.waitDelivery
          this.orderCountInYesterday = data.orderCountInYesterday
          this.moneyBack = data.moneyBack
          this.finishOrderCount = data.finishOrderCount
          this.toSendOrderCount = data.toSendOrderCount
          this.productCount = data.productCount
          this.productIsExceptionCount = data.exceptionCount
          this.importmerberCount = data.importmerberCount
          this.registmerberCount = data.registmerberCount
          this.gridData = data.productIsException
          if (data.orderQS.length > 0) {
            var drawaBarValue = '', drawaBarData = ''
            for (let index = 0; index < data.orderQS.length; index++) {
              const element = data.orderQS[index]
              drawaBarValue += element.monthNum + ','
              drawaBarData += element.orderCount + ','
            }
            drawaBarValue = drawaBarValue.substring(0, drawaBarValue.length - 1)
            drawaBarData = drawaBarData.substring(0, drawaBarData.length - 1)
            var BarValue = drawaBarValue.split(',')
            var BarData = drawaBarData.split(',')
            this.drawBar(BarValue, BarData)
          } else {
            this.drawBar(0, 0)
          }
          this.drawPie(data.jfOrderCount, data.packsOrderCount)
          //   { value: 335, name: '直接访问' },
          //
          if (data.merberMonths.length > 0) {
            var drawLineValue = '', drawLineData = ''
            for (let indexA = 0; indexA < data.merberMonths.length; indexA++) {
              const elementA = data.merberMonths[indexA]
              drawLineValue += elementA.monthNum + ','
              drawLineData += elementA.userCount + ','
            }
            drawLineValue = drawLineValue.substring(0, drawLineValue.length - 1)
            drawLineData = drawLineData.substring(0, drawLineData.length - 1)
            var BarValue = drawLineValue.split(',')
            var BarData = drawLineData.split(',')
            this.drawLine(BarValue, BarData)
          } else {
            this.drawLine(0, 0)
          }

          if (data.saleProductReports.length > 0) {
            for (let indexB = 0; indexB < data.saleProductReports.length; indexB++) {
              const elementB = data.saleProductReports[indexB]
              elementB.photo = elementB.source === 1 ? 'http://img13.360buyimg.com/n1/' + elementB.photo : elementB.photo
            }
          }
          this.tableDataA = data.saleProductReports
          this.tableDataB = data.saleOrderReports
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .homeWarp {
  padding: -20px;
  background: #F5F8FC;
}
.achome {
  display: flex;
  justify-content: flex-start;
  padding-top: 40px;
  .item {
    height: 232px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.16);
    width: 23%;
    margin: 0 20px;
    position: relative;
    border-top: 7px solid #3aa1ff;
    .achomeIcon {
      width: 32px;
      height: 32px;
      vertical-align: text-bottom;
      margin-right: 10px;
      &.achomeIcon1 {
        width: 32px;
        height: 32px;
        display: inline-block;
        background: url(~@/assets/img/index01.png) no-repeat center center;
        background-size: contain;
      }
      &.achomeIcon2 {
        width: 32px;
        height: 32px;
        display: inline-block;
        background: url(~@/assets/img/index04.png) no-repeat center center;
        background-size: contain;
      }
      &.achomeIcon3 {
        width: 32px;
        height: 32px;
        display: inline-block;
        background: url(~@/assets/img/index03.png) no-repeat center center;
        background-size: contain;
      }
      &.achomeIcon4 {
        width: 32px;
        height: 32px;
        display: inline-block;
        background: url(~@/assets/img/index02.png) no-repeat center center;
        background-size: contain;
      }
    }
    p {
      &.p1 {
        text-align: left;
        padding-right: 37px;
        margin-top: 31px;
        margin-left: 23px;
        margin-bottom: 7px;
        height: 32px;
        font-size: 27px;
        font-weight: 400;
        line-height: 32px;
        color: rgba(0, 0, 0, 1);
      }
      &.p2 {
        font-size: 16px;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        text-align: right;
        padding-right: 22px;
        // cursor: pointer;
        outline: none;
        line-height: 37px;
        margin-bottom: 10px;
        span {
          font-size: 36px;
          font-weight: 400;
          line-height: 37px;
          color: rgba(51, 51, 51, 1);
          vertical-align: middle;
          cursor: pointer;
        }
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
    &.pack {
      border-top: 7px solid #f1a308;
    }
    &.market {
      border-top: 7px solid #1985FF;
    }
    &.member {
      border-top: 7px solid #c73c9d;
    }
  }
}
.chartsList {
  margin-top: 26px;
  padding: 0 20px;

  .chartsItem {
    height: 406px;
    .grid-content {
      background: #ffffff;
      height: 406px;
      overflow: hidden;
    }
    &:last-child {
      margin-right: 0;
    }
    h3 {
      font-size: 14px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      padding-left: 20px;
      padding-top: 20px;
      margin-bottom: 40px;
    }
  }
}
.productList {
  margin-top: 26px;
  padding: 0 20px;
  .productItem {
    .grid-content {
      background: #ffffff;
      height: 604px;
    }

    h3 {
      height: 20px;
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      color: rgba(34, 34, 34, 1);
      padding-left: 20px;
      padding-top: 20px;
      margin-bottom: 40px;
    }
  }
}
.charts {
  margin-top: 90px;
}
/deep/ .el-card__body {
  background: #f3f4fa;
}
.s1 {
  overflow: hidden;
  height: 48px;
  display: inline-block;
}
</style>
