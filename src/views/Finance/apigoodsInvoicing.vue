<template>
  <div class="siteWrapper">
    <el-form ref="form" label-width="100px" size="medium">
      <!-- <el-form-item label="供应商名称" class="formItem">
        <el-input v-model="form.name" size="medium" :style="{height: '40px',lineHeight: '40px'}"></el-input>
      </el-form-item>-->
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
      <el-form-item label="已选开票金额" class="formItem">{{priceA}}元</el-form-item>
      <el-form-item label="待开票总金额" class="formItem" style="margin-left:50px">{{priceB}}元</el-form-item>
      <el-button type="primary" size="small" @click="askingForInvoices">提交开票</el-button>  <span style="color:#999999;font-size:12px;padding-left:10px;">仅用于礼品公司向驿宝通平台申请开票用</span>
    </el-form>
    <!-- <el-checkbox v-model="checkedCurrentPage">全选本页</el-checkbox>
    <el-checkbox v-model="checkedAllPage">全选所有页</el-checkbox>-->
    <div class="tablescroll tablescroll1">
      <table>
        <thead>
          <tr>
            <th width="400">
              <el-checkbox v-model="checkedCurrentPage" @change="getAllcheckbox()"></el-checkbox>&nbsp;&nbsp;商品详情
            </th>
            <th>供应价</th>
            <th>数量</th>
            <th>商品金额</th>
            <th>退货数量</th>
            <th>退款金额</th>
            <th>供应商</th>
            <th>所属项目</th>
          </tr>
        </thead>
        <tbody v-for="(item,index) in tableData" :key="index">
          <tr>
            <td colspan="8" class="thStyle">
              <div class="tdInfo">
                <div class="tdl">
                  <el-checkbox v-model="item.selectCheck" @change="getcheckbox(item)"></el-checkbox>
                  <span>订单编号：{{item.orderNo}}</span>
                  <span>下单时间：{{item.createDate}}</span>
                  <span>共{{item.orderDetails.length}}件商品</span>
                  <!-- <span>可开票金额：￥{{item.amountYuan }}</span> -->
                  <span>订单总额：{{item.orderPayAmountYuan }}</span>
                  <span>退款金额：{{item.cancelAmountYuan }}</span>
                  <span>可开票金额（含运费：{{item.freightAmountYuan}}）：{{item.amountYuan }}</span>
                  <span>服务费发票金额：{{item.feeAmountYuan }}</span>
                </div>
                <!-- <div class="tdr">
                  <span @click="lookDetail(item)">查看详情</span>
                </div>-->
              </div>
            </td>
          </tr>
          <tr v-for="(childrenitem,childrenindex) in item.orderDetails" :key="childrenindex">
            <td>
              <div class="styleA">
                <div>{{childrenitem.itemName}}</div>
              </div>
            </td>
            <td>{{childrenitem.salePrice }}</td>
            <td>{{childrenitem.saleNum}}</td>
            <td>{{childrenitem.supplyAmount}}</td>
            <td>{{childrenitem.cancelNum || 0}}</td>
            <td>{{childrenitem.cancelAmountYuan || 0}}</td>
            <td>{{item.supplyName}}</td>
            <td>{{item.siteName}}</td>
          </tr>
        </tbody>
        <tbody v-show="tableData.length==0">
          <tr>
            <td colspan="8">
              <div style="text-align:center;padding:50px;font-size:16px;">暂无数据</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    <apiInvoicingManagementDetail ref="InvoicingManagement" @getreload="search" />
  </div>
</template>

<script>
import apiInvoicingManagementDetail from '@/components/Finance/apiInvoicingManagementDetail'
export default {
  data () {
    return {
      form: {
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
      checkedAllPage: false
    }
  },
  mounted () {
    this.rechargeIds = ''
    this.rechargeAllIds = ''
  },
  watch: {

  },
  created () {
    this.siteId = ''
    this.orderList()
    this.sbmitlist()
  },

  methods: {

    search () {
      this.pageIndex = 1
      this.orderList()
    },
    getAllcheckbox () {
      if (this.checkedCurrentPage === true) {
        this.getCurrentAllId()
      } else {
        this.priceA = 0
        this.rechargeIds = ''
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index]
          element.selectCheck = false
        }
      }
    },
    getcheckbox (item) {
      let sum = 0
      this.priceA = 0
      this.rechargeIds = ''
      if (sum === this.tableData.length) {
        this.checkedCurrentPage = true
      } else {
        this.checkedCurrentPage = false
      }
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.selectCheck === true) {
          this.priceA += element.amount
          this.rechargeIds += element.id + ','
          // sum++
        }
      }

      this.priceA = this.priceA / 100
      this.rechargeIds = this.rechargeIds.substring(0, this.rechargeIds.length - 1)
    },
    askingForInvoices () {
      // if (this.checkedAllPage === true) {
      //   this.$refs.InvoicingManagement.packlist(this.siteId, 1, this.rechargeAllIds)
      // } else {
      //   if (this.checkedCurrentPage === true) {
      //     this.getCurrentAllId()
      //   } else {
      //     if (this.rechargeIds === '') {
      //       this.$message.error('请选择一个订单')
      //       return false
      //     }
      //   }
      //   this.$refs.InvoicingManagement.packlist(this.siteId, 1, this.rechargeIds)
      // }
      // this.getCurrentAllId()
      if (this.rechargeIds === '') {
        this.$message.error('请选择一个订单')
        return false
      }
      if (this.priceA < 200) {
        this.$message.error('开票金额要大于200')
        return false
      }
      this.$refs.InvoicingManagement.packlist(this.siteId, 1, this.rechargeIds)
      this.$refs.InvoicingManagement.siteId = this.siteId
      this.$refs.InvoicingManagement.dialogTableVisible = true
    },
    getCurrentAllId () {
      this.priceA = 0
      this.rechargeIds = ''
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        this.priceA += element.amount
        this.rechargeIds += element.id + ','
        if (this.checkedCurrentPage === true) {
          element.selectCheck = true
        }
      }
      this.priceA = this.priceA / 100
      this.rechargeIds = this.rechargeIds.substring(0, this.rechargeIds.length - 1)
    },
    handleSelectionChange (item) {
      this.priceA = 0
      this.rechargeIds = ''
      if (item.length === this.tableData.length) {
        this.checkedCurrentPage = true
      } else {
        this.checkedCurrentPage = false
      }
      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        this.priceA += element.amount
        this.rechargeIds += element.id + ','
      }
      this.priceA = this.priceA / 100
      this.rechargeIds = this.rechargeIds.substring(0, this.rechargeIds.length - 1)
    },

    getstatus (item) {
      this.siteId = item
    },
    getsourcestatus (item) {
      this.form.source = item
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
        url: this.$http.adornUrl('/ybt-backend/apiInvoice/queryApiInvoicesOrderList'),
        method: 'post',
        data: this.$http.adornData(
          {
            siteId: this.siteId,
            startDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[0],
            endDate: this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[1],
            source: this.form.source,
            flag: 1,
            page: this.pageIndex,
            limit: this.pageSize
          }, true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.page.list.length; index++) {
            const element = res.data.page.list[index]
            element.selectCheck = false
          }
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
    apiInvoicingManagementDetail
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
.tablescroll {
  margin-top: 20px;
  table {
    width: 100%;
    tr {
      td,
      th {
        padding: 12px 10px;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
        transition: background-color 0.25s ease;
        font-size: 12px;
        color: #606266;
      }
      th {
        font-weight: bold;
        color: rgb(51, 51, 51);
        background: rgb(245, 247, 250);
      }
      .td1 {
        border: 1px solid #ebeef5;
      }
      .styleA {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        line-height: 20px;
        img {
          display: inline-block;
          margin-right: 10px;
        }
        div {
          display: inline-block;
          width: 295px;
        }
      }
    }
    .thStyle {
      background-color: #e6ecf7;
    }
    .tdInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        margin-right: 10px;
      }
      .tdr {
        span {
          color: #1985FF;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
