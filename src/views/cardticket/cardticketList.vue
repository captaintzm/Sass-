<template>
  <div class="selectshoop">
    <div class="steps">
        <el-steps :active="2" align-center>
            <el-step title="创建卡券" description=""></el-step>
            <el-step title="激活卡券" description=""></el-step>
        </el-steps>
    </div>
    <div class="kexuan">
        <div class="form-order">
            <el-button type="primary">主要按钮</el-button>
        </div>
        <div>
            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :header-cell-style="{color:'#333',background:'#F5F7FA'}"
                >
                 <el-table-column
                prop="itemCode"
                label="卡bin编码"
                width="180">
                </el-table-column>
                <el-table-column
                prop="itemCode"
                label="所属分公司"
                width="180">
                </el-table-column>
                <el-table-column
                prop="itemName"
                label="创建时间"
                width=""
                :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                prop="supplyName"
                :formatter="stateFormat"
                label="备注"
                width="180">
                </el-table-column>
                <el-table-column
                prop="supplyPrice"
                label="状态"
                width="180">
                </el-table-column>
               <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <el-pagination
        class="page"
        v-if="selectedshop.length>0"
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
            siteName: '激活',
            id: 0
          },
          {
            siteName: '禁用',
            id: 2
          }
        ],
        state: 0,
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
        itemName: ''
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
    },
    mounted () {

    },

    created () {
      this.selecthp()
    },
    methods: {
      stateFormat (row, column) {
        if (row.operStatus == 3) {
          return '上架'
        } else {
          return '下架'
        }
      },
      nextstep () {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/nextPush'),
          methods: 'post',
          params: this.$http.adornParams({
            packsId: this.$route.query.packsId
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data.msg)
            this.$router.push({path: '/ceshi-fenfa', query: {packsId: this.$route.query.packsId, packsInfoAdrr: data.packsInfoAdrr, packsInfo: data.packsInfo, userList: data.userList}})
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

        if (this.chose == 2) {
          return this.selecthp()
        }

        if (this.chose == 1) {
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
        if (val.length == 0) {
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

      routes () {
        this.packsId = this.$route.query.packsId
        this.siteId = this.$route.query.siteId
        this.source = this.$route.query.source
        console.log(this.packsId, this.siteId, this.source)
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
                this.selectedshop = data.page.list
                this.totalPage = data.page.totalCount
              } else {
                console.log(121)
              }
            })
      }
    }
  }
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';
.selectshoop{
    /deep/ .el-table thead{
        background :#F5F8FF;
    }
    .steps{
        background :#F3F4FA;
    }
    .selectshoop-tab{
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        margin-top :50px;
        .chose{
            width:192px;
            height:39px;
            line-height :39px;
            text-align :center;
            border-radius:4px 4px 0px 0px;
            &.active{
                 background :#FFFFFF;
            }
        }

    }
    .kexuan{}
    .form-order{
        padding-left :10px;
        padding-top :20px;
        background :#ffffff;
        .reset-size {
            display: inline-block;
            margin-left :48px;
            margin-right :37px;
            /deep/ .el-input--mini .el-input__inner{
                height :34px;
                line-height :34px;
            }
            /deep/ .el-form-item__label{
                line-height :34px;
            }
        }
    }

}
</style>
