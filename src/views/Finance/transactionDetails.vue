<template>
  <div class="wapper">
    <h2 class="mb20">
      交易明细
      <i class="tip_icon">
        <span class="tip">本页面主要用于公司与其客户对账</span>
      </i>
    </h2>
      <NavSteps
      stepText1="商城充值"
      stepText2="商城交易明细"
      styleName="2"
      @clickToLink="clickLink"
    ></NavSteps>
      <div class="tips">
       <span>说明：商城账户变动是以分销价为结算依据，点击详情可查看对应的具体订单</span>
      </div>
      <div class="mb20"> </div>
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="起止日期" class="formItem">
        <el-date-picker
          v-model="form.orderTime"
          type="datetimerange"
          :picker-options="pickerOptions1"
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
      <el-form-item label="交易" class="formItem">
        <el-input v-model.trim="form.numNo" placeholder="请输入交易内容"></el-input>
      </el-form-item>
      <el-form-item label="交易类型" class="formItem">
        <el-select v-model="form.jyType" class="w90" @change="getkey">
          <el-option label="全部" value></el-option>
          <el-option label="收入" value="1"></el-option>
          <el-option label="支出" value="2"></el-option>
          <!-- <el-option label="物流单号" value="danhao"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="商城名称" class="formItem">
        <el-input v-model.trim="form.siteName" placeholder="请输入商城名称"></el-input>
      </el-form-item>
      <el-button type="primary" @click="searchOrderTag">搜索</el-button>
      <el-button type="primary" @click="importReport">导出</el-button>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="siteName" label="商城名称"></el-table-column>
      <el-table-column prop="serialNo" label="流水号" width="180"></el-table-column>
      <el-table-column prop="operTime" label="交易时间" width="180"></el-table-column>
      <el-table-column prop="dealType" label="交易类型"></el-table-column>
      <el-table-column prop="content" label="交易内容"></el-table-column>
      <el-table-column prop="amount" label="商城账户变动（元）"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            v-if="scope.row.abstractType=='订单下单'"
          >详情</el-button>
          <span v-else> - -</span>
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
  </div>
</template>

<script>
import NavSteps from '@/components/steps/NavSteps'
export default {
  name: 'orderList',
  data () {
    return {
      pickerOptions1: {
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
      form: {
        orderTime: '',
        name: '',
        numNo: '',
        jyType: '',
        siteName: ''
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
    this.getOrderList()
  },
  methods: {
    clickLink (type) {
      if (type === 1) {
        this.$router.push({ path: '/rechargeManagement' })
      } else {
        this.$router.push({ path: '/transactionDetails' })
      }
    },
    importReport () {
      if (this.form.orderTime === null || this.form.orderTime === '') {
        this.$message.error('请选择起止日期')
        return false
      }
      if (this.exportOrderFlafa === false) return
      this.exportOrderFlafa = false

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/mallaccount/export'),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            startDate: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[0],
            endDate: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[1],
            siteName: this.form.siteName,
            dealType: this.form.jyType,
            orderNo: this.form.numNo
          }, true)
      }).then((res) => {
        if (res) {
          let blob = new Blob([res.data], {
            type: 'application/x-xls',
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = '交易明细.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.exportOrderFlafa = true
        }
      })
    },
    // 关键字
    getkey (id) {
      console.log(id)
      this.form.jyType = id
    },
    getOrderList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/mallaccount/listRechargeFlow'),
        method: 'post',
        data: this.$http.adornData({
          startDate: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[0],
          endDate: this.form.orderTime === null || this.form.orderTime === '' ? '' : this.form.orderTime[1],
          siteName: this.form.siteName,
          dealType: this.form.jyType,
          orderNo: this.form.numNo,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.page.list.length; index++) {
            const element = res.data.page.list[index]
            element.dealType = element.dealType === '1' ? '收入' : '支出'
            element.orderNo = element.orderNo == null ? '' : element.orderNo
            if (element.orderNo === '') {
              element.content = element.abstractType
            } else {
              element.content = element.abstractType + '-' + element.orderNo
            }
          }
          this.tableData = res.data.page.list
          this.totalPage = res.data.page.totalCount
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
    searchOrderTag () {
      this.pageIndex = 1
      this.getOrderList()
    },
    handleClick (item) {
      this.$router.push('/orderDetail?orderNo=' + item.orderNo)
    },
    selectTimeOrderTime (val) {
      console.log(val)
      this.form.orderTime = val
    }

  },
  components: {
    NavSteps
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
  .formItem {
    display: inline-block;
  }
    .tips{
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding:15px 24px;
    color: #333;
    background-color: #f5f8fc;
    border-radius: 6px;
  }
}
</style>
