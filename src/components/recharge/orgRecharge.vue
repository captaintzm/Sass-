<template>
  <el-dialog title="充值" :visible.sync="dialogRecharge" width="900px" :closeOnClickModal="true">
    <el-form ref="form" :model="form" class="formPannel">
      <el-form-item label="充值金额" label-width="80px">
        <el-input
          v-model.trim="form.price"
          class="w150"
          placeholder="请输入"
          @blur="checkToPrice(form.price)"
          maxlength="6"
        ></el-input>&nbsp;&nbsp;最大金额为50万
      </el-form-item>
      <el-form-item label="上传附件" label-width="80px">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="url"
          :file-list="fileList"
          :headers="myHeaders"
          :on-change="handleChange"
          :on-success="handleUploadSuccess"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="充值备注" label-width="80px">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.mark"></el-input>
        <!-- <el-input v-model="form.mark" placeholder="请输入" class="w150"></el-input> -->
      </el-form-item>
    </el-form>

    <el-form ref="form" :model="searchForm" :inline="true">
      <el-form-item label="商户订单号">
        <el-input v-model.trim="searchForm.payNo" class="w150" placeholder="商户订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getOrderList(searchForm,searchForm.payNo)">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="getdate"
      tooltip-effect="dark"
      style="width: 100%"
      class="mb20"
      height="250px"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="serialNo" label="流水号" align="center" width="140"></el-table-column>
      <el-table-column prop="amount" label="充值金额" align="center"></el-table-column>
      <el-table-column prop="extend" label="充值类型" align="center">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.payWay == 'ye'">余额支付</span>
          <span v-else-if="scope.row.payWay == 'wx'">微信支付</span>
          <span v-else-if="scope.row.payWay == 'alipay'">支付宝支付</span>
          <span v-else-if="scope.row.payWay == 'ycb'">驿车宝支付</span>
          <span v-else-if="scope.row.payWay == 'zh_ywt'">招行一网通支付</span>
          <span v-else-if="scope.row.payWay == 'nh_xyk'">农行信用卡支付</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="payNo" label="商户订单号" align="center" width="200"></el-table-column>
      <el-table-column prop="remarks" label="充值备注" align="center"></el-table-column>
      <el-table-column prop="operTime" label="充值时间" align="center" width="180"></el-table-column>
      <el-table-column prop="operStatus" label="到账状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.abstractType === abstractType &&  scope.row.operStatus == 0">未审核</span>
          <span
            v-else-if="scope.row.abstractType === abstractType &&  scope.row.operStatus == 1"
          >已审核</span>
          <span v-else-if="scope.row.abstractType === abstractType && scope.row.operStatus == 2">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column prop="attachment" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="open(scope.row.attachment)"
            v-if="scope.row.payWayshow==true"
          >查看附件</el-button>
          <el-button
            v-if="scope.row.abstractType === abstractType && scope.row.operStatus == 0"
            type="text"
            @click="handleApproval(scope.row, 1)"
          >通过</el-button>
          <el-button
            v-if="scope.row.abstractType === abstractType && scope.row.operStatus == 0"
            type="text"
            @click="handleApproval(scope.row, 2)"
          >拒绝</el-button>
          <!-- <el-button type="text" class="scopepannel" @click="open(scope.row.attachment)">查看</el-button> -->
        </template>
      </el-table-column>
    </el-table>
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
    <el-form ref="form" :model="form" class="formPannel">
      <el-form-item class="textRight" label-width="10px">
        <el-button @click="dialogRecharge=false">取消</el-button>
        <el-button type="primary" @click="sure" :disabled="disabled">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { } from '@/utils/validate'
export default {
  name: 'orderList',
  data () {
    return {
      disabled: false,
      dialogRecharge: false,
      getSend: [],
      getdate: [],
      url: '',
      form: {
        price: '',
        mark: ''
      },
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      fileList: [],
      searchForm: {
        orgId: '',
        payNo: '' // 商户订单号
      },
      abstractType: '额度充值-线下充值' // 类型线下汇款
    }
  },
  created () {
    this.init()
  },
  mounted () { },
  methods: {
    open (item) {
      window.open(item, '_blank')
    },
    handleApproval (item, status) {
      console.log(item, status)
      let s = ''
      if (status === 1) {
        s = '是否确认线下汇款已到账？'
      } else {
        s = '是否确认线下汇款未到账？'
      }
      this.$confirm(s, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.dialogRecharge = false
        this.$http({
          url: this.$http.adornUrl(
            '/ybt-backend/finance/orgaccountrecharge/checkSelfRecharge'
          ),
          method: 'post',
          data: this.$http.adornData(
            {
              serialNo: item.serialNo,
              operStatus: status
            }, true
          )
        }).then(res => {
          console.log(res)
        })
      })
    },
    checkToPrice (val) {
      this.form.price = checkToPrice(val)
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
      if (response.code == 500) {
        this.$message.error('请按照正确的格式上传')
        // this.$refs.upload.clearFiles()
      }
      this.fileList.length = 0
      this.fileList.push({
        name: file.name,
        url: response.url
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
    clearInint () {
      this.fileList = []
      this.form.mark = ''
      this.form.price = ''
    },
    getOrderList (item, payNo) {
      this.searchForm.orgId = item.orgId
      this.searchForm.payNo = payNo
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/finance/orgaccount/getRechargeFlow'
        ),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: item.orgId,
            payNo: payNo,
            abstractType: '额度充值',
            page: this.pageIndex,
            limit: this.pageSize
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.rechageList.length; index++) {
            const element = res.data.rechageList[index]
            if (element.payWay === 'wx' || element.payWay === 'alipay') {
              element.payWayshow = false
            } else {
              element.payWayshow = true
            }
          }
          this.getdate = res.data.rechageList
        }
      })
    },
    sure () {
      if (this.form.price === '' || this.form.price === undefined) {
        this.$message.error('请输入充值金额')
        return false
      }
      if (this.form.price > 500000) {
        this.$message.error('充值金额大于50万了，请重新输入')
        return false
      }
      if (this.fileList.length === 0) {
        this.$message.error('请上传附件')
        return false
      }
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/orgaccount/recharge'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.searchForm.orgId,
            amount: this.form.price,
            remarks: this.form.mark,
            attachment: this.fileList[0].url
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.$message.success(res.data.msg)
          this.dialogRecharge = false
          this.clearInint()
          this.$emit('orgAccountInfo', res)
        } else {
          this.$message.error(res.data.msg)
        }
        this.disabled = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formPannel {
  .formItem {
    display: inline-block;
  }
}
.site-wrapper .el-pagination {
  text-align: left;
}
</style>
