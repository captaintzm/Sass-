<template>
  <div class="wapper">
    <h2 class="mb20">
      商品列表
      <el-button
        type="primary"
        @click="add"
        style="float:right"
        v-if="roleType!=1"
      >新增</el-button>
    </h2>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="实物商品" name="1"></el-tab-pane>
      <el-tab-pane label="虚拟商品" name="3"></el-tab-pane>
    </el-tabs>
    <div class="site-content">
      <div class="searchBlock">
        <div class="searchPannel">
          <el-form ref="form" :model="form" label-width="80px" size="medium">
            <el-form-item label="供应价" class="formItem">
              <el-input v-model="form.lowestSupplyPrice" placeholder="最低" class="fipt"></el-input>
              <span>-</span>
              <el-input v-model="form.highestSupplyPrice" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="市场价" class="formItem">
              <el-input v-model="form.lowestMarkPrice" placeholder="最低" class="fipt"></el-input>
              <span>-</span>
              <el-input v-model="form.highestMarkPrice" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="利润率" class="formItem">
              <el-input v-model="form.lowestProfit" placeholder="最低" class="fipt"></el-input>
              <span>-</span>
              <el-input v-model="form.highestProfit" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="商品" class="formItem">
              <el-input v-model="form.itemCodeOrName" placeholder="名称或者编号" class="fipt w140"></el-input>
            </el-form-item>

            <el-form-item label="库存" class="formItem">
              <el-input v-model="form.lowestStock" placeholder="最低" class="fipt"></el-input>
              <span>-</span>
              <el-input v-model="form.highestStock" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="分类" class="formItem">
              <Classification
                ref="classificate"
                @getCateId1="getCateId1"
                @getCateId2="getCateId2"
                @getCateId3="getCateId3"
              ></Classification>
            </el-form-item>
            <el-form-item label="商品状态" class="formItem" label-width="90px">
              <el-select
                v-model="form.operStatus"
                placeholder="全部"
                class="fipt"
                @change="getoperStatus"
              >
                <el-option label="全部" value></el-option>
                <el-option label="上架" value="3"></el-option>
                <el-option label="下架" value="4"></el-option>
                <el-option label="草稿" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="onsearch" class="ml20">搜索</el-button>
          </el-form>
        </div>
        <div class="searchTable">
          <div class="tablescroll">
            <el-table
              height="600"
              ref="multipleTable"
              :data="tableData"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              tooltip-effect="dark"
              style="width: 100%"
              :header-cell-style="{color:'#333',background:'#F5F7FA'}"
            >
              <el-table-column prop="itemName" label="商品名称" width="260">
                <template slot-scope="scope">
                  <img :src="scope.row.photo" width="70" height="70" />
                  <div class="scopepannel">{{scope.row.itemName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="itemCode" label="商品编码"></el-table-column>
              <el-table-column prop="markPrice" label="市场价"></el-table-column>
              <el-table-column prop="supplyPrice" label="供应价"></el-table-column>
              <el-table-column prop="faceValue" label="面值" v-if="activeName==3"></el-table-column>
              <el-table-column prop="profitPercent" label="市场利润率(%)" width="120"></el-table-column>
              <el-table-column prop="supplyName" label="供应商"></el-table-column>
              <el-table-column prop="stockNum" label="总库存"></el-table-column>
              <el-table-column prop="operStatus" label="商品状态">
                <template slot-scope="scope">
                  <span
                    :class="{'colorRed':scope.row.operStatus=='下架'}"
                    v-html="getoperStatus1(scope.row.operStatus1)"
                  ></span>
                </template>
              </el-table-column>
              <el-table-column prop="states" label="操作" width="200">
                <template slot-scope="scope">
                  <div class="btnStatus">
                    <el-button @click="changeDetail(scope.row)" type="text" size="small">详情</el-button>
                    <el-button
                      @click="getoperS(scope.row)"
                      type="text"
                      size="small"
                      v-show="scope.row.operStatus1!=5"
                    >{{scope.row.operStatus=='上架'?'下架':'上架'}}</el-button>
                    <el-button
                      @click="copy(scope.row)"
                      type="text"
                      size="small"
                      v-if="roleType!=1"
                    >复制</el-button>
                    <br />
                    <el-button
                      @click="gotoDetail('upload',scope.row)"
                      type="text"
                      size="small"
                      v-if="activeName=='3' && roleType!=1"
                    >导入</el-button>
                    <el-button
                      @click="gotoDetail('goods',scope.row)"
                      type="text"
                      size="small"
                      v-if="activeName=='3' && roleType!=1"
                    >明细</el-button>
                    <!-- <el-button @click="delDetail(scope.row)" type="text" size="small">删除</el-button> -->
                  </div>
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
        </div>
      </div>
    </div>
    <!-- <el-dialog
  :title="titlex"
  :visible.sync="dialogVisible"
  width="1000px"
  :before-close="handleClose">
  <div   style="height:650px">
    <iframe name = "child" id = "child" :src="reportUrl"
   width="950" height="550"
     frameborder="0" scrolling="no"  style="width:100%;height:100%"
    ></iframe>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>-->
  </div>
</template>
<script>
import Classification from '@/components/Classification/Classification'
export default {
  name: 'index',
  data () {
    return {
      titlex: '',
      reportUrl: '',
      // dialogVisible: false,
      activeName: this.$route.query.activeName || '1',
      siteId: localStorage.getItem('pageSiteId'),
      advertId: this.$route.query.id,
      showWebsite: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      form: {
        productCateId: '',
        productCateId1: '',
        lowestSupplyPrice: '',
        highestSupplyPrice: '',
        lowestMarkPrice: '',
        highestMarkPrice: '',
        lowestProfit: '',
        highestProfit: '',
        itemCodeOrName: '',
        cateList: [],
        operStatus: '',
        lowestStock: '',
        highestStock: '',
        mallCateLables: [],
        mallProductCates: []
      },
      tableData: [],
      operStatus: '',
      sourceid: 1,
      parentId: 0,
      type: 1,
      skuIds: '',
      multipleSelection: '',
      formprice: {
        salePrice: ''
      },
      formLabelWidth: '60px',
      loading: false,
      cateLable: '', // 分类一
      cateLevel: '', // 分类二
      cateProduct: '', // 分类三
      roleType: '',
      vipType: ''
    }
  },
  created () {
    this.vipType = JSON.parse(localStorage.getItem('orgVipDetail')).vipType
  },
  mounted () {
    this.getsiteSelectlist = []
    this.getIndexOperStatus()
    this.getsiteSelect()
    this.roleType = Number(localStorage.getItem('roleType'))
    console.log(this.roleType)
    this.tabsCloseOtherHandle()
  },
  computed: {
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  methods: {
    getoperStatus1 (type) {
      if (Number(type) === 3) {
        return '上架'
      }
      if (Number(type) === 4) {
        return '下架'
      }
      if (Number(type) === 5) {
        return '草稿'
      }
    },
    handleClose () {
      // this.dialogVisible = false
    },
    gotoDetail (type, item) {
      // this.titlex = type === 'upload' ? '导入' : '明细'
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/virtual/getTenantToken'),
        method: 'post',
        data: ''
      }).then((data) => {
        if (data && data.data.code === 0) {
          if (location.host === 'sc.ebaoton.cn') {
            this.reportUrl = 'https://vas-manager.whecb.com/tenantAuth?accessToken=' + data.data.tenantToken + '&goodsCode=' + item.itemCode + '&goodsName=' + item.itemName + '&goodsPrice=' + item.supplyPriceMin + '&scope=' + type + '&faceValue=' + item.faceValue * 100
            window.open(this.reportUrl, 'saas')
          } else {
            this.reportUrl = 'https://vas-manager.ycb51.cn/tenantAuth?accessToken=' + data.data.tenantToken + '&goodsCode=' + item.itemCode + '&goodsName=' + item.itemName + '&goodsPrice=' + item.supplyPriceMin + '&scope=' + type + '&faceValue=' + item.faceValue * 100
            window.open(this.reportUrl, 'saas')
          }

          // this.dialogVisible = true
        }
      })

      //
    },
    handleClick (tab, index) {
      this.pageIndex = 1
      this.getsiteSelect()
    },
    tabsCloseOtherHandle () {
      // this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    getCateId1 (id) {
      this.cateLable = id // 分类一
    },
    getCateId2 (id) {
      this.cateLevel = id // 分类二
    },
    getCateId3 (id) {
      this.cateProduct = id // 分类三
    },
    getIndexOperStatus () {
      this.form.operStatus = this.$route.query.operStatus === undefined ? '' : this.$route.query.operStatus
    },
    //  新增商品
    add () {
      this.$router.push('/commoditiesAdd?activeName=' + this.activeName)
    },
    // 删除
    delDetail (item) {
      this.$confirm('确认要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/product/product/deleteProductByProductId'),
          method: 'post',
          data: this.$http.adornData({
            proNo: item.productNo
          }, true)
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.pageIndex = 1
            this.getsiteSelect()
          } else {
            this.$message({
              type: 'fail',
              message: '删除失败!'
            })
          }
        })
      })
    },
    // 上下架操作
    getoperS (item) {
      var operStatus = item.operStatus === '上架' ? '下架' : '上架'
      var confirmtxt = ''
      if (operStatus === '下架') {
        confirmtxt = '是否确认下架该商品？下架后该商品将不在专题及移动端显示!'
      } else {
        confirmtxt = '是否确认上架该商品？'
      }
      this.$confirm(confirmtxt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/product/product/saveOrUpdateSupplyProduct'),
          method: 'post',
          data: this.$http.adornData({
            id: item.id,
            operStatus: item.operStatus === '上架' ? '4' : '3'
          })
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.pageIndex = 1
            this.getsiteSelect()
          }
        })
      }).catch(() => {

      })
    },
    // 复制
    copy (item) {
      this.$router.push('/commoditiesAdd?id=' + item.id + '&type=copy&activeName=' + this.activeName)
    },
    // 改价
    changeDetail (item) {
      this.$router.push('/commoditiesAdd?id=' + item.id + '&activeName=' + this.activeName)
    },
    onsearch () {
      this.pageIndex = 1
      this.getsiteSelect()
    },
    getoperStatus (item) {
      this.form.operStatusid = item
      this.getsiteSelect()
    },
    // 商品列表
    getsiteSelect () {
      this.skuIds = ''
      this.tableData = []
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/product/querySupplyProductList'),
        method: 'post',
        data: this.$http.adornData({
          type: Number(this.activeName),
          lowestSupplyPrice: this.form.lowestSupplyPrice, // 最低供应价
          highestSupplyPrice: this.form.highestSupplyPrice, // 最高供应价
          lowestMarkPrice: this.form.lowestMarkPrice, // 最低市场价
          highestMarkPrice: this.form.highestMarkPrice, // 最高市场价
          lowestProfit: this.form.lowestProfit, // 最低利润率
          highestProfit: this.form.highestProfit, // 最低利润率
          itemCodeOrName: this.form.itemCodeOrName, // 最低利润率
          // cateList: this.form.cateList,
          cateLable: this.cateLable, // 分类一
          cateLevel: this.cateLevel, // 分类二
          cateProduct: this.cateProduct, // 分类三
          operStatus: this.form.operStatus,
          lowestStock: this.form.lowestStock,
          highestStock: this.form.highestStock,
          page: this.pageIndex,
          limit: this.pageSize
        })
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.loading = false
          var skuIds = ''
          for (let index = 0; index < data.data.page.list.length; index++) {
            const element = data.data.page.list[index]
            element.stockNum = element.stockNum === null ? 0 : element.stockNum
            element.operStatus1 = element.operStatus
            element.operStatus = element.operStatus === '3' ? '上架' : '下架'
            if (element.source === 1) {
              element.photo = 'http://img13.360buyimg.com/n1/' + element.photo
            }
            skuIds += element.itemCode + ','
          }
          if (data.data.page.list.length > 0) {
            this.getVirtualStockByTenant(skuIds)
          }
          this.tableData = data.data.page.list
          this.totalPage = data.data.page.totalCount
        }
      })
    },
    getVirtualStockByTenant (skuIds) {
      if (this.activeName === '3') {
        skuIds = skuIds.substring(0, skuIds.length - 1)
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/virtual/getVirtualStockByTenant'),
          method: 'post',
          data: this.$http.adornData({
            skus: skuIds
          }, true)
        }).then((data) => {
          if (data && data.data.code === 0) {
            for (let i = 0; i < this.tableData.length; i++) {
              const item = this.tableData[i]
              for (let index = 0; index < data.data.skuVoList.length; index++) {
                const element = data.data.skuVoList[index]
                if (item.itemCode === element.skuId) {
                  item.stockNum = element.stockNum == null ? 0 : element.stockNum
                }
              }
            }
          }
        })
      }
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getsiteSelect()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getsiteSelect()
    },
    onSubmit () {
      this.showWebsite = false
      this.$emit('multipleSelection', this.multipleSelection)
    }
  },
  components: {
    Classification
  }
}
</script>
<style lang="scss" scoped>
.wapper {
  position: relative;
  background: #ffffff;
  h2 {
    border-left: 4px solid #3e8ef7;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
  }
  .mainRight {
    margin-right: 20px;
    background: #ffffff;
  }
  .site-content {
    color: #303133;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s;
    padding: 0;
    // padding-bottom: 50px;
  }
}
.searchBlock {
  background: #ffffff;
  .navsourse {
    font-size: 0;
    background-color: #eee;
    li {
      width: 120px;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      color: rgba(108, 107, 143, 1);
      text-align: center;
      display: inline-block;
      &.active {
        width: 120px;
        height: 40px;
        background: #ffffff;
        border-radius: 4px 4px 0px 0px;
      }
    }
  }
  .searchPannel {
    background: #ffffff;
    padding-top: 20px;
    .formItem {
      display: inline-block;
      margin-bottom: 10px;
      .form-checkbox {
        background-color: #00aa72;
        border-color: #00aa72;
      }

      span {
        padding: 0 8px;
      }
      /deep/ .el-button {
        padding: 5px 10px;
      }
      &.ml0 {
        // margin-left: 0;
        /deep/ .el-form-item__content {
          margin-left: 20px !important;
        }
      }
    }
  }
  .tablescroll {
    overflow: hidden;
  }
  .scopepannel {
    display: inline-block;
    width: 120px;
    vertical-align: top;
    padding-left: 20px;
  }
  .colorRed {
    color: #ff0000;
  }

  .fipt {
    width: 80px;
    /deep/ .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
    &.w100 {
      width: 100px;
    }
  }
  .w90 {
    width: 90px !important;
  }
  .el-card__body {
    padding-top: 0;
  }
  .btnStatus span {
    cursor: pointer;
    color: #3e98f6;
  }
}
</style>
