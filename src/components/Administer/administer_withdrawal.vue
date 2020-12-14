<template>
  <div class="administer_withdrawal">
    <div class="account_info">
      <div class="account_money">
        <div class="totalBalance">
          <p>代收现金账户总额</p>
          <span>
            ￥
            <i>{{totalBalance}}</i>
          </span>
        </div>
        <div class="freezingAmount">
          <p>锁定金额</p>
          <span>
            ￥
            <i>{{freezingAmount}}</i>
          </span>
        </div>
        <div class="withdrawalAmount">
          <p>可提现金额</p>
          <span>
            ￥
            <i style="color: #1985FF;">{{withdrawalAmount}}</i>
          </span>
        </div>
      </div>
      <div class="account_tip">
        <div class="tip_title">温馨提示</div>
        <div class="tip_text">
          <p>1、仅已关闭状态订单才可提现</p>
          <p>
            2、提现：手续费率为0.9%(0.6%属于微信提现手续费，为微信收取；0.3%属于银行转账手续费，为银行收取)，只能提现至您的银行账户，预计5到7个工作日内到账，提现金额
            <i
              style="color: red;"
            >≤ 5000</i>元则需另加收5元手续费
          </p>
          <p>3、转至预存账户：无手续费，实时到账，无金额限制</p>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeTabs" type="card" @tab-click="handleClickTabs">
      <el-tab-pane label="转至预存账户" name="prestore">
        <div class="account_input">
          <el-row :gutter="24">
            <el-col :span="12">
              转账金额：
              <el-input-number
                class="inputNum"
                v-model="extractMoney"
                :precision="2"
                :step="0.1"
                controls-position="right"
                :min="0"
                :max="withdrawalAmount * 1"
                size="mini"
              ></el-input-number>元
            </el-col>
            <el-col :span="12">
              到账金额：
              <el-input v-model="extractMoney" :disabled="true" size="mini"></el-input>元
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="prestoreTabs"
          style="width: 100%"
          max-height="300px"
          :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        >
          <el-table-column align="center" prop="serialNo" label="流水号"></el-table-column>
          <el-table-column align="center" prop="amount" label="提取金额"></el-table-column>
          <el-table-column align="center" prop="amount" label="到账金额"></el-table-column>
          <el-table-column align="center" prop="operTime" label="提取时间"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handlePrestoreSize"
          @current-change="handlePrestoreCurrent"
          :current-page="prestoreIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="prestoreSize"
          :total="prestoreTotal"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="提现" name="cashOut">
        <div class="account_input">
          <el-row :gutter="24" style="margin-bottom: 10px">
            <el-col :span="9">
              提现金额：
              <el-input-number
                class="inputNum"
                v-model="cashExtractMoney"
                :precision="2"
                :step="0.1"
                controls-position="right"
                :min="withdrawalAmount < 500 ? 0 : 500"
                :max="withdrawalAmount * 1"
                size="mini"
              ></el-input-number>元
            </el-col>
            <el-col :span="6">
              手续费：
              <span style="color: red">{{ poundage || '0.00' }}</span> 元
              <i class="tip_icon">
                <span class="tip" style="top: 0">手续费率为0.9%,若提现金额≤5000元则需另加收5元手续费</span>
              </i>
            </el-col>
            <el-col :span="9">
              到账金额：
              <el-input v-model="cashArrivalAccountMoney" :disabled="true" size="mini"></el-input>元
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="9">
              银行账号：{{bankAccount}}&nbsp;&nbsp;
              <el-button type="primary" size="small" @click="getindexs()">修改提现账号</el-button>
            </el-col>
            <el-col :span="6">
              <el-button @click="handleimportReport" type="primary" size="mini">导出</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="cashOutTabs"
          style="width: 100%"
          max-height="300px"
          :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        >
          <el-table-column align="center" prop="serialNo" label="流水号" fixed="left" width="180"></el-table-column>
          <el-table-column align="center" prop="amount" label="提取金额"></el-table-column>
          <el-table-column align="center" prop="extend.serFee" label="手续费"></el-table-column>
          <el-table-column align="center" prop="extend.arrivalAccount" label="到账金额"></el-table-column>
          <el-table-column align="center" prop="extend.bankAccount" label="提现账号"></el-table-column>
          <el-table-column align="center" prop="operTime" label="提取时间" width="200"></el-table-column>
          <el-table-column align="center" prop="operStatus" label="审批状态">
            <template slot-scope="scope">
              <span v-if="scope.row.operStatus == 0">未审核</span>
              <span v-else-if="scope.row.operStatus == 1">已审核</span>
              <span v-else-if="scope.row.operStatus == 2">已拒绝</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleCashOutSize"
          @current-change="handleCashOutCurrent"
          :current-page="cashOutIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="cashOutSize"
          :total="cashOutTotal"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <div class="dialog-footer" style="text-align: center;">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleWithdrawal">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orgId: '', // 机构Id
      totalBalance: '', // 现金账户总额
      freezingAmount: '', // 冻结金额
      withdrawalAmount: '', // 可提取金额
      bankAccount: '', // 提现银行账号
      activeTabs: 'prestore', // 默认显示预存
      extractMoney: '', // 转账金额(预存)
      prestoreTabs: [], // 预存表格数据
      prestoreIndex: 1, // 预存当前页
      prestoreSize: 10, // 预存每页数量
      prestoreTotal: 0, // 预存总条数
      cashExtractMoney: '', // 提现金额
      poundage: null, // 提现手续费
      cashArrivalAccountMoney: null, // 提现到账金额
      cashOutTabs: [], // 提现表达数据
      cashOutIndex: 1, // 提现当前页
      cashOutSize: 10, // 提现每页数量
      cashOutTotal: 0 // 提现总条数
    }
  },
  mounted () {
    this._initData()
  },
  methods: {
    getindexs () {
      var mlisturl = JSON.parse(localStorage.getItem('menulistsurl'))
      var currenturl = '/FinancialAllocation'
      let index = mlisturl.findIndex(item => item === currenturl)
      if (index < 0) {
        this.$message.error('您没有财务配置权限')
      } else {
        this.$router.push({
          name: 'FinancialAllocation',
          query: {
            activeName: 'second'
          }
        })
      }
    },
    _initData () {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.orgId = userInfo.organizationIds
      // 查询账户
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/searchOrgCashAccount'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId
          },
          true
        )
      }).then(res => {
        if (res.data.code === 0) {
          this.totalBalance = res.data.totalBalance
          this.freezingAmount = res.data.freezingAmount
          this.withdrawalAmount = res.data.cashBalance
          this.bankAccount = res.data.bankAccount || '--'
        }
      })

      // 查询记录
      this.handleSearchRecord(this.activeTabs)
    },
    // 查询记录
    handleSearchRecord (tabName) {
      let abstractType = '现金转预存'
      let page = this.prestoreIndex
      let limit = this.prestoreSize
      let type = '01'
      if (tabName === 'cashOut') {
        abstractType = '提现'
        type = '02'
        page = this.cashOutIndex
        limit = this.cashOutSize
      }
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/getRechargeFlowPage'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId,
            type: type,
            abstractType: abstractType,
            page: page,
            limit: limit
          },
          true
        )
      }).then(res => {
        console.log(tabName, res)
        if (res && res.data.code === 0) {
          if (tabName === 'prestore') {
            this.prestoreTabs = res.data.page.list
            this.prestoreTotal = res.data.page.totalCount
          } else if (tabName === 'cashOut') {
            let list = res.data.page.list
            list.forEach(e => {
              return e.extend = JSON.parse(e.extend)
            })
            this.cashOutTabs = list
            this.cashOutTotal = res.data.page.totalCount
          }
        }
      })
    },
    // 切换选项卡
    handleClickTabs (tab, event) {
      this.activeTabs = tab.name
      this.handleSearchRecord(this.activeTabs)
    },
    // 预存pagesize改变触发,修改每一页数量
    handlePrestoreSize (val) {
      console.log('预存pageSize每页数量：', val)
      this.prestoreSize = val
      this.handleSearchRecord(this.activeTabs)
    },
    // 预存current改变,修改当前页
    handlePrestoreCurrent (val) {
      console.log('预存current当前页：', val)
      this.prestoreIndex = val
      this.handleSearchRecord(this.activeTabs)
    },
    // 提现pagesize改变触发，修改每一页数量
    handleCashOutSize (val) {
      console.log('提现pageSize每页数量：', val)
      this.cashOutSize = val
      this.handleSearchRecord(this.activeTabs)
    },
    // 提现current改变触发，修改当前页
    handleCashOutCurrent (val) {
      console.log('提现current当前页：', val)
      this.cashOutIndex = val
      this.handleSearchRecord(this.activeTabs)
    },
    // 提交提款
    handleWithdrawal () {
      // 转至预存账户
      if (this.activeTabs === 'prestore' && this.extractMoney) {
        this.$confirm('确认后将实时到账您的预存款账户!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/ybt-backend/finance/orgaccount/cashRecharge'
            ),
            method: 'post',
            data: this.$http.adornData(
              {
                amount: this.extractMoney,
                abstractType: '现金转预存',
                orgId: this.orgId,
                remarks: '现金转预存'
              },
              true
            )
          }).then(res => {
            if (res.data.code === 0) {
              this.dialogAdminister = false
              this.handleSearchRecord(this.activeTabs)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
      // 提现
      else if (this.activeTabs === 'cashOut' && this.cashExtractMoney) {
        if (this.cashExtractMoney < 500) {
          this.$message.warning('最低提现金额为500元')
          return
        }
        this.$confirm('预计5个工作日内到账您的账户!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(
              '/ybt-backend/finance/orgaccount/cashRecharge'
            ),
            method: 'post',
            data: this.$http.adornData(
              {
                amount: this.cashExtractMoney,
                abstractType: '提现',
                orgId: this.orgId,
                remarks: '提现'
              },
              true
            )
          }).then(res => {
            if (res.data.code === 0) {
              this.dialogAdminister = false
              this.handleSearchRecord(this.activeTabs)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$message.warning('请输入金额！')
      }
    },
    // 导出
    handleimportReport () {
      console.log('导出')
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/getRechargeFlowPageExport'
        ),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            startDate: '',
            endDate: '',
            operStatus: '',
            abstractType: '提现',
            orgName: ''
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
          link.download = '提现交易明细.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
        }
      })
    },
    handleClose () {
      this.$emit('close')
    }
  },
  watch: {
    cashExtractMoney (newV, oldV) {
      if (newV > 5000) {
        // 手续费(四舍五入)
        this.poundage = Math.round(newV * 0.9) / 100
      }// 提现小于5000另收5元手续费
      else {
        // 手续费(四舍五入)
        this.poundage = Math.round(newV * 0.9) / 100 + 5
      }
      // 到账金额
      this.cashArrivalAccountMoney = (this.cashExtractMoney - this.poundage).toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.administer_withdrawal {
  .account_info {
    .account_money {
      display: flex;
      margin-bottom: 10px;
      span {
        font-weight: bold;
      }
      .totalBalance {
        padding-right: 50px;
        border-right: 1px solid #ccc;
      }
      .freezingAmount {
        padding: 0 50px;
      }
    }
    .account_tip {
      margin-bottom: 20px;
    }
  }
  .account_input {
    margin-bottom: 10px;
    /deep/ .el-input {
      width: 50%;
    }
    .inputNum {
      /deep/ .el-input {
        width: 100%;
      }
    }
  }
}
</style>
