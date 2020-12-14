<template>
  <div class="wapper">
    <h2 class="mb20">
      充值管理
      <i class="tip_icon">
        <span class="tip">可对商城进行充值及填写备注，充值的每条记录均会记录</span>
      </i>
    </h2>
      <NavSteps
      stepText1="商城充值"
      stepText2="商城交易明细"
      styleName="1"
      @clickToLink="clickLink"
    ></NavSteps>
    <div class="tips">
       <span>说明：此处充值代表商城可用额度，仅为记账用。建议您根据客户实际打款金额进行充值，以便后期对账</span>
        <!-- <div style="position:relative">
        <el-button v-if="!iscreatedSite()" @click.stop="addSite" type="primary">创建商城</el-button>
        <el-popover placement="bottom-start" trigger="hover" popper-class="recharge-pop">
          <div class="pop-content">
            <p>积分商城</p>
            <el-button @click="$router.push({path: 'memberRecharge'})" size="mini">立即升级</el-button>
          </div>
          <el-button v-if="iscreatedSite()" type="info" slot="reference">去创建商城</el-button>
        </el-popover>
      </div> -->
      </div>
   <div class="mb20"> </div>
    <el-form ref="form" :model="form">
      <el-form-item label="商城名称">
        <el-input v-model.trim="form.name" class="w150" placeholder="请输入"></el-input>
        <el-button type="primary" @click="searchOrderTag">搜索</el-button>
        <el-button type="primary" @click="importReport">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="number" label="序号" width="80"></el-table-column>
      <!-- <el-table-column prop="PriceDeduct" label="创建人"></el-table-column> -->
      <el-table-column prop="siteName" label="商城名称"></el-table-column>
      <el-table-column prop="siteType" label="商城类型">
        <template slot-scope="scope">
          <span v-html="getsiteType(scope.row.siteType)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="balanceYuan" label="可用额度（元）"></el-table-column>
      <el-table-column prop="usedBalanceYuan" label="已用额度（元）"></el-table-column>
      <el-table-column prop="createDate" label="创建日期" width="180"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">充值/记录</el-button>
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
    <recharge ref="rechargeInfo" @mallAccountInfo="mallAccountInfo"></recharge>
  </div>
</template>

<script>
import recharge from '@/components/recharge/recharge'
import NavSteps from '@/components/steps/NavSteps'
export default {
  name: 'orderList',
  data () {
    return {
      form: {
        name: ''
      },
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      addPoints: false,
      tableData: [],
      exportOrderFlafa: true,
      orgInfo: {}
    }
  },
  mounted () {
    this.type = 1
    this.getOrderList()
  },
  created () {
    this.getOrgVipDetail()
  },
  methods: {
    getsiteType(type){
      switch(Number(type)){
        case 1:
        return '积分商城'
        case 2:
        return '分期商城'
        case 3:
        return 'api商城'
      
      }
    },
    addSite () {
      var userInfo = JSON.parse(localStorage.getItem('userInfo'))
      var orgType = userInfo.sysOrganization.type
      if (orgType === 2) {
        this.$router.push({ path: '/basicInfo' })
      } else {
        this.$router.push({ path: '/choiceModel' })
      }
    },
    getOrgVipDetail () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/orgVipDetail'),
        method: 'post',
        params: this.$http.adornParams({
          orgId: localStorage.getItem('orgId')
        })
      }).then(({data}) => {
        console.log(data)
        if (data.code === 0) {
          this.orgInfo = data.result
        }
      })
    },
    iscreatedSite () {
      if (this.orgInfo === null || (this.orgInfo.overdueFlag === '1' && this.orgInfo.vipType === 1 && this.siteList.length < 6) || this.orgInfo.overdueFlag === '1' && this.orgInfo.vipType > 1) {
        return false
      }
      return true
    },
    toCreateSite () {
      this.$router.push({
        name: 'choiceModel'
      })
    },
    clickLink (type) {
      if (type === 1) {
        this.$router.push({ path: '/rechargeManagement' })
      } else {
        this.$router.push({ path: '/transactionDetails' })
      }
    },
    mallAccountInfo () {
      this.getOrderList()
    },
    getOrderList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/mallaccount/list'),
        method: 'post',
        data: this.$http.adornData({
          siteName: this.form.name,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.page.list.length; index++) {
            const element = res.data.page.list[index]
            element.number = index + 1
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
    importReport () {
      if (this.exportOrderFlafa === false) return
      this.exportOrderFlafa = false
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/finance/mallaccount/exportRechargeList'),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            siteName: this.form.name// 订单状态
          }, true)
      }).then((res) => {
        if (res) {
          let blob = new Blob([res.data], {
            type: 'application/x-xls',
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = '商城充值明细.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
          this.exportOrderFlafa = true
        }
      })
    },
    handleClick (item) {
      this.$refs.rechargeInfo.getList(item)
      this.$refs.rechargeInfo.dialogRecharge = true
    }
  },
  components: {
    recharge,
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
