<template>
  <el-dialog
    title="开票明细"
    :visible.sync="dialogTableVisible"
    width="1000px"
  >
  <span slot="title">
      <span style="font-size:16px;padding-right:5px;">开票明细</span>
      <el-tooltip class="item" effect="light" content="发票总额=商品发票金额+运费发票内容" placement="top">
        <i class="tip_icon"></i>
      </el-tooltip>
  </span>
    <div class="siteWrapper">
      <el-form ref="form" label-width="100px" size="medium">
        <el-form-item label="开票总额:" class="formItem formItemA">{{form.amountYuan}}</el-form-item>
        <el-form-item label="商品发票金额:" class="formItem formItemA">{{form.productAmountYuan}}</el-form-item>
        <el-form-item label="运费发票金额:" class="formItem formItemA">{{form.freightAmountYuan}}</el-form-item>
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
        <el-form-item label="收货人:" class="formItem formItemA">{{form.receiver}}</el-form-item>
        <el-form-item label="申请时间:" class="formItem formItemA">{{form.createDate}}</el-form-item>
        <el-form-item label="联系电话:" class="formItem formItemA">{{form.receiverPhone}}</el-form-item>
        <el-form-item label="收取地址:">{{form.receiveAddress}}</el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
      >
        <el-table-column prop="orderNo" label="订单号" width="80"></el-table-column>
        <el-table-column prop="createDate" label="订单完成时间" width="180"></el-table-column>
        <el-table-column prop="itemName" label="商品名称"></el-table-column>
        <el-table-column prop="saleNum" label="购买数量"></el-table-column>
        <el-table-column prop="distribPrice" label="商品单价"></el-table-column>
        <el-table-column prop="payDistribYuan" label="订单金额"></el-table-column>
        <el-table-column prop="cancelAmountYuan" label="售后金额"></el-table-column>
        <el-table-column prop="invoiceAmountYuan" label="开票金额"></el-table-column>
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
      <div style="text-align:right">
        <el-button  size="small" @click="dialogTableVisible=false">取消</el-button>
      </div>
    </div>
    <!-- <saveInvoicesInfo ref="saveInvoicesInfo" @freshList="freshList" /> -->
  </el-dialog>
</template>

<script>
// import saveInvoicesInfo from '@/components/Finance/saveInvoicesInfo'
export default {
  data () {
    return {
      dialogTableVisible: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      form: {
      },
      id: ''
    }
  },
  mounted () {
  },
  methods: {
    inint (item) {
      this.dialogTableVisible = true
      this.id = item.id
      this.getlist()
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getlist()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getlist()
    },
    getlist () {
      this._http.queryApiInvoicesInfoById({
        id: this.id,
        siteId: this._pageSiteId
      }).then((data) => {
        if (data && data.code === 0) {
          this.form = data.saasApiInvoicesInfo
          this.queryInvoicesOrderDetailList()
        }
      })
    },
    queryInvoicesOrderDetailList () {
      this._http.queryInvoicesOrderDetailList({
        id: this.id,
        siteId: this._pageSiteId,
        page: this.pageIndex,
        limit: this.pageSize
      }).then((data) => {
        if (data && data.code === 0) {
          this.tableData = data.page.list
          this.totalPage = data.page.totalCount
        }
      })
    }
  },
  components: {
    // saveInvoicesInfo
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

</style>
