<template>
  <el-dialog
    title="开票明细"
    :visible.sync="dialogTableVisible"
    width="900px"
    :closeOnClickModal="false"
  >
    <div class="siteWrapper">
      <!-- <el-button type="primary" size="small" @click="openinformation()">开票信息维护</el-button> -->
      <!-- <el-button type="primary" size="small" @click="importReport()">导出</el-button> -->
      <el-form ref="form" label-width="100px" size="medium">
        <el-form-item label="切换开票信息">
           <el-select v-model="invoiceValue" class="w110" @change="getinvoiceValue">
            <el-option :label="'开票信息'+(index+1)" :value="item.id" v-for="(item,index) in invoiceValuelist" :key="index"></el-option>
          </el-select>
          <el-button type="primary" size="small" @click="getindexs()">开票信息维护</el-button>
        </el-form-item>
        <el-form-item label="发票金额:" class="formItem formItemA">{{amountYuan}}</el-form-item>
        <el-form-item label="发票编号:" class="formItem formItemA">{{form.invoicesNo}}</el-form-item>
        <el-form-item
          label="发票状态:"
          class="formItem formItemA"
          v-if="form.operStatus!=null"
        >{{form.operStatus==1?'待审核':form.operStatus==2?'审核通过':form.operStatus==3?'审核不通过':''}}</el-form-item>
        <el-form-item
          label="发票类型:"
          class="formItem formItemA"
        >{{form.invoiceType==1?'增值税专用发票':'增值税普通发票'}}</el-form-item>
        <el-form-item label="发票抬头:" class="formItem formItemA">{{form.invoicesHead}}</el-form-item>
        <el-form-item label="收货人:" class="formItem formItemA">{{form.contactor}}</el-form-item>
        <el-form-item label="申请时间:" class="formItem formItemA">{{form.createDate}}</el-form-item>
        <el-form-item label="联系电话:" class="formItem formItemA">{{form.phone}}</el-form-item>
        <el-form-item label="收取地址:">{{form.addressDetail}}</el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        style="width: 100%"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        v-if="flag==3"
      >
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="createDate" label="订单完成时间" width="180"></el-table-column>
        <el-table-column prop="siteName" label="订单来源">

        </el-table-column>
        <el-table-column prop="proNum" label="购买数量" v-if="isSureFreight==''"></el-table-column>
        <el-table-column prop="supplyPrice" label="供应价" v-if="isSureFreight==''"></el-table-column>
        <el-table-column prop="amountYuan" label="运费" v-if="isSureFreight==1"></el-table-column>
        <el-table-column prop="amountYuan" label="可开票金额" >
          <!-- <template slot-scope="scope">
            {{scope.row.proNum*scope.row.supplyPrice}}
          </template> -->
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        style="width: 100%"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        v-if="flag==2"
      >
        <el-table-column prop="siteName" label="订单来源" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号/流水号" width="180"></el-table-column>
        <el-table-column prop="createDate" label="完成时间"></el-table-column>
        <el-table-column prop="abstractType" label="服务名称"></el-table-column>
        <el-table-column prop="orderPayAmountYuan" label="订单金额"></el-table-column>
        <el-table-column prop="amountYuan" label="服务费"></el-table-column>
        <el-table-column prop="amountYuan" label="可开票金额"></el-table-column>
      </el-table>
      <div
        class="tablescroll tablescroll1"
        v-if="flag==1"
        style="height: 300px;overflow: hidden;overflow-y: scroll;"
      >
        <table>
          <thead>
            <tr>
              <th width="150">订单号</th>
              <th width="150">订单完成时间</th>
              <th width="150">商品名称</th>
              <th v-if="isSureFreight==''">购买数量</th>
              <th v-if="isSureFreight==''">供应价</th>
              <th v-if="isSureFreight==1">运费</th>
              <th>可开票金额</th>
            </tr>
          </thead>
          <tbody v-for="(item,index) in tableData" :key="index">
            <tr v-for="(childrenitem,childrenindex) in item.orderDetails" :key="childrenindex">
              <td
                :rowspan="item.orderDetails.length"
                v-if="item.orderDetails.length>0&&childrenindex==0"
              >{{item.orderNo}}</td>
              <td>{{item.createDate }}</td>
              <td>{{childrenitem.itemName}}</td>
              <td v-if="isSureFreight==''">{{childrenitem.saleNum}}</td>
              <!--  :rowspan="item.orderDetails.length"
                v-if="item.orderDetails.length>0&&childrenindex==0" -->
              <td v-if="isSureFreight==''">{{childrenitem.supplyPrice}}</td>
              <td v-if="isSureFreight==1">{{childrenitem.amountYuan}}</td>
              <td
                :rowspan="item.orderDetails.length"
                v-if="item.orderDetails.length>0&&childrenindex==0"
              >{{item.amountYuan}}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
      <div style="text-align:right">
        <el-button  size="small" @click="dialogTableVisible=false">取消</el-button>
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </div>
    </div>

    <saveInvoicesInfo ref="saveInvoicesInfo" @freshList="freshList" />
  </el-dialog>
</template>

<script>
import saveInvoicesInfo from '@/components/Finance/saveInvoicesInfo'
export default {
  data () {
    return {
      invoiceValue: '',
      invoiceValuelist: [],
      dialogTableVisible: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      addressList: '',
      flag: '',
      form: {
      },
      amount: '',
      amountYuan: '',
      totalSupplyPrice: '',
      exportOrderFlag: true,
      isSureFreight: '',
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
    }
  },
  mounted () {
    this.siteId = ''
    this.savedo()
  },
  methods: {
    getsupplyName (source) {
      var supplyName = this.form.supplyNameList.filter(item => item.source === source)[0].supplyName
      return supplyName
    },
    comefromFreight (type) {
      this.isSureFreight = type
    },
    getindexs () {
      var mlisturl = JSON.parse(localStorage.getItem('menulistsurl'))
      var currenturl = '/FinancialAllocation'
      let index = mlisturl.findIndex(item => item === currenturl)
      if (index < 0) {
        this.$message.error('您没有财务配置权限')
      } else {
        this.$router.push({
          name: 'FinancialAllocation'
        })
      }
    },
    getinvoiceValue (id) {
      console.log(id)
      this.form = this.invoiceValuelist.filter(item => item.id === id)[0]
    },
    freshList () {
      this.savedo()
    },
    save () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/save'),
        method: 'post',
        data: this.$http.adornData({
          invoicesNo: this.form.invoicesNo,
          type: this.flag,
          operStatus: this.form.operStatus == null ? '' : this.form.operStatus,
          orgId: this.form.orgId,
          invoicesHead: this.form.invoicesHead,
          amount: this.amount,
          amountYuan: this.amountYuan,
          receiver: this.form.contactor,
          receiverPhone: this.form.phone,
          invoiceType: this.form.invoiceType,
          address: this.form.address,
          receiveAddress: this.form.addressDetail,
          rechargeIds: this.rechargeIds
          // createDate: this.form.createDate
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.$message.success('开票成功')
          this.dialogTableVisible = false
          this.packlist(this.siteId, this.flag, this.rechargeIds)
          this.$emit('getreload', 1)
        }
      })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let self = this
      self.rowAndColumn = {}
      if (columnIndex === 0) {
        if (self.rowAndColumn[row.orderNo]) {
          let rowNum = self.rowAndColumn[row.orderNo]
          return {
            rowspan: rowNum,
            colspan: 1
          }
        }
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    importReport () {
      if (this.exportOrderFlag === false) return
      this.exportOrderFlag = false
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/invoices/invoicesinfo/orderListExport'
        ),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            startDate: '',
            endDate: '',
            supplyName: '',
            siteId: this.siteId,
            flag: this.flag,
            rechargeIds: this.rechargeIds
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
          link.download = '导出商品列表.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.exportOrderFlag = true
        }
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.packlist(this.siteId, this.flag, this.rechargeIds)
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.packlist(this.siteId, this.flag, this.rechargeIds)
    },
    savedo () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/savedo'),
        method: 'post',
        data: this.$http.adornData()
      }).then(res => {
        if (res && res.data.code === 0) {
          this.invoiceValuelist = res.data.invoiceInfo
          this.invoiceValue = res.data.dtGiftCompany.id
          this.form = this.invoiceValuelist.filter(item => item.id === this.invoiceValue)[0] || []
        }
      })
    },
    packlist (siteId, flag, rechargeIds) {
      this.rechargeIds = rechargeIds
      this.tableData = []
      this.flag = flag
      this.siteId = siteId
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/orderList'),
        method: 'post',
        data: this.$http.adornData({
          siteId: this.siteId,
          flag: this.flag,
          rechargeIds: this.rechargeIds,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.amount = res.data.info.amount
          this.amountYuan = res.data.info.amountYuan
          // this.totalSupplyPrice = res.data.info.totalSupplyPrice
          this.form.operStatus = res.data.info.operStatus || ''
          this.tableData = res.data.page.list
          this.totalPage = res.data.page.totalCount
        }
      })
    }

  },
  components: {
    saveInvoicesInfo
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
.el-dialog__body {
  padding-top: 0;
}
.formItemA {
  width: 300px;
  margin-bottom: 0 !important;
  vertical-align: top;
}
.tablescroll {
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
    }
  }
}
</style>
