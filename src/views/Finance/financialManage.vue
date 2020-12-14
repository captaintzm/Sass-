<template>
  <div class="wapper">
    <div class="order-nav">
      <ul>
        <li
          v-for="item in ordernavlist"
          :key="item.type"
          :class="{'active':item.select==true}"
          @click="selecThis(item)"
          v-html="item.name"
        >
        </li>
      </ul>
    </div>
    <div class="formList">
      <el-form ref="form" :model="form" label-width="80px" size="medium">
        <el-form-item label="发生日期" class="formItem">
          <el-date-picker
            unlink-panels
            v-model="form.orderTime"
            type="datetimerange"
            :picker-options="pickerOptions2"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
              :default-time="['00:00:00', '23:59:59']"
            @change="selectTimeOrderTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发票编号" class="formItem">
          <el-input v-model.trim="form.invoicesNo" placeholder="" class="w140"></el-input>
        </el-form-item>

        <el-form-item label="开票状态" class="formItem" placeholder="请选择">
          <el-select v-model="form.operStatus" class="w110">
            <el-option label="全部" value></el-option>
            <el-option label="审核中" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" class="formItem">
          <el-input v-model.trim="form.siteName" placeholder="" class="w140"></el-input>
        </el-form-item>
        <el-form-item class="formItem" label-width="10px">
          <el-button type="primary" @click="search()">搜索</el-button>
          <el-button type="primary" @click="exportOrder()" :loading="loadingexportOrder">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
      <div class="tablescroll">
            <el-table
              height="600"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%;overflow: hidden;"
              :header-cell-style="{color:'#333',background:'#F5F7FA'}"
            >
              <el-table-column align="center" prop="amountYuan" label="发票金额"></el-table-column>
              <el-table-column   align="center" prop="invoicesNo" label="申请流水号"></el-table-column>
              <el-table-column   align="center" prop="createDate" label="申请时间"></el-table-column>
              <el-table-column   align="center" prop="siteName" label="所属项目"></el-table-column>
              <el-table-column   align="center" prop="operStatus" label="开票状态">
                <template slot-scope="scope">
                 <span v-html="getOperStatus(scope.row.operStatus)"></span>
                </template>
              </el-table-column>
              <el-table-column prop="states" label="操作" width="250">
                <template slot-scope="scope">
                   <!-- 1：待审核 2：审核通过 3：审核不通过 -->
                    <el-button  type="text" size="small" @click="detail(scope.row)">详情</el-button>
                    <el-button  type="text" size="small" @click="invoiceConfirm(scope.row,2)" v-if="scope.row.operStatus==1">通过</el-button>
                    <el-button  type="text" size="small" @click="invoiceConfirm(scope.row,3)" v-if="scope.row.operStatus==1">不通过</el-button>
                    <el-button  type="text" size="small" v-if="scope.row.operStatus==2 && scope.row.logisticsStatus!=1" @click="writedetail(scope.row)">填写发票物流</el-button>
                    <el-button  type="text" size="small" v-if="scope.row.logisticsStatus==1" @click="lookdetail(scope.row)">查看发票物流</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
    <!-- 详情 -->
    <financeDetail ref="InvoicingManagement" />
    <!-- 查看发票物流 -->
    <invoiceLook ref="invoiceLooks"/>
    <invoiceWrite ref="invoiceWrites"/>
  </div>
</template>
<script>
import financeDetail from '@/components/Finance/financeDetail'
import invoiceLook from '@/components/Finance/invoiceLook'
import invoiceWrite from '@/components/Finance/invoiceWrite'
import axios from 'axios'
export default {
  name: 'orderList',
  data () {
    return {
      loadingexportOrder: false,
      siteId: this._pageSiteId,
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
      ordernavlist: [
        {
          name: '全部',
          type: '',
          select: true
        },
        {
          name: '待审核（<span style="color:red">审核中</span>）',
          type: 1,
          select: false
        },
        {
          name: '审核通过',
          type: 2,
          select: false
        },
        {
          name: '审核不通过',
          type: 3,
          select: false
        }
      ],
      form: {
        orderTime: '',
        startDate: '',
        endDate: '',
        operStatus: '',
        siteName: '',
        invoicesNo: ''
      },
      tableData: [],
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  mounted () {

  },
  created () {
    this.getOrderList()
  },
  watch: {
  },
  methods: {
    // 填写
    writedetail (item) {
      this.$refs.invoiceWrites.inint(item)
    },
    // 查看
    lookdetail (item) {
      this.$refs.invoiceLooks.inint(item)
    },
    // 详情
    detail (item) {
      this.$refs.InvoicingManagement.inint(item)
    },
    // 通过 不通过
    invoiceConfirm (item, operStatus) {
      if (operStatus === 2) {
        this.$confirm(`是否确认通过该发票审核`, '审核提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          this._http.invoiceConfirm({
            id: item.id,
            operStatus: operStatus,
            siteId: this._pageSiteId
          }).then((data) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.getOrderList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => { })
      } else {
        this.$prompt('是否确认不通过该发票审核', '审核提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入不通过的原因(必填)',
          inputPattern: /^[^.]+$/,
          inputErrorMessage: '请输入不通过的原因',
          closeOnClickModal: false
        }).then(({ value }) => {
          this._http.invoiceConfirm({
            id: item.id,
            operStatus: operStatus,
            remarks: value,
            siteId: this._pageSiteId
          }).then((data) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.getOrderList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {

        })
      }
    },
    getOperStatus (operStatu) {
      switch (Number(operStatu)) {
        case 1:
          return '审核中'
        case 2:
          return '审核通过'
        case 3:
          return '审核不通过'
      }
    },
    selectTimeOrderTime (val) {
      this.form.orderTime = val
      this.form.startDate = val && val[0]
      this.form.endDate = val && val[1]
    },
    search () {
      this.pageIndex = 1
      this.getOrderList()
    },
    // 导出
    exportOrder () {
      if (!this.form.endDate) {
        this.$message.error('请选择发生日期')
        return false
      }
      this.loadingexportOrder = true
      axios({
        method: 'post',
        responseType: 'arraybuffer',
        url: '/ybt-backend/apiInvoice/exportApiInvoicesApplyListr',
        data: {
          operStatus: this.form.operStatus,
          siteName: this.form.siteName,
          invoicesNo: this.form.invoicesNo,
          siteId: this._pageSiteId,
          startDate: this.form.startDate,
          endDate: this.form.endDate
        }
      }).then((res) => {
        if (res) {
          let blob = new Blob([res.data], {
            type: 'application/x-xls',
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = '发票列表.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.loadingexportOrder = false
        }
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getOrderList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getOrderList()
    },
    selecThis (item) {
      this.ordernavlist.forEach((item) => {
        item.select = false
      })
      item.select = true
      this.form.operStatus = item.type
      this.pageIndex = 1
      this.getOrderList()
    },
    getOrderList () {
      this.tableData = []
      this._http.queryApiInvoicesListPage({
        operStatus: this.form.operStatus,
        siteName: this.form.siteName,
        invoicesNo: this.form.invoicesNo,
        siteId: this._pageSiteId,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
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
    financeDetail,
    invoiceLook,
    invoiceWrite
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  .w140 {
    width: 140px;
  }
  .order-nav {
    ul {
      border-bottom: #dddddd 1px solid;
    }
    li {
      padding:0 30px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      top: 2px;
      position: relative;
      transition: 0.2s ease;
      border: #ffffff 1px solid;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;
      &.active {
        border: #dddddd 1px solid;
        border-bottom: #ffffff 1px solid;
        background-color: #fff;
      }
    }
  }
  .formList {
    padding: 20px;
    padding-bottom: 0;
    .formItem {
      display: inline-block;
    }
  }
  .badgemark {
    position: absolute;
    right: 0px;
    top: -9px;
  }
  .kaipiao{
    span,p{
      color:#999999;
      font-size: 12px;
    }
    span{
      padding-left:20px;
    }
    p{
      line-height: 20px;
      padding-top:10px;
    }
  }
}
</style>
