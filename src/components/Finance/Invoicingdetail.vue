<template>
  <el-dialog
    title="开票明细"
    :visible.sync="dialogTableVisible"
    width="900px"
    :closeOnClickModal="false"
  >
    <div class="siteWrapper">
      <!-- <el-button type="primary" size="small" @click="importReport()">导出</el-button> -->
      <el-form ref="form" label-width="85px" size="medium">
        <el-form-item label="发票金额" class="formItem formItemA">{{form.amountYuan}}</el-form-item>
        <el-form-item label="发票编号" class="formItem formItemA">{{form.invoicesNo}}</el-form-item>
        <el-form-item
          label="发票状态"
          class="formItem formItemA"
          v-if="form.operStatus!=null"
        >{{form.operStatus==1?'待审核':form.operStatus==2?'审核通过':form.operStatus==3?'审核不通过':''}}</el-form-item>
        <el-form-item
          label="发票类型"
          class="formItem formItemA"
        >{{form.invoiceType==1?'增值税专用发票':'增值税普通发票'}}</el-form-item>
        <el-form-item label="发票抬头" class="formItem formItemA">{{form.invoicesHead}}</el-form-item>
        <el-form-item label="收货人" class="formItem formItemA">{{form.receiver}}</el-form-item>
        <el-form-item label="申请时间" class="formItem formItemA">{{form.createDate}}</el-form-item>
        <el-form-item label="联系电话" class="formItem formItemA">{{form.receiverPhone}}</el-form-item>
        <el-form-item label="收取地址">{{form.receiveAddress}}</el-form-item>
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
        <el-table-column prop="siteName" label="订单来源"></el-table-column>
        <el-table-column prop="proNum" label="购买数量" v-if="isSureFreight==''"></el-table-column>
        <el-table-column prop="supplyPrice" label="供应价" v-if="isSureFreight==''"></el-table-column>
        <el-table-column prop="amountYuan" label="运费" v-if="isSureFreight==1"></el-table-column>
        <el-table-column prop="amountYuan" label="可开票金额">
          <!-- <template slot-scope="scope">
             {{scope.row.proNum*scope.row.supplyPrice}}
          </template> -->
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        style="width: 100%"
        height="250px"
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
              <th>购买数量</th>
              <th>供应价</th>
              <th>开票金额</th>
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
              <td>{{childrenitem.saleNum}}</td>
              <td>{{childrenitem.supplyPrice}}</td>
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
        <el-button type="primary" size="small" @click="dialogTableVisible=false">取消</el-button>
      </div>
    </div>

    <saveInvoicesInfo ref="saveInvoicesInfo" />
  </el-dialog>
</template>

<script>
import saveInvoicesInfo from '@/components/Finance/saveInvoicesInfo'
export default {
  data () {
    return {
      dialogTableVisible: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      addressList: '',
      flag: '',
      form: {
      },
      exportOrderFlag: true,
      totalSupplyPrice: '',
      isSureFreight: ''
    }
  },
  mounted () {
    this.rechargeIds = ''
    this.siteId = ''
  },
  methods: {
    comefromFreight (type) {
      this.isSureFreight = type
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
            // startDate: '',
            // endDate: '',
            // supplyName: '',
            // siteId: this.siteId,
            flag: this.flag,
            rechargeIds: this.rechargeIds,
            detailFlag: 1
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
      this.packlist(this.flag, this.rechargeIds)
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.packlist(this.flag, this.rechargeIds)
    },
    savedo (id, flag) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/info'),
        method: 'post',
        data: this.$http.adornData({
          id: id
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.form = res.data.invoicesInfo
          this.rechargeIds = res.data.invoicesInfo.rechargeIds
          this.packlist(flag, this.rechargeIds)
        }
      })
    },
    packlist (flag, rechargeIds) {
      this.rechargeIds = rechargeIds
      this.tableData = []
      this.flag = flag
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/orderList'),
        method: 'post',
        data: this.$http.adornData({
          flag: this.flag,
          rechargeIds: this.rechargeIds,
          page: this.pageIndex,
          limit: this.pageSize,
          detailFlag: 1
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.tableData = res.data.page.list
          this.totalSupplyPrice = res.data.info.totalSupplyPrice
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
  margin-bottom: 0;
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
