<template>
  <div class="wapper">
    <h2 class="mb20">
    短信统计
    <span class="s2">更新时间：{{creattiem}}</span>
      <!-- <i class="tip_icon">
        <span class="tip">购买短信套餐后下面的商城可使用公司的短信进行消费（验证码短信）；购买短信套餐后扣除的是公司的账户额度</span>
      </i> -->
    </h2>
    <div>
      <span class="s2">剩余条数：</span>
      <div class="font32">{{messageNum}}</div>
      <span class="s2">已使用条数：</span>
      <div class="font32">{{useNum}}</div>
      <el-button
        type="primary"
        style="vertical-align: super;"
        class="ml10"
        @click="dialogFormVisible=true"
      >充值</el-button>
    </div>
    <el-tabs v-model="activeName"  @tab-click="handleTabClick" class="wapper_tabs">
      <el-tab-pane name="first" label="短信应用管理" class="tabs_second">
        <el-tabs v-model="siteName" type="card" @tab-click="handleSiteNameClick">
          <el-tab-pane :label="mall.siteName" :name="mall.id" v-for="mall in mallList" :key="mall.id"></el-tab-pane>
        </el-tabs>
         <h2>系统提醒</h2>
        <el-card class="box-card" shadow="always" v-for="(item,index) in saasMessageModulesList0.saasMessageCofs" :key="index">
          <div slot="header" class="clearfix">
            <span>{{item.secondModuleName}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(item)">去配置</el-button>
          </div>
          <div class="text item" :class="{'disable':item.sendType!='1'}">
            <i class="el-icon-check"></i>短信
          </div>
        </el-card>
         <!-- <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>用户余额阈值提醒</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(2,item)">去配置</el-button>
          </div>
          <div class="text item">
            <i class="el-icon-check"></i>短信
          </div>
        </el-card> -->
            <h2>营销关怀提醒</h2>
        <el-card class="box-card" shadow="always" v-for="(item,index) in saasMessageModulesList1.saasMessageCofs" :key="index">
          <div slot="header" class="clearfix">
            <span>{{item.secondModuleName}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(item)">去配置</el-button>
          </div>
          <div class="text item" :class="{'disable':item.sendType!='1'}">
            <i class="el-icon-check"></i>短信
          </div>
        </el-card>
         <!-- <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>礼包发放</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(4,item)">去配置</el-button>
          </div>
          <div class="text item">
            <i class="el-icon-check"></i>短信
          </div>
        </el-card> -->
            <h2>交易提醒</h2>
            <el-card class="box-card" shadow="always" v-for="(item,index) in saasMessageModulesList2.saasMessageCofs" :key="index">
              <div slot="header" class="clearfix">
                <span>{{item.secondModuleName}}&nbsp;&nbsp;<el-tag>{{index==0?'发送给自有供应商':'发送给会员'}}</el-tag></span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(item)">去配置</el-button>
              </div>
              <div class="text item" :class="{'disable':item.sendType!='1'}">
                <i class="el-icon-check"></i>短信
              </div>
            </el-card>
        <!-- <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>收到订单提醒&nbsp;&nbsp;<el-tag>发送给自有供应商</el-tag></span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(5,item)">去配置</el-button>
          </div>
          <div class="text item">
            <i class="el-icon-check"></i>短信
          </div>
        </el-card>
         <el-card class="box-card" shadow="always">
          <div slot="header" class="clearfix">
            <span>用户发起退款提醒&nbsp;&nbsp;<el-tag>发送给会员</el-tag></span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toConfig(6,item)">去配置</el-button>
          </div>
          <div class="text item">
            <i class="el-icon-check"></i>短信
          </div>
        </el-card> -->
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">
          商城短信管理
          <el-tooltip class="item" effect="light" content="公司下的各商城消费的短信条数，便于公司与各商城对账" placement="right">
            <i class="tip_icon"></i>
          </el-tooltip>
        </span>
        <p class="color2 mb20" style="line-height:20px">说明：短信可用于商城用户忘记密码获取验证码。您可设置每个站点使用不同短信签名进行发送短信</p>
        <div class="site-content">
          <div class="searchBlock">
            <div class="searchTable">
              <div class="tablescroll">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  v-loading="loading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  tooltip-effect="dark"
                  style="width: 100%"
                  :header-cell-style="{color:'#333',background:'#F5F7FA'}"
                >
                  <el-table-column prop="siteName" label="站点名称" width="300"></el-table-column>
                  <el-table-column prop="createDate" label="创建时间"></el-table-column>
                  <!-- <el-table-column prop="smsSign" label="签名配置">
                    <template slot-scope="scope">
                      {{scope.row.smsSign==null?'':scope.row.smsSign}}
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="states" label="操作" width="200">
                    <template slot-scope="scope">
                      <!-- <el-button @click="updateSignature(scope.row)" type="text" size="small">修改签名</el-button> -->
                      <el-button @click="detail(scope.row)" type="text" size="small">消费详情</el-button>
                      <!-- <div class="btnStatus">
                        <span @click="updateSignature(scope.row)">修改签名</span>
                      </div>-->
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"
                class="pagination"
              ></el-pagination>-->
            </div>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>

    <el-dialog title="购买短信套餐" :visible.sync="dialogFormVisible" width="650px">
      <el-form :model="form" label-width="50px">
        <el-form-item label="规格">
          <div class="smsList">
            <div
              class="smsItem"
              v-for="(item,index) in form.smsList"
              :key="index"
              :class="{'select':item.select==true}"
              @click="getNum(item)"
            >{{item.num}}条</div>
          </div>
          <p>短信条数购买成功后，即可生效，使用后剩余条数不支持退订</p>
        </el-form-item>
        <el-form-item label="费用">
          <span style="color: #ffa466;font-size: 32px;">￥{{payAmount}}</span>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="buySmsServ">立即购买</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 消费详情 -->
    <el-dialog title="消费详情" :visible.sync="dialogTableVisible" width="850px">
      <el-form :model="formxf" label-width="90px">
        <h1 class="xqtitle">概要</h1>
        <el-form-item label="累计消耗">{{formxf.messageNums}} 条</el-form-item>
        <h1 class="xqtitle">消费明细</h1>
        <el-form-item label="消费时间" class="formItem">
          <el-date-picker
            v-model="formxf.orderTime"
            type="datetimerange"
            :picker-options="pickerOptions1"
             format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="selectTimeOrderTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号" class="formItem" label-width="60px">
            <el-input v-model="formxf.phone" placeholder="请输入" class="w100" maxlength="11"/>
            <el-button type="primary" @click="search()">搜索</el-button>
        </el-form-item>
         <!-- <el-form-item label="短信类型" class="formItem">
            <el-select v-model="formxf.msgStatu" class="w80">
              <el-option label="全部" value></el-option>
              <el-option label="礼包" value="1"></el-option>
              <el-option label="积分" value="2"></el-option>
              <el-option label="验证码" value="3"></el-option>
            </el-select>
        </el-form-item> -->
        <el-table :data="gridData" class="mb20" height="150px">
          <el-table-column property="mobile" label="手机号"></el-table-column>
          <el-table-column property="createDate" label="消费时间"></el-table-column>
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
      </el-form>
    </el-dialog>
    <!-- 配置短信 -->
    <el-dialog :title="msgtitle" :visible.sync="msgVisible" class="msgcontent">
      <el-form :model="msgForm" label-width="100px">
        <el-form-item label="发送时间点:" class="formitem">
          <span>{{msgForm.sendOpportunity}}</span>
          <!-- <span v-if="msgType==1">用户登录时点击获取验证码校验成功后立即发送</span>
          <span v-if="msgType==2">机构账户余额低于设置的阈值后立即发送，每天发送一次</span>
          <span v-if="msgType==3">积分（白名单形式）发放后立即发送</span>
          <span v-if="msgType==4">礼包（白名单形式）发放后立即发送</span>
          <span v-if="msgType==5">收到订单后立即<i style="color:#E6A23C">发送给供应商</i></span>
          <span v-if="msgType==6">用户发起退款后立即<i style="color:#E6A23C">发送给会员（礼品公司）</i></span> -->
        </el-form-item>
        <el-form-item label="发送时间段:" class="formitem" v-if="msgType!=1">
          每日 <el-time-picker
                is-range
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                :picker-options="{
                 selectableRange: '18:30:00 - 20:30:00'
                }"
                v-model="msgValue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
         <el-form-item label="发送范围:" class="formitem">
          <span v-if="msgType==1 || msgType==3 || msgType==4">仅发送给&lt;{{siteUserName}}&gt;的员工</span>
          <span v-if="msgType==2">仅发送给设置的员工（&lt;设置的提醒手机号&gt;）<el-button type="text" @click="dialogWarinSatus">去修改手机号</el-button></span>
          <span v-if="msgType==5">仅发送给自有供应商</span>
          <span v-if="msgType==6">仅发送给会员</span>
        </el-form-item>
        <el-form-item label="发送方式:" class="formitem">
         <el-checkbox v-model="msgcheckbox" name="type" :disabled="msgType==1">手机短信（计费发送）</el-checkbox><span style="font-size:12px;color:#999999">{{msgType==1?'默认选中不可修改':'勾选后才可发送短信'}}</span><br>
         <div class="msgInfo">
            <div class="msgInfotxt">
              {{msgForm.content}}
            </div>
            <div  class="msgInfoline"></div>
         </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgVisible = false">取 消</el-button>
        <el-button type="primary" @click="msgclick">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 预警阈值修改 -->
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
  </div>
</template>
<script>
export default {
  name: 'index',
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
      msgType: 1,
      sendOpportunity: '',
      msgForm: {
      },
      msgtitle: '验证码',
      msgVisible: false,
      msgcheckbox: true,
      msgValue: ['08:00:00', '23:00:00'],
      siteName: '',
      siteUserName: '',
      gridData: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      pickerOptions1: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      formxf: {
        messageNums: 0,
        orderTime: '',
        phone: '',
        msgStatu: ''
      },
      dialogTableVisible: false,
      siteId: localStorage.getItem('pageSiteId'),
      dialogFormVisible: false,
      messageNum: 0,
      useNum: 0,
      // pageIndex: 1,
      // pageSize: 10,
      // totalPage: 0,
      tableData: [],
      loading: false,
      form: {
        smsList: [{
          num: 500,
          select: true
        },
        {
          num: 1000,
          select: false
        },
        {
          num: 2000,
          select: false
        },
        {
          num: 5000,
          select: false
        },
        {
          num: 10000,
          select: false
        }]
      },
      smsNum: '500',
      payAmount: '25.00',
      activeName: 'first', // 选项卡
      // mallCheckAll: false, // 全选
      isIndeterminate: true,
      // checkedmall: [], // 商城已选中id
      mallList: [], // 所有商城
      saasMessageModulesList0: [],
      saasMessageModulesList1: [],
      saasMessageModulesList2: [],
      isOn: false,
      creattiem: ''
      // siteByOrg: [], // 应用已选中id
      // byOrgList: [] // 所有分发方式
    }
  },
  mounted () {
    this.warnPrice = '0.00'
    this.queryNum()
    this.getsiteSelect()
    this.handleQuerySiteByOrg()
  },
  watch: {
    dialogTableVisible () {
      if (this.dialogTableVisible === false) {
        this.formxf.phone = ''
        this.formxf.orderTime = ''
      }
    }
  },
  methods: {
    saveAndUpdate () {
      if (Number(this.msgType) === 1) {
        this.msgValue[0] = ''
        this.msgValue[1] = ''
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mobileMsg/saasmessagecof/saveSaasMessageCof'),
        method: 'post',
        data: this.$http.adornData(
          {
            id: this.msgForm.id,
            sendType: this.msgcheckbox === true ? '1' : '',
            sendStart: this.msgValue[0] || '',
            sendEnd: this.msgValue[1] || ''
          })
      }).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.$message.success('配置完成')
          this.msgVisible = false
          this.queryModules(this.msgForm.siteId)
        }
      })
    },
    queryModules (siteId) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mobileMsg/saasmessagemodules/queryModules'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: localStorage.getItem('orgId'),
            siteId: siteId
          }, true)
      }).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.saasMessageModulesList0 = res.data.saasMessageModulesList[0]
          this.saasMessageModulesList1 = res.data.saasMessageModulesList[1]
          this.saasMessageModulesList2 = res.data.saasMessageModulesList[2]
        }
      })
    },
    resetForm (formName) {
      this.dialogWarin = false
      this.$refs[formName].resetFields()
    },
    dialogWarinSatus () {
      this.dialogWarin = true
      this.handleWarinInfo()
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
            orgId: localStorage.getItem('orgId')
          }, true
        )
      }).then((res) => {
        console.log(res)
        if (res.data.thresholdInfo && res.data.code === 0) {
          this.warnform.price = res.data.thresholdInfo.thresholdYuan ? res.data.thresholdInfo.thresholdYuan : '0.00'
          this.isOn = res.data.thresholdInfo.status == '1'
          this.warnform.phone = res.data.thresholdInfo.mobile
        }
        console.log(this.warnPrice, this.isOn)
      })
    },
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
            url: this.$http.adornUrl('/ybt-backend/finance/saasorgthreshold/changeWarning'),
            method: 'post',
            data: this.$http.adornData(
              {
                orgId: localStorage.getItem('orgId'),
                status: this.isOn ? '1' : '0',
                thresholdYuan: this.warnPrice,
                mobile: this.warnform.phone
              }, true)
          }).then(res => {
            console.log(res)
            this.$message.success('已设定预警值')
          })
        } else {
          return false
        }
      })
    },
    toConfig (item) {
      this.msgForm = ''
      this.msgForm = item
      this.msgForm.sendStart = this.msgForm.sendStart === null ? '08:00:00' : this.msgForm.sendStart
      this.msgForm.sendEnd = this.msgForm.sendEnd === null ? '23:00:00' : this.msgForm.sendEnd
      this.msgValue = [item.sendStart, item.sendEnd]
      this.msgType = item.secondModuleId
      this.msgtitle = item.secondModuleName
      if (this.msgType === 1) {
        this.msgcheckbox = true
      } else {
        this.msgcheckbox = item.sendType === '1'
      }
      this.msgVisible = true
    },
    msgclick () {
      console.log(this.msgValue, this.msgcheckbox)
      this.saveAndUpdate()
    },
    handleSiteNameClick (tab) {
      this.siteUserName = tab.label
      this.queryModules(tab.name)
      console.log(tab)
    },
    handleTabClick (tab) {
      console.log(tab)
    },
    // 查询商城
    handleQuerySiteByOrg () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sms/querySiteByOrg'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: localStorage.getItem('orgId')
          }, true)
      }).then((data) => {
        console.log(data)
        if (data.data.code === 0) {
          this.mallList = data.data.siteList
          this.siteName = this.mallList[0].id
          this.siteUserName = this.mallList[0].siteName

          this.queryModules(this.siteName)
        }
      })
    },
    // 监听分发形式
    handleApply (val) {
      console.log(val, '111')
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.smsDetail()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.smsDetail()
    },
    search () {
      let reg = /^\d{11}$/
      if (this.formxf.phone !== '' && !reg.test(this.formxf.phone)) {
        return this.$message.error('请输入正确的手机号')
      }

      this.pageIndex = 1
      this.smsDetail()
    },
    smsDetail () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sms/smsDetail'),
        method: 'post',
        data: this.$http.adornData({
          siteId: this.siteId,
          mobile: this.formxf.phone,
          startDate: this.formxf.orderTime === null || this.formxf.orderTime === '' ? '' : this.formxf.orderTime[0],
          endDate: this.formxf.orderTime === null || this.formxf.orderTime === '' ? '' : this.formxf.orderTime[1],
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.gridData = data.data.page.list
          this.totalPage = data.data.page.totalCount
        }
      })
    },
    detail (item) {
      this.siteId = item.id
      this.smsDetail()
      this.querySiteUsedNum()
      this.dialogTableVisible = true
    },

    querySiteUsedNum (item) {
      // sms/smsorgorder/querySiteUsedNum
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sms/querySiteUsedNum'),
        method: 'post',
        data: this.$http.adornData({
          siteId: this.siteId
        }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          // this.messageNum = data.data.num
          this.formxf.messageNums = data.data.usedNum
        }
      })
    },

    //  下单时间
    selectTimeOrderTime (val) {
      console.log(val)
      this.formxf.orderTime = val
    },
    queryNum () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sms/queryNum'),
        method: 'post',
        data: this.$http.adornData({
        })
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.messageNum = data.data.num
          this.creattiem = data.data.newDate
          this.useNum = data.data.useNum
        }
      })
    },
    getNum (item) {
      for (let index = 0; index < this.form.smsList.length; index++) {
        const element = this.form.smsList[index]
        element.select = false
      }
      item.select = true
      this.smsNum = item.num
      this.payAmount = this.smsNum * 0.05
    },
    buySmsServ () {
      var mess = '将扣除账户预付款:' + this.payAmount + '元，确认是否购买？'
      this.$confirm(mess, '购买确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/sms/buySmsServ'),
          method: 'post',
          data: this.$http.adornData({
            smsNum: this.smsNum,
            payAmount: this.payAmount
          }, true)
        }).then((data) => {
          this.dialogFormVisible = false
          if (data && data.data.code === 0) {
            this.$message({
              type: 'success',
              message: '购买成功!'
            })
            this.queryNum()
          } else {
            this.$message({
              type: 'error',
              message: data.data.msg
            })
          }
        })
      }).catch(() => {
      })
    },
    updateSignature (item) {
      this.$prompt('', '修改签名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/sms/uptSmsSign'),
          method: 'post',
          data: this.$http.adornData({
            smsSign: value == null ? '' : value,
            siteId: item.id
          }, true)
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              type: 'success',
              message: '修改签名成功!'
            })
            this.getsiteSelect()
          } else {
            this.$message({
              type: 'error',
              message: '修改签名失败!'
            })
          }
        })
      }).catch(() => {
      })
    },

    getsiteSelect () {
      this.tableData = []
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/querySiteList'),
        method: 'post',
        data: this.$http.adornData({

        })
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.loading = false
          this.tableData = data.data.siteList
          // this.totalPage = data.data.page.totalCount
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  h2{
    span.s2{
      font-size: 12px;
      color:#999999;
      padding-left: 30px;
    }
  }
  .wapper_tabs {
    .tabs_second {
      h2{
        margin: 10px 0;
      }
      /deep/ .el-checkbox {
        margin: 0 0 10px 0;
        width: 20%;
      }
      .el-checkbox-group {
        margin-bottom: 10px;
      }
      .apply {
        /deep/ .el-checkbox {
          display: block;
        }
        .r_content {
          height: 19px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .apply {
    display: flex;
    justify-content: space-between;
    .apply_title {
      padding-left: 14px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
  h2 {
    border-left: 4px solid #3E8EF7;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
  }
  .tip {
    top: -5px;
  }
  .font32 {
    font-size: 32px;
    color: #3c3c3c;
    margin-bottom: 30px;
    font-weight: 600;
    display: inline-block;
    margin-right:20px;
  }
  .smsItem {
    background-color: #c2c2c2;
    border-color: #c2c2c2;
    color: #ffffff;
    width: 100px;
    height: 36px;
    border-radius: 3px;
    display: inline-block;
    text-align: center;
    line-height: 36px;
    margin-right: 5px;
    cursor: pointer;
    &.select {
      background: #1985FF;
      border: 1px solid #1985FF;
      color: #fff;
      outline: none;
    }
  }
  .mainRight {
    margin-right: 20px;
    background: #ffffff;
  }
  .site-content {
    color: #303133;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s;
    padding: 0;
    // padding-bottom: 50px;
  }
  .w80 {
    width: 90px;
  }
  .w100 {
    width: 130px
  }

}
.searchBlock {
  background: #ffffff;
  .navsourse {
    font-size: 0;
    background-color: #eee;
    li {
      width: 120px;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      color: rgba(108, 107, 143, 1);
      text-align: center;
      display: inline-block;
      &.active {
        width: 120px;
        height: 40px;
        background: #ffffff;
        border-radius: 4px 4px 0px 0px;
      }
    }
  }
  .searchPannel {
    background: #ffffff;
    padding-top: 20px;
    .formItem {
      display: inline-block;
      margin-bottom: 10px;
      .form-checkbox {
        background-color: #00aa72;
        border-color: #00aa72;
      }

      span {
        padding: 0 8px;
      }
      /deep/ .el-button {
        padding: 5px 10px;
      }
      &.ml0 {
        // margin-left: 0;
        /deep/ .el-form-item__content {
          margin-left: 20px !important;
        }
      }

    }
  }
  .tablescroll {
    overflow: hidden;
  }
  .scopepannel {
    display: inline-block;
    width: 200px;
    vertical-align: top;
    padding-left: 20px;
  }
  .colorRed {
    color: #ff0000;
  }

  .fipt {
    width: 80px;
    /deep/ .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
    &.w100 {
      width: 100px;
    }
  }
  .w90 {
    width: 90px !important;
  }
  .el-card__body {
    padding-top: 0;
  }
  .btnStatus span {
    cursor: pointer;
    color: #3e98f6;
  }
}
.xqtitle {
  border-left: 4px solid #3E8EF7;
  font-size: 14px;
  padding-left: 10px;
  color: #3c3c3c;
  margin-bottom: 14px;
}
 // 应用短信
  .box-card{
    width: 350px;
    display: inline-block;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1) !important;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1) !important;
    margin: 10px;
    i{
      color: #67C23A;
      font-size: 16px;
      margin-right: 10px;
      font-weight: bold;
    }
    .disable{
      color:#999999;
      i{
        color:#999999
      }
    }
  }
  .formitem{
    margin-bottom: 5px;
  }
  .msgcontent /deep/ .el-dialog__body{
    padding-top: 0;
  }
   .msgInfo{
      background: url(~@/assets/img/msgInfo.jpg) no-repeat center top;
      background-size: 100% 100%;
      width: 309px;
      height: 531px;
      border:#dddddd 1px solid;
      .msgInfotxt{
        font-size: 16px;
        color: #333333;
        line-height: 22px;
        padding: 20px 35px;
        background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2QUE2NkYzOEFBMjExRUE4RjFDRUUxNTlFOUJGNDMyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY2QUE2NkY0OEFBMjExRUE4RjFDRUUxNTlFOUJGNDMyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZBQTY2RjE4QUEyMTFFQThGMUNFRTE1OUU5QkY0MzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjZBQTY2RjI4QUEyMTFFQThGMUNFRTE1OUU5QkY0MzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCABkATUDAREAAhEBAxEB/8QAaQABAAMBAQEAAAAAAAAAAAAAAAIDBAUBCAEBAQEAAAAAAAAAAAAAAAAAAAIBEAEAAQIGAgAGAwAAAAAAAAAAAQIDkVJyEzMEscERITFRcSJBgaERAQEBAQAAAAAAAAAAAAAAAAARAQL/2gAMAwEAAhEDEQA/APqkAAELt2m3T8Z+v8Q3MZuslfYu1T9fhH2hUTUd27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIU3buerGSFN27nqxkhTdu56sZIVZb7VdM/t+0f6zcbWumqKoiY+cSlT0AAAAAGHsVzVdn7R8oXiNVtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGnp1z+1H9wnpuNKVAAAAAOfd5a9U+V4jUWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/p8s6fcJ6bjWlQAAAADn3eWvVPleI1FoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv6fLOn3Cem41pUAAAAA593lr1T5XiNRaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+nyzp9wnpuNaVAAAAAOfd5a9U+V4jUWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/p8s6fcJ6bjWlQAAAADn3eWvVPleI1FoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv6fLOn3Cem41pUAAAAA593lr1T5XiNRaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+nyzp9wnpuNaVAAAAAOfd5a9U+V4jUWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/p8s6fcJ6bjWlQAAAADn3eWvVPleI1FoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv6fLOn3Cem41pUAAAAA593lr1T5XiNRaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+nyzp9wnpuNaVAAAAAOfd5a9U+V4jUWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/p8s6fcJ6bjWlQAAAADn3eSv8z5XiNRaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+nyT+PcJ6bjWlQAD/2Q==) no-repeat center top;
        background-size: 100% 100%;
        margin-top: 70px;
      }
      .msgInfoline{
        background: url(~@/assets/img/msgInfo2.jpg) no-repeat center top;
        background-size: 100% 100%;
        height: 14px;
        width: 307px;
      }
    }
</style>
