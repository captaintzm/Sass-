<template>
  <div class="siteWrapper">
     <!-- <BillingFlowChar/> -->
    <NavSteps
      stepText1="商品发票"
      stepText4="API商品发票"
      stepText2="服务发票"
      stepText3="运费发票"
      styleName="2"
      @clickToLink="clickLink"
    ></NavSteps>
    <el-form ref="form" label-width="85px" size="medium">
      <el-form-item label="申请时间" class="formItem">
        <el-date-picker
          v-model="orderTime"
          type="datetimerange"
          :picker-options="pickerOptions2"
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
      <el-form-item label="发票编号" class="formItem">
        <el-input
          v-model="form.invoicesNo"
          size="medium"
          :style="{height: '40px',lineHeight: '40px'}"
        ></el-input>
      </el-form-item>
      <el-form-item label="开票状态" class="formItem">
        <el-select v-model="form.status" class="w90" @change="getstatus">
          <el-option label="全部" value=""></el-option>
          <el-option label="审核中" value="1"></el-option>
          <el-option label="审核已通过" value="2"></el-option>
          <el-option label="审核不通过" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="礼品公司" class="formItem" v-if="orgType==2">
        <el-input
          v-model="form.giftCompany"
          size="medium"
          :style="{height: '40px',lineHeight: '40px'}"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="20px" class="formItem">
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button type="primary" @click="importReport()">导出</el-button>
        <el-button type="primary" @click="Applyticket()" v-if="orgType!=2">申请开票</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="amountYuan" label="发票金额" width="180"></el-table-column>
      <el-table-column prop="invoicesNo" label="发票编号" width="180"></el-table-column>
      <el-table-column prop="createDate" label="申请时间"></el-table-column>
      <el-table-column prop="orgName" label="礼品公司" v-if="orgType==2"></el-table-column>
      <el-table-column prop="operStatus" label="开票状态" :formatter="stateFormat"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">详情</el-button>
          <el-button
            @click="pass(scope.row)"
            type="text"
            size="small"
            v-if="orgType==2 && scope.row.operStatus==1"
          >通过</el-button>
          <el-button
            @click="notPass(scope.row)"
            type="text"
            size="small"
            v-if="orgType==2 && scope.row.operStatus==1"
          >不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="packlist">
      <el-pagination
        class="page"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :background="true"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        :current-page="pageIndex"
      ></el-pagination>
    </div>
    <Invoicingdetail ref="Invoicingdetail" />
  </div>
</template>

<script>
// import BillingFlowChar from '@/components/Finance/BillingFlowChar'
import NavSteps from '@/components/steps/NavSteps'
import Invoicingdetail from '@/components/Finance/Invoicingdetail'

export default {
  data () {
    return {
      form: {
        invoicesNo: '',
        name: '',
        status: '',
        giftCompany: ''
      },
      orderTime: '',
      pickerOptions2: {
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
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      exportOrderFlag: true,
      orgType: ''
    }
  },
  mounted () {
    this.operStatus = ''
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.orgType = userInfo.sysOrganization.type
    this.packlist()
  },

  methods: {
    search () {
      this.pageIndex = 1
      this.packlist()
    },
    stateFormat (row, column) {
      let operStatus = Number(row.operStatus)
      if (operStatus === 1) {
        return '审核中'
      } else if (operStatus === 2) {
        return '审核已通过'
      } else {
        return '审核不通过'
      }
    },
    importReport () {
      if (this.orderTime === null || this.orderTime === '' || this.orderTime === null) {
        this.$message.error('请选择起止日期')
        return false
      }
      if (this.exportOrderFlag === false) return
      this.exportOrderFlag = false

      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/invoices/invoicesinfo/list/export'
        ),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            startDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[0],
            endDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[1],
            operStatus: this.operStatus,
            type: 2,
            orgName: this.form.giftCompany,
            invoicesNo: this.form.invoicesNo
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
          link.download = '导出列表.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.exportOrderFlag = true
        }
      })
    },
    Applyticket () {
      this.$router.push({ path: '/ServiceCharge' })
    },
    detail (item) {
      this.$refs.Invoicingdetail.savedo(item.id, 2)
      this.$refs.Invoicingdetail.dialogTableVisible = true
    },
    pass (item) {
      this.$confirm('是否确认通过该发票审核？', '审核提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/uptOperStatus'),
          method: 'post',
          data: this.$http.adornData({
            id: item.id,
            operStatus: 2,
            remarks: ''
          }, true)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.packlist()
          }
        })
      })
    },
    notPass (item) {
      this.$prompt('是否确认不通过该发票审核？', '审核提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入不通过原因（必填）'
      }).then(({ value }) => {
        if (value === '') {
          this.$message.error('请输入不通过原因')
        } else {
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/uptOperStatus'),
            method: 'post',
            data: this.$http.adornData({
              id: item.id,
              operStatus: 3,
              remarks: value
            }, true)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.packlist()
            }
          })
        }
      }).catch(() => {

      })
    },
    clickLink (type) {
      if (type === 1) {
        this.$router.push({ path: '/InvoicingManagement' })
      } else if (type === 2) {
        this.$router.push({ path: '/serviceInvoice' })
      } else if (type === 3) {
        this.$router.push({ path: '/freightInvoice' })
      } else {
        this.$router.push({ path: '/apiInvoicingManagement' })
      }
    },
    getstatus (item) {
      this.operStatus = item
    },
    selectTimeOrderTime (val) {
      console.log(val)
      this.orderTime = val
    },

    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.packlist()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.packlist()
    },
    packlist () {
      console.log(this.orderTime)
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/list'),
        method: 'post',
        data: this.$http.adornData({
          startDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[0],
          endDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[1],
          operStatus: this.operStatus,
          type: 2,
          orgName: this.form.giftCompany,
          invoicesNo: this.form.invoicesNo,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.tableData = res.data.page.list
          this.totalPage = res.data.page.totalCount
        }
      })
    }

  },
  components: {
    // BillingFlowChar,
    NavSteps,
    Invoicingdetail
  }
}
</script>

<style lang="scss" scope>

.siteWrapper h2 {
  border-left: 4px solid #3E8EF7;
  font-size: 16px;
  padding-left: 10px;
  color: #3c3c3c;
}
</style>
