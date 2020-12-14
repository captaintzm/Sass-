<template>
  <div class="selectshoop">
    <div @click="backPage()" class="backPage">返回上一级</div>
    <div class="steps">
      <el-steps :active="2" align-center>
        <el-step title="创建卡券" description></el-step>
        <el-step title="激活卡券" description></el-step>
      </el-steps>
    </div>
    <div class="kexuan">
      <div class="form-order">
        <el-form ref="form" size="mini" label-width="130px">
          <el-form-item label="激活状态" class="reset-size">
            <el-select
              v-model="state"
              placeholder="请选择"
              class="el-selects"
              :style="{'width':'98px'}"
            >
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.siteName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡券编号" class="reset-size">
            <el-input :style="{'width':'181px'}" v-model="couponAccount"></el-input>
          </el-form-item>
          <el-button type="primary" @click="selecthp(couponAccount)">查询</el-button>
          <el-button type="primary" @click="checkDetails(0)">禁用</el-button>
          <el-button type="primary" @click="checkDetails(1)">激活</el-button>
        </el-form>
      </div>
      <div>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="序号" width="60"></el-table-column>
          <el-table-column prop="couponAccount" label="卡券编号" width="180"></el-table-column>
          <el-table-column prop="couponCode" label="卡密" width :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="operStatus" :formatter="stateFormat" label="状态" width="100"></el-table-column>
          <el-table-column prop="blance" :formatter="stateblance" label="是否已兑换" width="100"></el-table-column>
          <el-table-column prop="phone" :formatter="phone" label="绑定手机号" width></el-table-column>
          <el-table-column prop="blance" label="剩余额度" width="180"></el-table-column>
          <el-table-column prop="totalBlance" label="发放额度" width="180"></el-table-column>
        </el-table>
      </div>
    </div>
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
</template>

<script>
export default {
  data () {
    return {
      option: [
        {
          siteName: "全部",
          id: ""
        },
        {
          siteName: "激活",
          id: 1,
        },
        {
          siteName: "禁用",
          id: 0
        }
      ],
      state: "",
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      selectedshop: [],
      packsId: "",
      siteId: "",
      source: "",
      productIds: "",
      itemCode: "",
      itemName: "",
      couponAccount: ""
    }
  },
  watch: {

  },
  mounted () {

  },

  created () {
    this.selecthp()
  },
  methods: {
    backPage () {
      // this.$router.push({path:"/cardticket-setcardticket",query:{id:id}})
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/card/cardyyzx/detailById'),
        method: 'post',
        params: this.$http.adornParams({
          cardId: this.$route.query.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          let voucher = data.voucher
          this.$router.push({ path: "/cardticket-gitcardticket", query: { voucher } })
        } else {
          console.log(121)
        }
      })
    },
    stateFormat (row, column) {
      if (row.blance == row.totalBlance) {
        return '未兑换'
      } else {
        return '已兑换'
      }
    },
    stateblance (row, column) {
      if (row.operStatus == 0) {
        return '禁用'
      } else {
        return '激活'
      }
    },
    // phone(row,column){
    //     if(row.phone){
    //         return phone
    //     }else{
    //         return "无"
    //     }
    // },
    selecthp (couponAccount) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/card/cardyyzx/cardInfoList'),
        method: 'post',
        params: this.$http.adornParams({
          cardYyzxId: this.$route.query.id,
          'page': this.pageIndex,
          'limit': this.pageSize,
          couponAccount: couponAccount,
          operStatus: this.state
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableData = data.page.list
          this.totalPage = data.page.totalCount
          console.log(111)
        } else {
          console.log(121)
        }
      })

    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.selecthp()
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.selecthp()
    },
    initChose () {
      this.totalPage = 0;
      this.pageIndex = 1;
      this.pageSize = 10;

      if (this.chose == 2) {
        return this.selecthp()
      }

      if (this.chose == 1) {
        return this.selectedhp()
      }
    },

    //批量挑选
    checkDetails (operStatus) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/card/cardyyzx/cancle'),
        methods: 'post',
        params: this.$http.adornParams({
          ids: this.productIds,
          operStatus
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.msg)
          this.tableData.length = 0
          this.selecthp()
          this.$message.success('操作成功');
        } else {
          console.log(data.msg)
          this.$message.error('操作失败');
        }
      })
    },
    handleSelectionChange (val) {
      this.productIds = ""
      console.log(val)
      for (let i = 0; i < val.length; i++) {
        this.productIds += val[i].id + ","
        // console.log(this.productIds)
      }
      console.log(this.productIds)
      if (val.length == 0) {
        this.productIds = ""
        console.log(this.productIds)
      }

    },

    //挑选商品

    routes () {
      this.packsId = this.$route.query.packsId
      this.siteId = this.$route.query.siteId
      this.source = this.$route.query.source
      console.log(this.packsId, this.siteId, this.source)
    },


  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';

.selectshoop {
  .backPage {
    color: #FBB471;
    cursor: pointer;
  }

  /deep/ .el-table thead {
    background: #F5F8FF;
  }

  .steps {
    background: #F3F4FA;
  }

  .selectshoop-tab {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    margin-top: 50px;

    .chose {
      width: 192px;
      height: 39px;
      line-height: 39px;
      text-align: center;
      border-radius: 4px 4px 0px 0px;

      &.active {
        background: #FFFFFF;
      }
    }
  }

  .kexuan {
  }

  .form-order {
    padding-left: 10px;
    padding-top: 20px;
    background: #ffffff;

    .reset-size {
      display: inline-block;
      margin-left: 48px;
      margin-right: 37px;

      /deep/ .el-input--mini .el-input__inner {
        height: 34px;
        line-height: 34px;
      }

      /deep/ .el-form-item__label {
        line-height: 34px;
      }
    }
  }
}
</style>
