<template>
  <div class="wapper">
    <div class="financeInfo">
      <ul>
        <li v-if="orgType!=3" v-cloak>
          <h2 class="mb20">
            <img src="~@/assets/img/iconzf1.png" />预存账户
             <i class="tip_icon">
              <span class="tip">礼品公司账户可微信、支付宝充值及线下汇款</span>
            </i>
          </h2>
          <div class="price">
            <span>￥</span>
            {{balanceYuan }}
          </div>
          <div class="btn">
            <el-button type="primary" @click="rechargeCash">充值</el-button>

          </div>

          <div class="financelWarn">
            <div class="financelWarnitem">
              余额预警
              <div class="right-switch" @click="editSwitch()" :class="isOn == false ? 'off' : ''">
                <div class="switch"></div>
              </div>
            </div>
            <div class="financelWarnitem">
              预警阈值：{{warnPrice}}
              <span class="s1" @click="handledialogWarin">修改</span>
            </div>
          </div>
        </li>
          <li class="priceItem3">
          <h2 class="mb20">
            <img src="~@/assets/img/iconzf3.png" />现金账户（元） <i class="tip_icon">
              <span class="tip">移动端开通微信混合支付后，用户支付的现金会进入到驿宝通微信账户，礼品公司可提现（收取手续费）</span>
            </i>
          </h2>
          <div class="price">￥{{balanceCashYuan}}</div>
          <div class="btn">
            <el-button type="primary" @click="manage">提现</el-button>

          </div>
        </li>
        <li class="priceItem2" v-if="orgType!=3" v-cloak>
          <h2 class="mb20">
            <img src="~@/assets/img/iconzf2.png" /> 收入/支出（元）
             <el-radio-group v-model="tabPosition" size="mini">
              <el-radio-button label="1" >昨日</el-radio-button>
              <el-radio-button label="2">近7天</el-radio-button>
              <el-radio-button label="3">近30天</el-radio-button>
            </el-radio-group>
          </h2>

          <div class="price" v-if="tabPosition==1">
            收入：￥{{incomeDayAmount }}<br>支出：￥{{outcomeDayAmount }}
          </div>
          <div
            class="price"  v-if="tabPosition==2"
          >
            收入：￥{{incomeWeekAmount }}<br>支出：￥{{outcomeWeekAmount }}
         </div>
          <div
            class="price"  v-if="tabPosition==3"
          >
          收入：￥{{incomeMonthAmount }}<br>支出：￥{{outcomeMonthAmount }}
         </div>
        </li>

      </ul>
    </div>
    <h2 class="mb20">
      账户管理
      <i class="tip_icon">
        <span class="tip">本页面主要用于礼品公司与驿宝通对账</span>
      </i>
    </h2>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="起止日期" class="formItem">
        <el-date-picker
          v-model="form.orderTime"
          type="datetimerange"
          :picker-options="pickerOptions1"

          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="selectTimeOrderTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="交易内容" class="formItem">
        <el-input v-model.trim="form.key" placeholder="请输入" class="w150"></el-input>
      </el-form-item>-->
      <el-form-item label="交易类型" class="formItem">
        <el-select v-model="form.jyType" class="w90" @change="getkey">
          <el-option label="全部" value></el-option>
          <el-option label="收入" value="1"></el-option>
          <el-option label="支出" value="2"></el-option>
          <!-- <el-option label="物流单号" value="danhao"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="交易内容" class="formItem">
          <el-input
            v-model="form.orderNo"
            placeholder="请输入交易内容或订单编号"
            class="w210"
          ></el-input>
        </el-form-item>
      <el-form-item class="formItem">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="importReport">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableDataA"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="serialNo" label="交易流水号" width="180"></el-table-column>
      <el-table-column prop="siteName" label="商城名称" width="150"></el-table-column>
      <el-table-column prop="operTime" label="交易时间" width="180"></el-table-column>
      <el-table-column prop="dealType" label="交易类型" width="100"></el-table-column>
      <el-table-column prop="abstractType" label="交易内容">
         <template slot-scope="scope">
           {{scope.row.abstractType}} <a :href="scope.row.attachment" target="_blank" v-if="scope.row.attachment!='' && scope.row.attachment!=null" style="margin-left:10px">查看附件</a>
         </template>
      </el-table-column>
      <el-table-column prop="type" label="账户类型" width="180"></el-table-column>
      <el-table-column prop="amount" label="账户变动金额（元）" width="150"></el-table-column>
      <el-table-column prop="endBalanceYuan" label="预存账户余额（元）"></el-table-column>
      <el-table-column prop="operStatus" label="到账状态">
        <template slot-scope="scope">
          <span v-if="scope.row.abstractType === abstractType && scope.row.operStatus == 0">未审核</span>
          <span v-else-if="scope.row.abstractType === abstractType && scope.row.operStatus == 1">已审核</span>
          <span v-else-if="scope.row.abstractType === abstractType && scope.row.operStatus == 2">已拒绝</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
    ></el-pagination>

    <el-dialog title="充值" :visible.sync="isshowrecharge" width="600px" :closeOnClickModal="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="公司名称">VIBOT平台</el-form-item>
        <el-form-item label="充值金额" required>
          <el-input
            v-model.trim="form.rechargePrice"
            class="w120"
            @blur="valid(form.rechargePrice)"
          ></el-input>&nbsp;元，
          <span class="color1">提示：最小充值金额为100元</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <div class="payIcon weixinPannel" :class="{'select':type==1}" @click="payment(1)">
            <div class="wxicon"></div>微信支付
            <span class="tjicon"></span>
          </div>
          <div class="payIcon zhifubaoPannel" :class="{'select':type==2}" @click="payment(2)">
            <div class="zfbicon"></div>支付宝支付
            <span class="tjicon"></span>
          </div>
          <div class="payIcon zaixianPannel" :class="{'select':type==3}" @click="payment(3)">
            <div class="zxzficon"></div>线下汇款
          </div>
        </el-form-item>
        <el-form-item class="textRight">
          <el-button @click="isshowrecharge = false">取消</el-button>
          <el-button type="primary" @click="save" :disabled="disabled">立即支付</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="payTitle"
      :visible.sync="isshowPay"
      width="500px"
      :closeOnClickModal="false"
      :beforeClose="handleClose"
      @close="handleIsshowPay"
      class="paymentStyle"
      :class="{paybgc: type == 2}"
    >
      <div class="modelPay">
        <div class="modelPayL">
          <div class="d1">
            支付金额
            <span>{{form.rechargePrice}}</span>元
          </div>
          <div class="d2">
            <div class="ewm">
              <div id="qrcode1" class="qrcodeitem" v-html="qrcode1"></div>
            </div>
          </div>
          <div class="d3">使用{{payTitle}}扫二维码支付</div>
          <div class="d4">
            <a @click="save()">刷新</a>二维码
          </div>
        </div>
        <div class="modelPayR">
          <img src="~@/assets/img/weiXinPhone.png" v-show="type==1" />
          <img src="~@/assets/img/alipayPhone.png" v-show="type==2" />
        </div>
        <div class="modelPayBtn">
          <el-button type="primary" @click="successAlipay">完成支付</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 线下汇款 -->
    <el-dialog
      title="线下汇款"
      :visible.sync="isshowxianxia"
      width="600px"
      :closeOnClickModal="false"
      :beforeClose="handleClosexianxia"
      class="paymentStyle"
    >
      <div class="modelPay">
        <div class="paytitle">请您通过网银转账，或者自行到银行进行汇款，汇款账号如下：</div>
        <div class="payContent">
          <ul>
            <li>开户名称：武汉市驿宝通网络科技有限公司</li>
            <li>开户银行：招商银行武汉分行南湖支行</li>
            <li>银行账号：127908554310203</li>
          </ul>
        </div>
        <div class="paytitle">汇款后请填写您汇款的金额及银行交易单号：</div>
        <div class="payContent">
          <ul>
            <li>
              汇款金额：
              <span style="color:#ff4200">￥{{form.rechargePrice}}</span>
            </li>
            <li>
              入账金额：
              <span style="color:#ff4200">￥{{form.rechargePrice}}</span>
            </li>
            <li>
              汇款底单：
              <el-upload
                class="avatar-uploader"
                :action="url"
                :show-file-list="false"
                :headers="myHeaders"
                :on-success="handleUploadSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </li>
            <li>（汇款底单需清晰可见。照片内容真实有效，不得做任何修改。支持.jpg .jpeg .bmp .gif .png格式照片，大小不超过1M。）</li>
          </ul>
        </div>
        <div class="modelPayBtn">
          <el-button type="primary" :disabled="remittanceBtn" @click="successRemittance">我已汇款</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="预警阈值修改" :visible.sync="dialogWarin" width="550px">
      <el-form :model="warnform" :rules="rules" ref="ruleForm">
        <el-form-item label>
          <span style="font-weight: bold;">注意：当账户余额小于该值时，每天短信提醒一次,费用由您自己承担。</span>
        </el-form-item>
        <el-form-item label="账户余额预警阈值设置："  label-width="180px"  prop="price">
            <el-input-number v-model="warnform.price" controls-position="right" :min="0"></el-input-number>
          &nbsp;元
        </el-form-item>
         <el-form-item label="接收提醒的手机号："  label-width="180px"   prop="phone">
            <el-input v-model="warnform.phone" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="dialogWarinclick('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 管理提现 -->
    <el-dialog
      title="管理"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogAdminister"
      :before-close="handleAdministerClose"
      top="10vh"
      width="60vw"
      class="dialogAdm"
    >
      <administerWithDrawal
        @close="handleAdministerClose"
        v-if="organizationType === 4"
        ref="withDrawal"
      ></administerWithDrawal>

      <administerAudit v-if="organizationType === 2 || organizationType === 1"></administerAudit>
    </el-dialog>
    <!-- <orgRecharge ref="rechargeInfo" @orgAccountInfo="orgAccountInfo"></orgRecharge> -->
  </div>
</template>

<script>
// import orgRecharge from '@/components/recharge/orgRecharge'
import administerWithDrawal from '@/components/Administer/administer_withdrawal'
import administerAudit from '@/components/Administer/administer_audit'
import { checkToPrice } from '@/utils/validate'
import QRCode from 'qrcodejs2'
export default {
  name: 'orderList',
  data () {
    var validateSelectNum = (rule, value, callback) => {
      let reg = /^\d{11}$/
      if (!value) {
        return callback(new Error('请输入接收提醒的手机号'))
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }, 500)
    }
    return {
      tabPosition: '1',
      rules: {
        price: [
          { required: true, message: '请设置账户余额预警阈值', trigger: 'blur' }
        ],
        phone: [
          {required: true, validator: validateSelectNum, trigger: 'blur'}
        ]
      },
      dialogWarin: false,
      warnform: {
        price: '',
        phone: ''
      },
      warnPrice: '0.00',
      isshowxianxia: false,
      isshowrecharge: false,
      pickerOptions1: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      form: {
        orderTime: '',
        key: '',
        jyType: '',
        rechargePrice: '',
        orderNo: ''
      },
      type: 1,
      tableDataA: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      exportOrderFlag: true,
      payTitle: '微信支付',
      isshowPay: false,
      orgId: '',
      organizationType: '', // 机构类型 4: 3级机构 3: 2级机构 2: 1级机构
      balanceYuan: 0,
      incomeDayAmount: '0',
      incomeMonthAmount: '0',
      incomeWeekAmount: '0',
      outcomeDayAmount: '0',
      outcomeMonthAmount: '0',
      outcomeWeekAmount: '0',
      balanceCashYuan: '0',
      qrcode1: '',
      disabled: false,
      orgType: 3,
      url: '',
      imageUrl: '',
      isOn: false,
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },
      remittanceBtn: false, // 汇款按钮状态
      abstractType: '额度充值-线下充值-0', // 类型线下汇款
      dialogAdminister: false // 管理机构提现
    }
  },
  mounted () {
    this.mallSiteInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.orgId = this.mallSiteInfo.organizationIds
    this.organizationType = this.mallSiteInfo.sysOrganization.type
    this.myAccount()
    this.myAccountRpt()
    this.getRechargeFlow()
    this.myCashAccount()
    this.handleWarinInfo()
  },
  created () {
    this.init()
    if (this.$route.params.flag) {
      this.rechargeCash()
    }
    console.log(this.$route.query)
    if (this.$route.query.manage) {
      this.manage()
    }
  },
  watch: {
    dialogWarin () {
      if (this.dialogWarin === false) {
        this.warnform.price = ''
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.dialogWarin = false
      this.$refs[formName].resetFields()
    },
    handledialogWarin () {
      this.warnform.price = this.warnPrice
      this.dialogWarin = true
    },
    // 获取账户余额预警信息
    handleWarinInfo () {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/saasorgthreshold/getOrgThresholdByOrgId'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId
          }, true
        )
      }).then((res) => {
        console.log(res)
        if (res.data.thresholdInfo && res.data.code === 0) {
          this.warnPrice = res.data.thresholdInfo.thresholdYuan ? res.data.thresholdInfo.thresholdYuan : '0.00'
          this.isOn = res.data.thresholdInfo.status == '1'
          this.warnform.phone = res.data.thresholdInfo.mobile
        }
        console.log(this.warnPrice, this.isOn)
      })
    },
    // 预警值设置
    dialogWarinclick (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.warnform.price) {
            this.warnPrice = '0.00'
          } else {
            this.warnPrice = this.warnform.price
          }
          this.dialogWarin = false
          this.$http({
            url: this.$http.adornUrl(
          '/ybt-backend/finance/saasorgthreshold/changeWarning'
            ),
            method: 'post',
            data: this.$http.adornData(
              {
                orgId: this.orgId,
                status: this.isOn ? '1' : '0',
                thresholdYuan: this.warnPrice,
                mobile: this.warnform.phone
              },
          true
        )
          }).then(res => {
            console.log(res)
            this.handleWarinInfo()
            this.$message.success('已设定预警值')
          })
        } else {
          return false
        }
      })
    },
    // 开关显示
    editSwitch () {
      this.isOn = !this.isOn
      if (this.isOn) {
        this.dialogWarin = true
      }
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/saasorgthreshold/changeWarning'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId,
            status: this.isOn ? '1' : '0',
            thresholdYuan: this.warnPrice,
            mobile: this.warnform.phone
          },
          true
        )
      }).then(res => {
        this.handleWarinInfo()
        console.log(res)
      })
    },
    init () {
      this.url = this.$http.adornUrl('/ybt-backend/sys/oss/upload')
    },
    handleChange (file, fileList) {
      this.submitUpload()
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleUploadSuccess (response, file, fileList) {
      console.log(response)
      if (response.code === 500) {
        this.$message.error('请按照正确的格式上传')
      }
      this.imageUrl = response.url
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    handleClose () {
      this.isshowPay = false
      var canvas = document.getElementById('qrcode1')
      canvas.innerHTML = ''
      this.myAccount()
      this.myAccountRpt()
      this.getRechargeFlow()
    },
    handleClosexianxia () {
      this.isshowxianxia = false
    },
    successAlipay () {
      this.isshowPay = false
      var canvas = document.getElementById('qrcode1')
      canvas.innerHTML = ''
      this.myAccount()
      this.myAccountRpt()
      this.getRechargeFlow()
    },
    successRemittance () {
      var _this = this
      console.log(_this.imageUrl)
      if (!_this.imageUrl) {
        return this.$message.error('请上传汇款底单！')
      }
      _this.remittanceBtn = true
      _this.$http({
        url: _this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/selfRecharge'
        ),
        method: 'post',
        data: _this.$http.adornData(
          {
            amount: _this.form.rechargePrice,
            orgId: _this.orgId,
            remarks: '线下汇款',
            abstractType: '线下汇款',
            attachment: _this.imageUrl
          },
          true
        )
      })
        .then(res => {
          this.isshowxianxia = false
          this.imageUrl = ''
          this.type = 1
          this.myAccount()
          this.myAccountRpt()
          this.getRechargeFlow()
          this.myCashAccount()
          setTimeout(() => {
            _this.remittanceBtn = false
          }, 1000)
        })
    },
    qrcode (url) {
      var canvas = document.getElementById('qrcode1')
      canvas.innerHTML = ''
      var qrcode = new QRCode(canvas, {
        width: 180,
        height: 180, // 高度
        text: url // 二维码内容
      })
      console.log(qrcode)
    },
    getkey (id) {
      console.log(id)
      this.form.jyType = id
    },
    myAccount () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/orgaccount/myAccount'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.balanceYuan = res.data.account.balanceYuan
          // orgType 2 驿宝通  3 运营中心 4 礼品公司
          this.orgType = res.data.orgType
        }
      })
    },
    myCashAccount () {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/myCashAccount'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.balanceCashYuan = res.data.account.balanceYuan
        }
      })
    },

    myAccountRpt () {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/myAccountRpt'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.incomeDayAmount = res.data.myAccountRpt.incomeDayAmount
          this.incomeMonthAmount = res.data.myAccountRpt.incomeMonthAmount
          this.incomeWeekAmount = res.data.myAccountRpt.incomeWeekAmount
          this.outcomeDayAmount = res.data.myAccountRpt.outcomeDayAmount
          this.outcomeMonthAmount = res.data.myAccountRpt.outcomeMonthAmount
          this.outcomeWeekAmount = res.data.myAccountRpt.outcomeWeekAmount
        }
      })
    },
    getRechargeFlow () {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/listRechageFlow'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            startDate:
              this.form.orderTime === null || this.form.orderTime === ''
                ? ''
                : this.form.orderTime[0],
            endDate:
              this.form.orderTime === null || this.form.orderTime === ''
                ? ''
                : this.form.orderTime[1],
            orgId: this.orgId,
            dealType: this.form.jyType,
            orderNo: this.form.orderNo,
            // key: this.form.key,
            page: this.pageIndex,
            limit: this.pageSize
          },
          true
        )
      }).then(res => {
        console.log('表格', res)
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.page.list.length; index++) {
            const element = res.data.page.list[index]
            element.dealType = element.dealType === '1' ? '收入' : '支出'
            element.type = element.type === '01' ? '预存款账户' : '现金账户'
          }
          this.tableDataA = res.data.page.list
          this.totalPage = res.data.page.totalCount
        }
      })
    },
    orgAccountInfo () {
      // this.getOrderList()
    },
    recharge () {
      // this.$refs.rechargeInfo.getOrderList(1)
      // this.$refs.rechargeInfo.dialogRecharge = true
      this.form.rechargePrice = ''
      this.isshowrecharge = true
    },
    rechargeCash () {
      this.form.rechargePrice = ''
      this.isshowrecharge = true
    },
    valid (price) {
      this.form.rechargePrice = checkToPrice(price)
    },
    payment (type) {
      this.type = type
      if (type === 2) {
        this.payTitle = '支付宝支付'
      }
    },
    manage () {
      // this.$message("正在开发中，敬请期待哦！");
      this.dialogAdminister = true
    },
    save () {
      var _this = this
      if (_this.form.rechargePrice === '') {
        _this.$message.error('请填写充值金额')
        return false
      }
      // if (_this.form.rechargePrice < 100) {
      // _this.$message.error('最小充值金额为100元,请重新填写')
      // return false
      // }
      _this.disabled = true
      if (_this.type === 3) {
        _this.isshowrecharge = false
        _this.isshowxianxia = true
        _this.disabled = false
      } else if (_this.type === 2) {
        _this
          .$http({
            url: _this.$http.adornUrl(
              '/ybt-backend/finance/orgaccount/alipayCreateRechargeOrder'
            ),
            method: 'post',
            data: _this.$http.adornData(
              {
                amount: _this.form.rechargePrice,
                orgId: _this.orgId,
                remarks: '支付宝充值',
                abstractType: '支付宝充值',
                payWay: 'alipay'
              },
              true
            )
          })
          .then(res => {
            if (res && res.data.code === 0) {
              // 关闭弹窗
              _this.isshowrecharge = false
              // 开启扫码弹框
              _this.isshowPay = true
              // 关闭重复提交
              _this.disabled = false
              clearTimeout(_this.timer)
              _this.timer = setTimeout(() => {
                _this.qrcode(res.data.codeUrl)
              }, 1000)
            } else {
              _this.disabled = false
              _this.$message.error(res.data.msg)
            }
          })
      } else {
        _this
          .$http({
            url: _this.$http.adornUrl(
              '/ybt-backend/finance/orgaccount/wxCreateRechargeOrder'
            ),
            method: 'post',
            data: _this.$http.adornData(
              {
                amount: _this.form.rechargePrice,
                orgId: _this.orgId,
                remarks: '微信充值',
                abstractType: '微信充值',
                payWay: _this.type === 1 ? 'wx' : 'alipay'
              },
              true
            )
          })
          .then(res => {
            if (res && res.data.code === 0) {
              _this.isshowrecharge = false
              _this.isshowPay = true
              _this.disabled = false
              clearTimeout(_this.timer)
              _this.timer = setTimeout(() => {
                _this.qrcode(res.data.codeUrl)
              }, 1000)
            } else {
              _this.disabled = false
              _this.$message.error(res.data.msg)
            }
          })
      }
    },
    handleIsshowPay () {
      // 重置默认充值状态
      this.payTitle = '微信支付'
      this.type = 1
    },
    search () {
      this.pageIndex = 1
      this.getRechargeFlow()
    },
    // 导出
    importReport () {
      if (this.form.orderTime === null || this.form.orderTime === '') {
        this.$message.error('请选择起止日期')
        return false
      }
      if (this.exportOrderFlag === false) return
      this.exportOrderFlag = false

      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/exportRechageFlow'
        ),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            startDate:
              this.form.orderTime === null || this.form.orderTime === ''
                ? ''
                : this.form.orderTime[0],
            endDate:
              this.form.orderTime === null || this.form.orderTime === ''
                ? ''
                : this.form.orderTime[1],
            orgId: this.orgId,
            orderNo: this.form.orderNo,
            dealType: this.form.jyType
            // key: this.form.key,
          },
          true
        )
      }).then(res => {
        if (res) {
          let blob = new Blob([res.data], {
            type: 'application/x-xls',
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = '交易明细.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.exportOrderFlag = true
        }
      })
    },
    //  下单时间
    selectTimeOrderTime (val) {
      console.log(val)
      this.form.orderTime = val
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getRechargeFlow()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getRechargeFlow()
    },
    // 关闭提现弹窗
    handleAdministerClose () {
      this.dialogAdminister = false
      this.$refs.withDrawal.extractMoney = ''
      this.$refs.withDrawal.cashExtractMoney = ''
    }
  },
  components: {
    administerWithDrawal,
    administerAudit
    // orgRecharge
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  h2 {
    border-left: 4px solid #3E8EF7;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
  }
  .financeInfo {
    h2 {
      height: 27px;
      border-left: 0;
      color: #333333;
      img {
        width: 27px;
        height: 27px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    ul {
      font-size: 0;
      margin-bottom: 20px;
      li {
        display: inline-block;
        height: 178px;
        // min-width: 360px;
        width: calc(33.33% - 30px);
        border: 1px solid #d7e0f1;
        background-color: #ffffff;
        vertical-align: top;
        margin-right: 30px;
        padding: 20px;
        padding-left: 0;
        position: relative;
        .btn {
        position: absolute;
        left: 20px;
        bottom: 11px;
        }
        .price {
          font-size: 40px;
          font-weight: 400;
          line-height: 58px;
          color: rgba(51, 51, 51, 1);
          text-align: left;
          padding: 0;
          padding-left: 10px;
          span {
            font-size: 30px;
          }
        }
        &.priceItem2 {
          .price {
            font-size: 15px;
            line-height: 30px;
            text-align: left;
            padding: 0 20px;
          }
        }
        &.priceItem3 {
          .tip {
            left: -134px;
            top: 25px;
          }
        }
      }
    }
    .financelWarn {
      position: absolute;
      right: 10px;
      bottom: 5px;
      font-size: 12px;
      .financelWarnitem {
        line-height: 23px;
        .right-switch {
          position: relative;
          float: right;
          width: 35px;
          height: 20px;
          background-color: #00aa72;
          border-radius: 30px;
          cursor: pointer;
          transition: 0.2s;
          span {
            position: absolute;
            display: inline-block;
            height: 25px;
            line-height: 25px;
            top: 0;
            transform: translateX(13px);
            transition: 0.2s linear;
          }
          .switch {
            transition: 0.2s;
            margin-left: 16px;
            margin-top: 1px;
            width: 18px;
            height: 18px;
            background-color: #fff;
            border-radius: 50%;
          }
          &.off {
            background-color: #d9d9d9;
            .switch {
              margin-left: 1px;
            }
            span {
              transform: translateX(30px);
            }
          }
        }
        span.s1 {
          color: #3e98f6;
          cursor: pointer;
        }
      }
    }
  }
  .payIcon {
    cursor: pointer;
    width: 147px;
    height: 59px;
    line-height: 59px;
    border-radius: 8px;
    position: relative;
    text-align: left;
    padding-left: 12px;
    display: inline-block;
    vertical-align: top;
    font-size: 17px;
    font-weight: 400;
    margin-right: 15px;
    color: rgba(255, 255, 255, 1);
    .tjicon {
      width: 42px;
      height: 20px;
      background: url('~@/assets/img/tj.png') no-repeat center top;
      background-size: contain;
      position: absolute;
      right: 0;
      display: inline-block;
      top: 0px;
      display: none;
    }
    .wxicon {
      background: url('~@/assets/img/pay1.png') no-repeat center top;
      background-size: contain;
      width: 34px;
      height: 30px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 9px;
    }
    .zfbicon {
      background: url('~@/assets/img/pay2.png') no-repeat center top;
      background-size: contain;
      width: 30px;
      height: 30px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 9px;
    }
    .zxzficon {
      background: url('~@/assets/img/pay3.png') no-repeat center top;
      background-size: contain;
      width: 39px;
      height: 34px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 9px;
    }
    &.select {
      width: 147px;
      height: 59px;
      border-radius: 8px;
      box-shadow: 0px 2px 12px rgba(27, 60, 116, 0.3);
      position: relative;
      top: -10px;
    }
    &.weixinPannel {
      background: #1cac1c;
    }
    &.zhifubaoPannel {
      background: #3e98f6;
    }
    &.zaixianPannel {
      background: #f99028;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .modelPayL,
  .modelPayR {
    width: 228px;
    height: 305px;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    .d1,
    .d3,
    .d4 {
      font-size: 16px;
      color: #3c3c3c;
      letter-spacing: -0.24px;
      margin-bottom: 10px;
      span {
        font-size: 20px;
        color: red;
        letter-spacing: -0.24px;
        line-height: 14px;
      }
      a {
        cursor: pointer;
      }
    }
    .d2 {
      width: 200px;
      height: 200px;
      overflow: hidden;
      display: inline-block;
    }
  }
  .modelPayR {
    text-align: right;
  }
  .modelPayBtn {
    text-align: center;
  }
}
.paymentStyle {
  /deep/ .el-dialog__header {
    width: 100%;
    height: 50px;
    background: rgba(0, 170, 114, 1);
    text-align: center;
    line-height: 50px;
    padding: 0;
    .el-dialog__close {
      color: #ffffff;
    }
    .el-dialog__title {
      color: #ffffff;
    }
  }
  .ewm {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    .qrcodeitem {
      text-align: center;
      width: 100%;
      height: 100%;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
}
.paybgc {
  /deep/ .el-dialog__header {
    background: #3e98f6;
  }
  /deep/ .el-button--primary {
    background: #3e98f6;
  }
}
.paytitle {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}
.payContent {
  li {
    padding: 5px 0;
  }
}
.upload-demo {
  display: inline-block;
  vertical-align: top;
}
/deep/ .avatar-uploader {
  display: inline-block;
  vertical-align: top;
}
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 127px;
  height: 127px;
  line-height: 127px !important;
  text-align: center;
}
.avatar {
  width: 127px;
  height: 127px;
  display: block;
}
.dialogAdm {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
