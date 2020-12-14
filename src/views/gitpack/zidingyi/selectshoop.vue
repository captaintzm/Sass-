<template>
  <div class="site-Wrapper">
    <div class="selectshoop">
      <!-- <div @click="backPage()" class="backPage">返回上一级</div> -->
      <ybtSteps stepText1="创建礼包" stepText2="挑选商品" stepText3="分发礼包" styleName="2"></ybtSteps>
      <!-- <div class="steps"> -->
      <!-- <el-steps :active="2" align-center>
          <el-step title="创建礼包" description></el-step>
          <el-step title="挑选商品" description></el-step>
      </el-steps>-->
      <!-- </div> -->
      <div class="selectshoop-tab">
        <div
          class="chose"
          v-for="(item,index) in choseList"
          :key="index"
          @click="chose=item.chose"
          :class="{active:item.chose==chose}"
        >{{item.name}}</div>
        <!-- <div class="tab-kexuan">可选商品</div> -->
      </div>
      <div class="kexuan">
        <div class="form-order" v-if="chose==2">
          <el-form ref="form" size="mini" label-width="50px">
            <el-form-item label="ID" class="reset-size">
              <el-input :style="{'width':'98px'}" v-model="itemCode"></el-input>
            </el-form-item>
            <el-form-item label="名称" class="reset-size">
              <el-input :style="{'width':'181px'}" v-model="itemName"></el-input>
            </el-form-item>
            <el-button type="primary" @click="selecthp()">查询</el-button>
            <el-button type="primary" @click="checkDetails">批量加入</el-button>
          </el-form>
        </div>
        <div class="form-order" v-if="chose==1">
          <el-form ref="form" size="mini" label-width="130px">
            <span>已选商品数：</span>
            <span>{{selectedshop.length}}</span>
            <span :style="{'margin-left':'50px'}">礼包最大金额：</span>
            <span>{{totalPrice.toFixed(2)}}</span>
            <span :style="{'color':'#FBB471','margin':'0 50px'}">提示：根据礼包允许商品个数计算</span>
            <el-button type="primary" @click="chose=2">挑选商品</el-button>
            <el-button @click="nextstep">保存上架</el-button>
          </el-form>
        </div>
        <div v-show="chose==2">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :header-cell-style="{color:'#333',background:'#F5F7FA'}"
          >
            <el-table-column type="selection" width="55" v-if="chose==2"></el-table-column>
            <el-table-column prop="itemCode" label="商品编码" width="180"></el-table-column>
            <el-table-column prop="itemName" label="商品名称" width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="supplyName" label="供应商"></el-table-column>
            <el-table-column prop="supplyPrice" label="供应价" width="180"></el-table-column>
            <el-table-column prop="salePrice" label="销售价" width="180"></el-table-column>
            <el-table-column prop="profitPercent" label="利润比(%)" width="180"></el-table-column>
            <el-table-column prop="operStatus" :formatter="stateFormat" label="状态" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" @click="checkDetail(scope.row)">挑选加入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="chose==1">
          <el-table :data="selectedshop" stripe style="width: 100%">
            <el-table-column prop="itemCode" label="商品编码" width="180"></el-table-column>
            <el-table-column prop="itemName" label="商品名称" width="180" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="supplyName" label="供应商"></el-table-column>
            <el-table-column prop="supplyPrice" label="供应价" width="180"></el-table-column>
            <el-table-column prop="salePrice" label="销售价" width="180"></el-table-column>
            <el-table-column prop="profitPercent" label="利润比(%)" width="180"></el-table-column>
            <el-table-column prop="operStatus" :formatter="stateFormat" label="状态" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="detach(scope.row)">移除</el-button>
              </template>
            </el-table-column>
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
  </div>
</template>

<script>
import ybtSteps from '@/components/steps/ybtSteps'
export default {
  data () {
    return {
      ffStatus: '',
      totalPrice: 0,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tableData: [],
      selectedshop: [],
      packsId: '',
      siteId: '',
      source: '',
      productIds: '',
      itemCode: '',
      itemName: '',
      choseList: [
        {
          name: '已选商品',
          chose: 1
        },
        {
          name: '可选商品',
          chose: 2
        }
      ],
      chose: 2
    }
  },
  watch: {
    // '$route'(to,from){
    //     if(to.path==="/gitpack-zidingyi-selectshoop"){
    //         console.log(this.$route.path)
    //         this.routes()
    //         this.selecthp()
    //         // this.selecthp()
    //     }
    // },
    chose () {
      this.initChose()
    }
  },
  mounted () {

  },
  created () {
    this.routes()
    this.selecthp()
  },
  methods: {
    backPage () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/detailById'),
        method: 'post',
        params: this.$http.adornParams({
          id: this.$route.query.packsId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)

          let mallSites = data.mallSites
          let packsInfo = data.packsInfo
          let sources = data.sources
          let packsInfoAdrr = data.packsInfoAdrr
          let userList = data.userList
          // console.log(mallSites,packsInfo,sources)
          this.$router.push({ path: '/gitpack-zidingyi-gitpack', query: { mallSites, packsInfo, sources, id: this.$route.query.packsId } })
        } else {
          console.log(121)
        }
      })
    },
    stateFormat (row, column) {
      if (row.operStatus == 3) {
        return '上架'
      } else {
        return '下架'
      }
    },
    nextstep () {
      if (this.selectedshop.length > 0) {
      } else {
        return this.$message.error('您还没有挑选商品')
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/uptStatus'),
        methods: 'post',
        params: this.$http.adornParams({
          packsId: this.$route.query.packsId,
          operStatus: 1
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$router.push({ path: '/gitpack-zidingyi-packlist' })
        } else {
          console.log(data.msg)
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
      this.totalPage = 0
      this.pageIndex = 1
      this.pageSize = 10

      if (this.chose === 2) {
        return this.selecthp()
      }

      if (this.chose === 1) {
        return this.selectedhp()
      }
    },

    // 批量挑选
    checkDetails () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/saveselectpro'),
        methods: 'post',
        params: this.$http.adornParams({
          packInfoId: this.$route.query.packsId,
          productIds: this.productIds,
          productSource: this.$route.query.source
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.msg)
          this.$message.success('操作成功')
          this.tableData.length = 0
          this.selecthp()
        } else {
          console.log(data.msg)
        }
      })
    },

    handleSelectionChange (val) {
      this.productIds = ''
      console.log(val)
      for (let i = 0; i < val.length; i++) {
        this.productIds += val[i].id + ','
        // console.log(this.productIds)
      }
      console.log(this.productIds)
      if (val.length === 0) {
        this.productIds = ''
        console.log(this.productIds)
      }
    },
    // 挑选商品
    checkDetail (val) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/saveselectpro'),
        method: 'post',
        params: this.$http.adornParams({
          packInfoId: this.$route.query.packsId,
          productIds: val.id,
          productSource: this.$route.query.source

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          this.$message.success('操作成功')
          // this.packtodolist=data.page.list
          // this.totalPage = data.page.totalCount
          // console.log(this.packtodolist)
          this.tableData.length = 0
          this.selecthp()
        } else {
          console.log(121)
        }
      })
    },

    // 移除
    detach (val) {
      console.log(val)
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/removeproduct'),
        method: 'post',
        params: this.$http.adornParams({
          packInfoId: this.$route.query.packsId,
          productId: val.id,
          productSource: this.$route.query.source

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          this.selectedshop.length = 0
          this.selectedhp()
          // this.packtodolist=data.page.list
          // this.totalPage = data.page.totalCount
          // console.log(this.packtodolist)
        } else {
          console.log(121)
        }
      })
    },
    routes () {
      if (JSON.stringify(this.$route.query) == '{}') {

      } else {
        this.packsId = this.$route.query.packsId
        this.siteId = this.$route.query.siteId
        this.source = this.$route.query.source
        this.ffStatus = this.$route.query.ffStatus
        console.log(this.packsId, this.siteId, this.source)
      }
    },

    // 可选商品列表
    selecthp () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/selectProduct'),
        method: 'post',
        params: this.$http.adornParams({
          packsId: this.$route.query.packsId,
          siteId: this.$route.query.siteId,
          source: this.$route.query.source,
          itemCode: this.itemCode,
          itemName: this.itemName,
          'page': this.pageIndex,
          'limit': this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          // this.tableData=this.tableData.concat(data.page.list)
          this.tableData = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          console.log(121)
        }
      })
    },

    // 已选商品列表
    selectedhp () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/productList'),
        method: 'post',
        params: this.$http.adornParams({
          packsId: this.$route.query.packsId,
          'page': this.pageIndex,
          'limit': this.pageSize
          // siteId:this.$route.query.siteId,
          // source:this.$route.query.source

        })
      }
      ).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          this.totalPrice = data.totalPrice
          this.selectedshop = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          console.log(121)
        }
      })
    }
  },
  components: {
    ybtSteps
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
// @import '../../common/css/variable.styl';
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
    border-bottom: #dddddd 1px solid;

    .chose {
      min-width: 92px;
      height: 56px;
      line-height: 48px;
      text-align: center;
      top: 2px;
      position: relative;
      border: 1px solid transparent;
      -webkit-transition: 0.2s ease;
      -o-transition: 0.2s ease;
      transition: 0.2s ease;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;

      &.active {
        border: 1px solid #d7e0f1;
        background-color: #fff;
        border-bottom: 2px solid #fff;
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
