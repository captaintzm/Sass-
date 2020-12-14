<template>
  <div class="siteWrapper">
    <el-form ref="form" label-width="100px" size="medium">
      <el-form-item label="供应商" class="formItem" label-width="60px">
        <el-select v-model="form.source" @change="getsourcestatus">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="(item,index) in form.supplyNameList"
            :key="index"
            :label="item.supplyName"
            :value="item.source"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" class="formItem">
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
      <el-form-item label="订单来源" class="formItem">
        <el-select v-model="form.siteName" @change="getstatus">
          <el-option label="全部商城" value></el-option>
          <el-option
            v-for="(item,index) in form.siteList"
            :key="index"
            :label="item.siteName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="20px" class="formItem">
        <el-button type="primary" @click="search()">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="form" size="medium" label-width="100px">
      <!-- <el-form-item label="已选开票金额" class="formItem">{{priceA}}元</el-form-item>
      <el-form-item label="待开票总金额" class="formItem" style="margin-left:50px">{{priceB}}元</el-form-item>
      <el-button type="primary" size="small" @click="askingForInvoices">索取发票</el-button><span style="color:#999999;font-size:12px;padding-left:10px;">仅用于礼品公司向驿宝通平台申请开票用</span> -->

      <el-row :gutter="10" >
          <el-col :span="6" style="min-width:350px">
            <el-form-item label="已选开票金额" class="formItem mb0">{{priceA}}元</el-form-item>
            <el-form-item label="待开票总金额" class="formItem mb0" style="margin-left:10px" >{{priceB}}元</el-form-item><br>
            <el-button type="primary" size="small" @click="askingForInvoices">索取发票</el-button>
          </el-col>
          <el-col :span="10" style="font-size:12px;color:#999999;line-height: 20px;padding-top: 7px;border-left: #e2dfdf 1px solid;padding-left: 20px;">
            <p>
              开票提示
            </p>
            <p>1、开票金额以供应价作为依据，仅用于礼品公司向驿宝通平台申请开票用</p>
            <p>2、仅已关闭的订单才可开票，且单次开票金额需大于200</p>
            <p>3、当订单可开票金额为0时，将无法开票</p>
          </el-col>
      </el-row>

    </el-form>
    <!-- <el-radio v-model="checkedPage" label="1">全选本页</el-radio>
    <el-radio v-model="checkedPage" label="2">全选所有页</el-radio>-->
    <!-- <el-checkbox v-model="checkedCurrentPage">全选本页</el-checkbox>
    <el-checkbox v-model="checkedAllPage">全选所有页</el-checkbox>-->
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%;margin-top:20px;"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column type="selection" width="55" class="form-checkbox"></el-table-column>
      <el-table-column prop="siteName" label="订单来源" width="180"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
      <el-table-column prop="createDate" label="完成时间"></el-table-column>
      <el-table-column prop="supplyName" label="供应商">
        <template slot-scope="scope">
          <span v-html="getsupplyName(scope.row.source)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="amountYuan" label="运费金额"></el-table-column>
      <el-table-column prop="amountYuan" label="可开票金额"></el-table-column>
    </el-table>
    <div class="orderList">
      <el-pagination
        class="page"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :background="true"
        :page-sizes="[ 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        :current-page="pageIndex"
      ></el-pagination>
    </div>
    <InvoicingManagementDetail ref="InvoicingManagement" @getreload="search" />
  </div>
</template>

<script>

import InvoicingManagementDetail from '@/components/Finance/InvoicingManagementDetail'

export default {
  data () {
    return {
      form: {
        name: '',
        source: '',
        siteName: '',
        siteList: '',
        giftCompany: '',
        supplyNameList: [
          {
            supplyName: '京东',
            source: 1
          },
          {
            supplyName: '苏宁易购',
            source: 3
          },
          {
            supplyName: '网易严选',
            source: 4
          },
          {
            source: 9,
            supplyName: '小米有品'
          },
          {
            source: 102,
            supplyName: '平台供应商'
          },
          {
            source: 7,
            supplyName: '平台虚拟商品'
          }
        ]
      },
      checkedPage: '',
      priceA: '0.00',
      priceB: '0.00',
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
      pageSize: 20,
      totalPage: 0,
      checkedCurrentPage: false,
      checkedAllPage: false,
      productIds: ''
    }
  },
  mounted () {
    this.rechargeIds = ''
    this.rechargeAllIds = ''
    this.siteId = ''
  },
  watch: {
    // checkedCurrentPage () {
    //   if (this.checkedCurrentPage === true) {
    //     this.getCurrentAllId()
    //   } else {

    //   }
    // },
    checkedPage () {
      if (this.checkedPage === '1') {

      } else if (this.checkedPage === '2') {
        this.getCurrentAllId()
      }
    }

  },
  created () {
    this.orderList()
    this.sbmitlist()
  },
  methods: {
    getsupplyName (source) {
      var supplyName = this.form.supplyNameList.filter(item => item.source === source)[0].supplyName
      return supplyName
    },
    search () {
      this.pageIndex = 1
      this.orderList()
    },
    askingForInvoices () {
      // if (this.checkedAllPage === true) {
      //   this.$refs.InvoicingManagement.packlist(this.siteId, 3, this.rechargeAllIds)
      // } else {
      //   if (this.checkedPage === '1') {
      //     this.getCurrentAllId()
      //   } else {
      //     if (this.rechargeIds === '') {
      //       this.$message.error('请选择一个订单')
      //       return false
      //     }
      //   }
      //   this.$refs.InvoicingManagement.packlist(this.siteId, 3, this.rechargeIds)
      // }
      this.$refs.InvoicingManagement.comefromFreight(1)
      this.$refs.InvoicingManagement.packlist(this.siteId, 3, this.rechargeIds)
      // this.getCurrentAllId()
      if (this.rechargeIds === '') {
        this.$message.error('请选择一个订单')
        return false
      }
      if (this.priceA < 200) {
        this.$message.error('开票金额要大于200')
        return false
      }
      this.$refs.InvoicingManagement.siteId = this.siteId
      this.$refs.InvoicingManagement.dialogTableVisible = true
    },
    getCurrentAllId () {
      this.priceA = 0
      this.rechargeIds = ''
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        this.priceA += element.amount
        if (element.amountYuan !== '0.00') {
          this.rechargeIds += element.id + ','
        }
      }
      this.priceA = this.priceA / 100
      this.rechargeIds = this.rechargeIds.substring(0, this.rechargeIds.length - 1)
    },
    handleSelectionChange (item) {
      this.priceA = 0
      this.rechargeIds = ''
      if (item.length === this.tableData.length) {
        this.checkedPage = 1
      } else {
        this.checkedPage = ''
      }
      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        this.priceA += element.amount
        if (element.amountYuan !== '0.00') {
          this.rechargeIds += element.id + ','
        }
      }
      this.priceA = this.priceA / 100
      this.rechargeIds = this.rechargeIds.substring(0, this.rechargeIds.length - 1)
    },

    getstatus (item) {
      this.siteId = item
      console.log(item)
    },
    getsourcestatus (item) {
      this.form.source = item
      console.log(item)
    },
    getgiftCompany () {
    },
    selectTimeOrderTime (val) {
      console.log(val)
      this.orderTime = val
    },

    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.orderList()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.orderList()
    },
    orderList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/orderList'),
        method: 'post',
        data: this.$http.adornData(
          {
            siteId: this.siteId === undefined ? '' : this.siteId,
            startDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[0],
            endDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[1],
            source: this.form.source,
            flag: 3,
            page: this.pageIndex,
            limit: this.pageSize
          }, true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.tableData = res.data.page.list
          this.totalPage = res.data.page.totalCount
          this.rechargeAllIds = res.data.info.rechargeIds
          this.priceB = res.data.info.amountYuan
        }
      })
    },
    // 订单来源
    sbmitlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/querySiteList'),
        method: 'post',
        data: ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.form.siteList = data.siteList
        }
      })
    }

  },
  components: {

    InvoicingManagementDetail
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
.mb0{
  margin-bottom: 0px;
}
</style>
