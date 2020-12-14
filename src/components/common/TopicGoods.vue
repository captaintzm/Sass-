<template>
     <el-dialog
      title='查看商品'
      :visible.sync="showWebsite"
      :show-close="false"
      width="960px"
      :lock-scroll="false"
      class="padding0"
    >
      <div
        class="searchBlock"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >

        <div class="searchTable">
          <div class="tablescroll">
            <el-table
              height="420"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              :header-cell-style="{color:'#333',background:'#F5F7FA'}"
            >
              <el-table-column prop="itemName" label="商品名称" width="250">
                <template slot-scope="scope">
                  <img :src="scope.row.photo" width="70" height="70" />
                  <div class="scopepannel">{{scope.row.itemName}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="supplyName" label="供应商">
                <template slot-scope="scope">
                  <span v-html="getName(scope.row.source)"></span>
                </template>
              </el-table-column>
              <el-table-column prop="itemCode" label="商品编码"></el-table-column>
              <el-table-column prop="markPrice" label="市场价"></el-table-column>
              <el-table-column prop="supplyPrice" label="供应价"></el-table-column>
              <el-table-column prop="salePrice" label="销售价"></el-table-column>
              <el-table-column prop="profitPercent" label="利润率"></el-table-column>
              <el-table-column prop="status" label="库存状态"></el-table-column>
              <el-table-column prop="operStatus" label="状态" show-overflow-tooltip></el-table-column>
            </el-table>
             <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper"
              class="pagination"
            ></el-pagination>
          </div>

        </div>

      </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      showWebsite: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 50,
      totalPage: 0,
      advertId: ''
    }
  },
  mounted () {

  },

  methods: {
    getName (source) {
      switch (Number(source)) {
        case 1:
          return '京东'
        case 3:
          return '苏宁易购'
        case 4:
          return '网易严选'
        case 9:
          return '小米有品'
        case 102:
          return '平台供应商'
        case 7:
          return '平台虚拟商品'
        case 2:
          return '自有供应商'
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
    inint (item) {
      this.showWebsite = true
      this.advertId = item.id
      this.pageIndex = 1
      this.getsiteSelect()
    },
    getsiteSelect () {
      this.tableData = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/site/siteadvert/getProductByAdvertId'),
        method: 'post',
        data: this.$http.adornData({
          advertId: this.advertId,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.obj.list.length; index++) {
            const element = res.data.obj.list[index]
            element.photo = element.source === 1 ? 'http://img13.360buyimg.com/n1/' + element.photo : element.photo
            element.status = element.status === '1' ? '有货' : '无货'
            element.operStatus = element.operStatus === '3' ? '上架' : '下架'
          }
          this.tableData = res.data.obj.list
          this.totalPage = res.data.obj.totalCount
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.scopepannel{
  width: 130px;
  display: inline-block;
  vertical-align: top;
}
</style>
