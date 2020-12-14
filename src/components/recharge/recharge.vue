<template>
  <el-dialog title="充值" :visible.sync="dialogRecharge" width="900px" :closeOnClickModal="false">
    <el-form ref="form" :model="form" class="formPannel">
      <el-form-item label="充值金额" label-width="80px">
        <el-input
          v-model="form.price"
          placeholder="请输入"
          class="w150"
          @blur="checkToPrice(form.price)"
          maxlength="6"
        ></el-input>&nbsp;&nbsp;最大金额为50万
      </el-form-item>
      <el-form-item label="充值备注" label-width="80px">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.mark"></el-input>
        <!-- <el-input v-model="form.mark" placeholder="请输入" class="w150"></el-input> -->
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
      <el-table-column prop="serialNo" label="流水号"></el-table-column>
      <el-table-column prop="amount" label="充值金额"></el-table-column>
      <el-table-column prop="remarks" label="充值备注" width="200"></el-table-column>
      <el-table-column prop="operTime" label="充值时间" width="200"></el-table-column>
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
import { checkToPrice } from '@/utils/validate'
export default {
  name: 'orderList',
  data () {
    return {
      disabled: false,
      dialogRecharge: false,
      getSend: [],
      getdate: [],
      form: {
        price: '',
        mark: ''
      },
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      mallId: ''
    }
  },

  methods: {
    checkToPrice (val) {
      this.form.price = checkToPrice(val)
    },
    clearInint () {
      this.fileList = []
      this.form.mark = ''
      this.form.price = ''
    },
    getList (item) {
      this.mallId = item.siteId
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/mallaccount/getRechargeFlow'),
        method: 'post',
        data: this.$http.adornData({
          mallId: item.siteId
          // page: this.pageIndex,
          // limit: this.pageSize
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
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
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/mallaccount/recharge'),
        method: 'post',
        data: this.$http.adornData({
          mallId: this.mallId,
          amount: this.form.price,
          remarks: this.form.mark
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.$message.success(res.data.msg)
          this.dialogRecharge = false
          this.clearInint()
          this.$emit("mallAccountInfo", res)
        } else {
          this.$message.error(res.data.msg)
        }
        this.disabled = false
      })
    },

    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getList()
    },

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