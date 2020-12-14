<template>
  <div class="wapper">
    <h2 class="mb20">机构资金</h2>
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="机构名">
        <el-input v-model.trim="form.name" class="w150" placeholder="编码或名称"></el-input>
      </el-form-item>
      <el-form-item label="商户订单号">
        <el-input v-model.trim="form.payNo" class="w210" placeholder="商户订单号"></el-input>
        <el-button type="primary" @click="searchOrderTag">搜索</el-button>
        <el-button type="primary" @click="importReport">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="accNo" label="编号" width="180"></el-table-column>
      <el-table-column prop="orgName" label="机构名称" width="180"></el-table-column>
      <el-table-column prop="totalBalanceYuan" label="累计充值"></el-table-column>
      <el-table-column prop="usedBalanceYuan" label="已用额度（元）"></el-table-column>
      <el-table-column prop="balanceYuan" label="可用额度（元）"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">充值/详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <orgRecharge ref="rechargeInfo" @orgAccountInfo="orgAccountInfo"></orgRecharge>
  </div>
</template>

<script>
import orgRecharge from '@/components/recharge/orgRecharge';

export default {
  name: 'orderList',
  data () {
    return {
      form: {
        name: '',
        payNo: ''
      },
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      addPoints: false,
      tableData: [],
      exportOrderFlafa: true

    }
  },
  mounted () {
    this.type = 1
    // this.$refs.rechargeInfo.dialogRecharge = true
    this.getOrderList()
  },
  methods: {
    importReport () {
      if (this.exportOrderFlafa === false) return
      this.exportOrderFlafa = false
      this.$http({
        url: this.$http.adornUrl("/ybt-backend/finance/orgaccount/exportAccount"),
        method: "post",
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            orgName: this.form.name,// 订单状态
            payNo: this.form.payNo
          }, true)
      }).then((res) => {
        if (res) {
          let blob = new Blob([res.data], {
            type: 'application/x-xls',
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = '机构账户额度.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.exportOrderFlafa = true
        }
      })
    },
    orgAccountInfo () {
      this.getOrderList()
    },
    getOrderList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/orgaccount/list'),
        method: 'post',
        data: this.$http.adornData({
          orgName: this.form.name,
          payNo: this.form.payNo,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.tableData = res.data.page.list
          this.totalPage = res.data.page.totalCount
        }
      })
    },

    handleClick (item) {
      this.$refs.rechargeInfo.clearInint()
      this.$refs.rechargeInfo.getOrderList(item, this.form.payNo)
      this.$refs.rechargeInfo.dialogRecharge = true
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
    searchOrderTag () {
      this.pageIndex = 1
      this.getOrderList()
    },



  },
  components: {
    orgRecharge
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  h2 {
    border-left: 4px solid #3E8EF7;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
  }
  .orderNumList {
    max-height: 200px;
    overflow-y: scroll;
    .orderNumItem {
      border-bottom: #dddddd 1px solid;
      width: 580px;
      padding: 10px 0;
      span {
        margin-right: 15px;
        &.s1 {
          width: 52px;
          display: inline-block;
        }
      }
    }
  }
  .del {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #ffffff;
    background: #4386f4;
    display: inline-block;
    cursor: pointer;
    margin-left: 50px;
  }
}
</style>

