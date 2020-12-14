<template>
  <div
    class="home"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <el-row :gutter="24" class="base-row">
      <el-col :span="20" class="base-col">
        <div class="col-container">
          <el-row :gutter="24" class="con-content">
            <el-col :span="6">
              <div class="con-title">智能助手</div>
              <div class="progress">
                <el-progress
                  :stroke-width="10"
                  type="circle"
                  :show-text="false"
                  :color="customColor"
                  :percentage="processed/100"
                ></el-progress>
                <div class="progress-text">
                  <p>
                    <i class="text-color">{{processed}}</i>项
                  </p>
                  <p style="color: #999">待处理</p>
                </div>
                <p class="progress-tip">
                  详见右侧
                  <img src="./../img/sj.png" alt />
                </p>
                <p class="progress-tips">数据范围：待发货、价格异常、基础配置3项</p>
              </div>
            </el-col>
            <el-col :span="18">
              <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                <el-tab-pane label="运营动态" name="first">
                  <el-row :gutter="24">
                    <el-col :span="8">
                      <div class="opera">
                        <img src="./../img/surplus.png" alt />
                        <p class="opera-num">{{orgBlacne}}</p>
                        <p class="opera-text">预存款账户余额</p>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div class="col-order">
                        <div class="orderInfo" style="border-bottom: 16px solid #fff;height:140px">
                          <div class="info-title">
                            <img src="./../img/order.png" alt />
                            订单信息
                          </div>
                          <div class="info-content">
                            <div class="info-item">
                              <p class="item-num" style="color: #FFA703;">{{waitDelivery}}</p>
                              <div class="item-title" @click="getorder(1)">
                                待发货订单
                                <img src="./../img/arrow.png" alt />
                              </div>
                            </div>
                            <div class="info-item">
                              <p class="item-num">{{orderCountInYesterday}}</p>
                              <div class="item-title" @click="getorder(0)">
                                昨日订单
                                <img src="./../img/arrow.png" alt />
                              </div>
                            </div>
                            <div class="info-item">
                              <p class="item-num">{{moneyBack}}</p>
                              <div class="item-title" @click="getorder(5)">
                                售后订单
                                <img src="./../img/arrow.png" alt />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="Info" style="height:140px">
                          <div class="col-info orderInfo" style="margin-right: 16px;">
                            <div class="info-title">
                              <img src="./../img/sp.png" alt />
                              商品信息
                            </div>
                            <div class="info-content" style="padding: 20px 0 20px 20px;">
                              <div class="info-item">
                                <p class="item-num">{{productCount}}</p>
                                <div class="item-title">在售</div>
                              </div>
                              <div class="info-item" style="text-align: center">
                                <p
                                  class="item-num"
                                  style="color: #FFA703;"
                                >{{productIsExceptionCount}}</p>
                                <el-popover
                                  placement="right"
                                  width="500"
                                  trigger="click"
                                  title="价格异常"
                                >
                                  <el-table :data="gridData">
                                    <el-table-column property="siteName" label="商城" width="200"></el-table-column>
                                    <el-table-column
                                      property="productIsExceptionCount"
                                      :render-header="renderTabHeader"
                                      label="异常商品数"
                                    >
                                      <template slot-scope="scope">
                                        <i
                                          style="color: #1985FF;cursor:pointer"
                                          @click="goSite(scope.row)"
                                        >{{scope.row.productIsExceptionCount}}</i>
                                      </template>
                                    </el-table-column>
                                  </el-table>
                                  <div class="item-title" slot="reference">
                                    价格异常
                                    <img src="./../img/arrow.png" alt />
                                  </div>
                                </el-popover>
                              </div>
                            </div>
                          </div>
                          <div class="col-info orderInfo">
                            <div class="info-title">
                              <img src="./../img/sp.png" alt />
                              会员信息
                            </div>
                            <div class="info-content" style="padding: 20px 0 20px 20px;">
                              <div class="info-item">
                                <p class="item-num">{{importmerberCount}}</p>
                                <div class="item-title">导入</div>
                              </div>
                              <div class="info-item">
                                <p class="item-num">{{registmerberCount}}</p>
                                <div class="item-title">注册</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="商城概况" name="second">
                  <el-table :data="mallData" v-loading="mallDataLoading" height="270">
                    <el-table-column prop="id" label="商城ID" align="center"></el-table-column>
                    <el-table-column prop="siteName" label="商城名称" align="center" width="200"></el-table-column>
                    <el-table-column prop="accountBlance" label="账户额度" align="center"></el-table-column>
                    <el-table-column prop="productCount" label="上架商品" align="center"></el-table-column>
                    <el-table-column prop="packsCount" label="已分发礼包" align="center" width="100"></el-table-column>
                    <el-table-column prop="voucherSum" label="已分发积分" align="center" width="100"></el-table-column>
                    <el-table-column prop="merberCount" label="会员数量" align="center"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" align="center" width="160"></el-table-column>
                    <el-table-column prop="saleAmount" label="累计销售额" align="center" width="100"></el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper"
                  ></el-pagination>
                </el-tab-pane>
                <el-tab-pane label="基础配置" name="third">
                  <div v-for="(item, index) in baseList" :key="index" class="base-item">
                    <div class="item-l">
                      <img class="l-img" :src="item.src" alt />
                      <b class="l-name">{{item.name}}</b>
                      <span class="l-text">{{item.text}}</span>
                    </div>
                    <el-button
                      type="text"
                      class="item-btn"
                      v-if="item.flag === 0"
                      @click="handleSetting(item.label)"
                    >立即设置</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="4" class="base-col">
        <div class="col-content">
          <div class="col-tell">
            <img src="./../img/tell.png" alt />
            <div class="tell-text">
              <p>项目经理热线</p>
              <p class="text-num">电话: {{managerTell}}</p>
            </div>
          </div>
          <div class="col-product">
            <h3 class="product-name">产品动态</h3>
            <div v-for="(val, index) in productList" :key="index" class="product-proItem">
              <el-popover placement="right" width="300" trigger="hover">
                <div v-html="val.directions" class="product-proItem-content"></div>
                <div slot="reference" class="product-proItem-1">
                  <div class="proItem-date">{{val.updateDate}}</div>
                  <div class="proItem-r">
                    <p class="proItem-name">{{val.version}}版本迭代更新</p>
                    <p class="proItem-text" v-html="val.directions"></p>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base-row">
      <el-col :span="20" class="base-col">
        <div class="col-container">
          <div class="con-title">
            商城统计
            <!-- <span>更新时间: {{getDate()}}</span> -->
          </div>
          <div class="mall-container">
            <el-carousel height="379px" :interval="6000">
              <el-carousel-item>
                <el-row class="base-row" :gutter="24" style="padding: 0 20px">
                  <el-col class="base-col" :span="9">
                    <h3 class="col-title">
                      <img src="./../img/ph1.png" />
                      新增订单趋势
                      <span>（近一周）</span>
                    </h3>
                    <div id="myChart" :style="{height: '350px'}"></div>
                  </el-col>
                  <el-col class="base-col" :span="6">
                    <h3 class="col-title">
                      <img src="./../img/ph2.png" />
                      订单分类
                    </h3>
                    <div id="myChartPie" :style="{height: '300px'}"></div>
                  </el-col>
                  <el-col class="base-col" :span="9">
                    <h3 class="col-title">
                      <img src="./../img/ph3.png" />
                      新增会员趋势
                      <span>（单月数据纬度）</span>
                    </h3>
                    <div id="myChartHuiyuan" :style="{height: '350px'}"></div>
                  </el-col>
                </el-row>
              </el-carousel-item>
              <el-carousel-item>
                <el-row :gutter="24" type="flex" justify="space-between" style="padding: 0 20px;">
                  <el-col :span="12" style="margin-:5px">
                    <div class="tableA">
                      <h3 class="col-title">
                        <img src="./../img/ph1.png" />
                        商品销量排行榜
                      </h3>
                      <div class="btnA">
                        <el-button
                          v-for="(item,index) in btnList"
                          :key="index"
                          :type="item.select?'primary':''"
                          @click="todayA(item.id)"
                        >{{item.btnName}}</el-button>
                      </div>
                    </div>
                    <el-table
                      :data="tableDataD"
                      style="width: 100%"
                      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
                      height="320"
                    >
                      <el-table-column label="排行" type="index" align="center"></el-table-column>
                      <el-table-column prop="photo" label="产品图片" align="center">
                        <template slot-scope="scope">
                          <img :src="scope.row.photo" width="30" height="30" />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="productName"
                        label="产品名称"
                        show-overflow-tooltip
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span v-html="scope.row.productName" class="s1"></span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productCode" label="产品编号" align="center"></el-table-column>
                      <el-table-column prop="orderCount" label="销量" align="center"></el-table-column>
                      <!-- <el-table-column prop="totalAmount" label="销售额" align="center"></el-table-column> -->
                    </el-table>
                  </el-col>
                  <el-col :span="11">
                    <div class="tableB">
                      <h3 class="col-title">
                        <img src="./../img/ph1.png" />
                        商城排行榜
                      </h3>
                      <div class="btn">
                        <el-button
                          v-for="(item,index) in btnListB"
                          :key="index"
                          :type="item.select?'primary':''"
                          @click="today(item.id)"
                        >{{item.btnName}}</el-button>
                      </div>
                    </div>
                    <el-table
                      :data="tableDataC"
                      style="width: 100%"
                      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
                      height="320"
                    >
                      <el-table-column label="排行" type="index" width="50" align="center"></el-table-column>
                      <el-table-column prop="siteName" label="商城" align="center"></el-table-column>
                      <el-table-column prop="orderCount" label="销量" align="center"></el-table-column>
                      <el-table-column prop="totalAmount" label="销售额" align="center"></el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="base-col">
        <div class="bulletin">
          <div class="bulletin-title">公告栏</div>
          <div class="bulletin-item" @click="bulletinclick(1)">
            <img src="../img/new.png" />【运营工具】精选21个专题，一键导入到商城
          </div>
          <div class="bulletin-item" @click="bulletinclick(2)">【在线培训】驿宝通运营团队教你卡券玩出花</div>
          <div class="bulletin-item" @click="bulletinclick(3)">【展会邀请】第28届深圳礼品家居展会邀请函</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base-row" style="margin-bottom: -16px;">
      <el-col :span="20" class="base-col">
        <div class="col-container footer">
          <div class="common">
            <div class="footer-title">
              <div class="title-label">常用功能</div>
              <!-- <div class="title-edit">编辑</div> -->
            </div>
            <div class="footer-content">
              <div
                class="content-item"
                v-for="(item, index) in commonList"
                :key="index"
                @click="usertool(item)"
              >
                <img :src="item.src" alt />
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
          <div class="propose">
            <div class="footer-title">运营工具</div>
            <div class="propose-content">
              <div
                class="propose-item"
                v-for="(item, index) in proposeList"
                :key="index"
                @click="handlePropose(item.url)"
              >
                <div class="item-l">
                  <p class="l-name">{{item.name}}</p>
                  <p class="l-text">{{item.text}}</p>
                </div>
                <img :src="item.src" alt />
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="base-col">
        <!-- <div class="study">
          <div class="study-title">学习交流</div>
          <div class="study-item" v-for="(item, index) in studyList" :key="index">
            <img :src="item.src" alt />
            <div>
              <p class="item-name">{{item.name}}</p>
              <p class="item-text">{{item.text}}</p>
            </div>
          </div>
        </div>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLastDay } from '@/utils'
export default {
  data () {
    return {
      btnList: [
        {
          id: 4,
          btnName: '全部',
          select: false
        },
        {
          id: 1,
          btnName: '今天',
          select: true
        },
        {
          id: 2,
          btnName: '近7天',
          select: false
        },
        {
          id: 3,
          btnName: '近30天',
          select: false
        }
      ],
      btnListB: [
        {
          id: 4,
          btnName: '全部',
          select: false
        },
        {
          id: 1,
          btnName: '今天',
          select: true
        },
        {
          id: 2,
          btnName: '近7天',
          select: false
        },
        {
          id: 3,
          btnName: '近30天',
          select: false
        }
      ],
      customColor: '#1985FF',
      orgBlacne: 0, // 机构余额
      managerTell: '', // 经理电话
      waitDelivery: 0, // 待发货
      orderCountInYesterday: 0, // 昨日
      moneyBack: 0, // 已退款
      productCount: 0, // 在售
      productIsExceptionCount: 0, // 价格异常
      importmerberCount: 0, // 导入
      registmerberCount: 0, // 注册
      activeTab: 'first',
      orgId: localStorage.getItem('orgId'),
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      mallDataLoading: false,
      mallData: [],
      dateType: '',
      tableDataC: [],
      tableDataD: [],
      productList: [],
      commonList: [
        {
          src: require('./../img/gn1.png'),
          name: '商城充值',
          path: 'rechargeManagement'
        },
        {
          src: require('./../img/gn2.png'),
          name: '新增员工/供应商',
          path: 'sys-user'
        },
        {
          src: require('./../img/gn3.png'),
          name: '平台商品库',
          path: 'platform'
        },
        {
          src: require('./../img/gn4.png'),
          name: '订单查询',
          path: 'orderList'
        },
        {
          src: require('./../img/gn5.png'),
          name: '对账开票',
          path: 'FinancialAllocation'
        },
        {
          src: require('./../img/gn6.png'),
          name: '机构充值/提现',
          path: 'financeIndex'
        },
        {
          src: require('./../img/gn7.png'),
          name: '消息提醒设置',
          path: 'smsManagementList'
        }
      ],
      baseList: [
        {
          src: require('./../img/base1.png'),
          label: 'orgAccountFlag',
          name: '机构账户未充值',
          text: '充值后,创建的所有商城才可正常下单',
          flag: 1
        },
        {
          src: require('./../img/base2.png'),
          label: 'siteRechargeFlag',
          name: '商城账户未充值',
          text: '充值后,该商城才可正常下单',
          flag: 1
        },
        {
          src: require('./../img/base3.png'),
          label: 'orgSmsCountFlag',
          name: '短信账户未充值',
          text: '充值后,才可使用验证码登录,才能设置分发积分和礼包的短信提醒',
          flag: 1
        },
        {
          src: require('./../img/base4.png'),
          label: 'financeFlag',
          name: '财务配置未设置',
          text: '设置后,才可进行现金账户提现及开票',
          flag: 1
        }
      ],
      proposeList: [
        {
          name: '营销活动',
          text: '拼团、秒杀、抽奖',
          src: require('./../img/jy1.png'),
          url: 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200527/701c6f55e3794884aee7f9c19680f766.pdf'
        },
        {
          name: '线下商户',
          text: '和线下商户合作，扩展更多场景',
          src: require('./../img/jy2.png'),
          url: 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200527/e1b422b246e4412eadc317b55a393386.pdf'
        },
        {
          name: '积分/礼包',
          text: '员工福利、客户回馈',
          src: require('./../img/jy3.png'),
          url: 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200527/ab48f545833c47e5985c69fb4f0819e9.pdf'
        },
        {
          name: '移动端分发',
          text: '针对银行客户，积分发放更便捷',
          src: require('./../img/jy4.png'),
          url: 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200527/21d90cc6f5f84b399cde0b630b87a1ad.pdf'
        }
      ],
      studyList: [
        {
          src: require('./../img/xx1.png'),
          name: '在线课堂',
          text: '资深专家视频授课'
        },
        {
          src: require('./../img/xx2.png'),
          name: '帮助中心',
          text: '海量问题，总能搜索到答案'
        },
        {
          src: require('./../img/xx3.png'),
          name: '定制服务',
          text: '定制开发专享功能'
        }
      ],
      tableDataA: [],
      tableDataB: [],
      gridData: [],
      loading: false
    }
  },
  created () {
    this.getQueryHomePage()
    this.verList()
    this.today(4)
    this.todayA(4)
  },
  methods: {
    renderTabHeader (h, { column, $index }, index) {
      return h(
        'div', [
        h('span', column.label),
        h('i', {
          style: 'color:#999999;'
        }, '（供应价>分销价或销售价）')
      ],
      );
    },
    usertool (item) {
      var mlisturl = JSON.parse(localStorage.getItem('menulistsurl'))
      var indexUrl = 0
      for (let index = 0; index < mlisturl.length; index++) {
        const items = mlisturl[index]
        if (items !== null) {
          if (items === '/user') {
            indexUrl++
          }
        }
      }
      let index = mlisturl.findIndex(items => items === ('/' + item.path))
      if (index < 0) {
        if (indexUrl > 0) {
          this.$router.push({
            name: item.path
          })
        } else {
          this.$message.error('您没有权限，无法查看！')
        }
      } else {
        this.$router.push({
          name: item.path
        })
      }
    },
    //
    verList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/versiondirections/verList'),
        method: 'post',
        params: this.$http.adornParams({
          projecCode: 'saas'
        })
      }).then(({ data }) => {
        this.productList = data.list
      }
      )
    },
    bulletinclick (type) {
      if (type === 1) {
        window.open('http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200528/e1844e3dd73d4ec7a5afcb0e183deaef.jpg', '_blank')
      } else if (type === 2) {
        window.open('http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200528/efa047a94e2948a59980642bd17443de.jpg', '_blank')
      } else {
        window.open('https://d.eqxiu.com/s/OXgTyyqq', '_blank')
      }
    },
    getDate () {
      let D = new Date()
      let y = D.getFullYear()
      let m = D.getMonth() + 1
      let d = D.getDate() - 1
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      return y + '-' + m + '-' + d + ' ' + '23:59:59'
    },
    today (id) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/homePage/orderReport'),
        method: 'post',
        params: this.$http.adornParams({
          dateType: id
        })
      }).then(({ data }) => {
        if (data.list.length > 0) {
          for (
            let indexB = 0;
            indexB < data.list.length;
            indexB++
          ) {
            const elementB = data.list[indexB]
            elementB.photo =
              elementB.source === 1
                ? 'http://img13.360buyimg.com/n1/' + elementB.photo
                : elementB.photo
          }
        }
        this.tableDataC = data.list
        for (let i = 0; i < this.btnListB.length; i++) {
          if (Number(id) === this.btnListB[i].id) {
            this.btnListB[i].select = true
          } else {
            this.btnListB[i].select = false
          }
        }
      })
    },
    todayA (id) {
      console.log(id)
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/homePage/productReport'),
        method: 'post',
        params: this.$http.adornParams({
          dateType: id
        })
      }).then(({ data }) => {
        if (data.list.length > 0) {
          for (
            let indexB = 0;
            indexB < data.list.length;
            indexB++
          ) {
            const elementB = data.list[indexB]
            elementB.photo =
              elementB.source === 1
                ? 'http://img13.360buyimg.com/n1/' + elementB.photo
                : elementB.photo
          }
        }
        this.tableDataD = data.list
        for (let i = 0; i < this.btnList.length; i++) {
          if (Number(id) === this.btnList[i].id) {
            this.btnList[i].select = true
          } else {
            this.btnList[i].select = false
          }
        }
      })
    },
    getQueryHomePage () {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/order/homePage/queryHomePage'),
        method: 'post',
        data: this.$http.adornData()
      }).then(({ data }) => {
        console.log(data)
        this.loading = false
        if (data.code === 0) {
          this.orgBlacne = data.orgBlacne
          this.managerTell = JSON.parse(localStorage.getItem('orgVipDetail')).accountManager || '--'
          this.waitDelivery = data.waitDelivery
          this.orderCountInYesterday = data.orderCountInYesterday
          this.moneyBack = data.moneyBack
          this.productCount = data.productCount
          this.productIsExceptionCount = data.exceptionCount
          this.importmerberCount = data.importmerberCount
          this.registmerberCount = data.registmerberCount
          this.gridData = data.productIsException
          this.baseList[0].flag = data.orgAccountFlag
          this.baseList[1].flag = data.siteRechargeFlag
          this.baseList[2].flag = data.orgSmsCountFlag
          this.baseList[3].flag = data.financeFlag
          if (data.orderQS.length > 0) {
            var drawaBarValue = '',
              drawaBarData = ''
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
          // jfOrderCount, packsOrderCount, yxCount, dyCount, xnCoun
          this.drawPie(data.commodityCount, data.packsOrderCount, data.mktOrderCount, data.movieOrderCount, data.virtualOrderCount)
          //   { value: 335, name: '直接访问' },
          //
          if (data.merberMonths.length > 0) {
            var drawLineValue = '',
              drawLineData = ''
            for (let indexA = 0; indexA < data.merberMonths.length; indexA++) {
              const elementA = data.merberMonths[indexA]
              drawLineValue += elementA.monthNum + ','
              drawLineData += elementA.userCount + ','
            }
            drawLineValue = drawLineValue.substring(
              0,
              drawLineValue.length - 1
            )
            drawLineData = drawLineData.substring(0, drawLineData.length - 1)
            var BarValue = drawLineValue.split(',')
            var BarData = drawLineData.split(',')
            this.drawLine(BarValue, BarData)
          } else {
            this.drawLine(0, 0)
          }

          if (data.saleProductReports.length > 0) {
            for (
              let indexB = 0;
              indexB < data.saleProductReports.length;
              indexB++
            ) {
              const elementB = data.saleProductReports[indexB]
              elementB.photo =
                elementB.source === 1
                  ? 'http://img13.360buyimg.com/n1/' + elementB.photo
                  : elementB.photo
            }
          }
          this.tableDataA = data.saleProductReports
          this.tableDataB = data.saleOrderReports
        }
      })
    },
    // 商城概况
    getMallSiteList () {
      this.mallDataLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/listByOrg'),
        method: 'get',
        params: this.$http.adornParams({
          orgId: this.orgId,
          page: this.pageIndex,
          limit: this.pageSize
        })
      }).then(({ data }) => {
        console.log(data)
        if (data && data.code === 0) {
          this.mallData = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.mallData = []
          this.totalPage = 0
        }
        this.mallDataLoading = false
      })
    },
    // 基础配置
    handleSetting (val) {
      switch (val) {
        case 'orgAccountFlag':
          this.$router.push({ name: 'financeIndex', params: { flag: true } })
          break
        case 'siteRechargeFlag':
          this.$router.push({ path: 'rechargeManagement' })
          break
        case 'orgSmsCountFlag':
          this.$router.push({ path: 'smsManagementList' })
          break
        case 'financeFlag':
          this.$router.push({ path: 'FinancialAllocation' })
          break
      }
    },
    goSite (item) {
      console.log(item)
      localStorage.setItem('pageSiteId', item.siteId)
      localStorage.setItem('siteName', item.siteName)
      window.open(location.origin + '/frontend-vis/#/myGoods?relationship=gt', '_blank')
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getMallSiteList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getMallSiteList()
    },
    handleTabClick (val) {
      switch (val.name) {
        case 'first':
          this.getQueryHomePage()
          break
        case 'second':
          this.getMallSiteList()
          break
      }
    },
    handleActive (idx) {
      this.active = idx
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
          name: '日期' // x轴名称
        },
        yAxis: {
          type: 'value',
          name: '订单数' // y轴名称
        },
        series: [
          {
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
          }
        ]
      })
      window.onresize = myChart.resize
    },
    drawPie (jfOrderCount, packsOrderCount, yxCount, dyCount, xnCount) {
      let myChart = this.$echarts.init(document.getElementById('myChartPie'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: ['商品', '礼包', '营销', '电影', '虚拟']
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
              { value: jfOrderCount, name: '商品' },
              { value: packsOrderCount, name: '礼包' },
              { value: yxCount, name: '营销' },
              { value: dyCount, name: '电影' },
              { value: xnCount, name: '虚拟' }
            ]
          }
        ],
        // jfOrderCount, packsOrderCount, yxCount, dyCount, xnCount
        color: ['#1985FF', '#FFA703', '#fb9f7f', '#e061ae', '#66e0e4']
      })
    },
    drawLine (BarValue, BarData) {
      let myChart = this.$echarts.init(
        document.getElementById('myChartHuiyuan')
      )
      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: BarValue,
          name: '日期' // x轴名称
        },
        yAxis: {
          type: 'value',
          name: '会员数' // y轴名称
        },
        series: [
          {
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
          }
        ]
      })
    },
    getorder (type) {
      var getLastDay = ''
      if (type === 0) {
        getLastDay = 1
      }
      this.$router.push('/orderList?type=' + type + '&getLastDay=' + 1)
    },
    handlePropose (url) {
      window.open(url, '_blank')
    }
  },
  computed: {
    processed () {
      let num = this.baseList.filter(item => item.flag === 0).length
      return this.waitDelivery + this.productIsExceptionCount + num
      console.log(num)
    }
  }
}
</script>

<style lang="scss" scoped>
$bgc: #f5f8fc;
.el-carousel {
  /deep/ .el-carousel__button {
    background-color: #1985ff !important;
  }
}

.el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.el-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.base-row {
  margin-bottom: 16px;
}
.col-title {
  img {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-bottom: 5px;
  }
  span {
    font-size: 12px;
    color: #999999;
  }
}
.base-col {
  .col-container {
    background-color: #fff;
    margin-right: 16px;
    background: #ffffff;
    border-radius: 8px;
    .con-title {
      padding: 20px 20px 6px;
      color: #333;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 600;
      span {
        font-size: 12px;
        font-weight: 400;
        color: #666;
      }
    }
    .con-content {
      padding-bottom: 20px;
    }
    .progress {
      position: relative;
      // height: 354px;
      height: 300px;
      display: flex;
      align-items: center;
      .el-progress {
        margin: auto;
        /deep/.el-progress-circle {
          width: 180px !important;
          height: 180px !important;
        }
      }
      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        p {
          color: #333;
          font-size: 14px;
          text-align: center;
        }
        .text-color {
          font-size: 48px;
          color: #ffa703;
          font-weight: bold;
        }
      }
      .progress-tip {
        position: absolute;
        left: 50%;
        bottom: 27px;
        transform: translateX(-50%);
        img {
          margin-left: 10px;
          width: 10px;
          height: 12px;
          display: inline-block;
          vertical-align: baseline;
        }
      }
      .progress-tips {
        position: absolute;
        left: 50%;
        bottom: 0px;
        transform: translateX(-50%);
        font-size: 12px;
        color: #999999;
        width: 80%;
      }
    }
    .opera {
      height: 300px;
      background-color: #f5f8fc;
      overflow: hidden;
      border-radius: 8px;
      img {
        margin: 40px auto;
        display: block;
        width: 104px;
        height: 104px;
      }
      p {
        font-size: 14px;
        text-align: center;
        color: #333;
        line-height: 30px;
      }
      .opera-num {
        line-height: 58px;
        font-size: 38px;
        font-weight: 400;
      }
    }
    .col-order {
      border-left: 16px solid #fff;
      border-right: 16px solid #fff;
    }
    .col-info {
      flex: 1;
      padding: 20px;
      height: 160px;
      background-color: #f5f8fc;
    }
    .Info {
      display: flex;
    }
    .orderInfo {
      padding: 16px 20px;
      background-color: #f5f8fc;
      border-radius: 8px;
      .info-title {
        margin-bottom: 15px;
        line-height: 13px;
        img {
          margin-right: 0;
          width: 16px;
          height: 16px;
          vertical-align: text-top;
        }
      }
      .info-content {
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        .info-item {
          flex: 1;
          .item-title {
            img {
              margin-left: 0;
              width: 14px;
              height: 14px;
              vertical-align: top;
              cursor: pointer;
            }
          }
          .item-num {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  .col-content {
    .col-tell {
      display: flex;
      padding: 0 20px;
      align-items: center;
      width: 100%;
      height: 104px;
      background-color: #fff;
      margin-bottom: 16px;
      border-radius: 8px;
      img {
        margin-right: 20px;
        width: 56px;
        height: 56px;
      }
      .tell-text {
        color: #333;
        font-size: 14px;
        font-weight: 500;
        line-height: 30px;
        .text-num {
          font-size: 12px;
        }
      }
    }
    .col-product {
      padding: 20px;
      height: 255px;
      background-color: #fff;
      color: #333;
      box-sizing: border-box;
      border-radius: 8px;
      .product-name {
        margin-bottom: 22px;
        font-size: 16px;
      }
      .product-proItem {
        display: flex;
        padding: 10px 0 5px 0;
        border-bottom: 1px solid #f5f5f5;
        span {
          width: 100%;
        }
        .product-proItem-1 {
          // display: flex;
          width: 100%;
        }
        &:nth-last() {
          border-bottom: none;
        }
        .proItem-date {
          font-size: 16px;
          padding-right: 14px;
          line-height: 40px;
          border-right: 1px solid #f5f5f5;
          display: inline-block;
          width: 50px;
          vertical-align: top;
        }
        .proItem-r {
          width: calc(100% - 55px);
          display: inline-block;
          // flex: 1;
          // overflow: hidden;
        }
        p {
          padding-left: 14px;
          font-size: 10px;
          color: #666;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .proItem-name {
          font-size: 12px;
          font-weight: 600;
        }
        .proItem-text {
          /deep/ p {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
          }
        }
      }
    }
  }
  .base-item {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    .item-l {
      line-height: 36px;
      .l-img {
        margin-right: 8px;
        width: 16px;
        height: 16px;
      }
      .l-name {
        margin-right: 16px;
        color: #333;
        font-size: 14px;
      }
      .l-text {
        color: #666;
        font-size: 12px;
      }
    }
    .item-btn {
      font-size: 14px;
    }
  }
  .mall-container {
    margin-top: 10px;
    position: relative;
    width: 100%;
    height: 379px;
    background-color: #fff;
    border-radius: 8px;
    .tableA {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      justify-content: space-between;
    }
    .tableB {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      justify-content: space-between;
    }
  }
  .bulletin {
    padding: 20px;
    height: 434px;
    background: #ffffff;
    border-radius: 8px;
    .bulletin-title {
      font-size: 16px;
      margin-bottom: 22px;
    }
    .bulletin-item {
      font-size: 12px;
      line-height: 26px;
      cursor: pointer;
      position: relative;
      img {
        position: absolute;
        left: -16px;
        top: 7px;
      }
      &:hover {
        color: #3e8ef7;
      }
    }
  }
  .footer {
    display: flex;
    height: 349px;
    background: none;
    .common,
    .propose {
      flex: 1;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
    }
    .common {
      margin-right: 16px;
      .footer-content {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        padding: 40px 0;
        .content-item {
          flex: 0 0 25%;
          margin-bottom: 40px;
          cursor: pointer;
          img {
            display: block;
            width: 64px;
            height: 64px;
            margin: 0 auto 8px;
          }
          p {
            text-align: center;
            color: #333;
            font-weight: 600;
          }
        }
      }
    }
    .footer-title {
      display: flex;
      justify-content: space-between;
      color: #333;
      font-size: 16px;
      font-weight: 600;
      font-family: PingFangSC-Medium;
      .title-edit {
        color: #1985ff;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .propose {
      .propose-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-content: flex-start;
        padding: 30px 0;
      }
      .propose-item {
        display: flex;
        justify-content: space-between;
        padding: 24px;
        flex: 0 0 48%;
        height: 106px;
        background-color: #f5f5f5;
        margin-bottom: 30px;
        border-radius: 8px;
        cursor: pointer;
        .item-l {
          .l-name {
            color: #333;
            line-height: 30px;
            font-weight: 600;
          }
          .l-text {
            font-size: 12px;
            color: #666;
          }
        }
        img {
          width: 60px;
          height: 60px;
        }
      }
    }
  }
  .study {
    padding: 20px;
    height: 349px;
    .study-title {
      font-size: 16px;
      color: #333;
      margin-bottom: 36px;
    }
    .study-item {
      display: flex;
      color: #333;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 30px;
      img {
        width: 56px;
        height: 56px;
        margin-right: 10px;
      }
      .item-text {
        color: #666;
        font-size: 12px;
        font-weight: 400;
      }
      p {
        line-height: 20px;
        &.item-name {
          line-height: 1;
        }
      }
    }
  }
}
.product-proItem-content {
  font-size: 12px;
  line-height: 22px;
}
</style>
