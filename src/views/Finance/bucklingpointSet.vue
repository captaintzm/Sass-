<template>
  <div class="wapper">
    <h2 class="mb20">
      扣点设置
      <el-button type="primary" @click="add" style="float:right">新增</el-button>
    </h2>
    <el-form ref="form" :model="form">
      <el-form-item label="机构名称">
        <el-input v-model.trim="form.name" class="w150"></el-input>
        <el-button type="primary" @click="searchOrderTag">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="orgId" label="机构ID" width="180"></el-table-column>
      <el-table-column prop="orgName" label="机构名称" width="180"></el-table-column>
      <el-table-column prop="PriceDeduct" label="扣点模式 I"></el-table-column>
      <el-table-column prop="valDeduct" label="按价格单笔扣点（%）"></el-table-column>
      <el-table-column prop="OrderRange" label="扣点模式 II"></el-table-column>
      <el-table-column prop="rangArray" label="按笔数扣点范围值（笔）"></el-table-column>
      <el-table-column prop="valRange" label="按价笔数单笔扣点（元）"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
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

    <el-dialog title="新增扣点" :visible.sync="addPoints" width="720px" :closeOnClickModal="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="选择机构" v-if="isAdd==2" style="color: #ff862e;">{{form.organizationA}}</el-form-item>
        <el-form-item label="选择机构" v-if="isAdd==1">
          <div v-if="form.organizationlistA.length>0" style="display:inline-block">
            <el-select
              v-model="form.organizationA"
              class="w140"
              placeholder="选择机构"
              :disabled="form.disabled"
              @change="orgPannelFirst"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in form.organizationlistA"
                :key="index"
              ></el-option>
            </el-select>
          </div>
          <div v-if="form.organizationlistB.length>0" style="display:inline-block">
            <el-select
              v-model="form.organizationB"
              class="w140"
              placeholder="选择机构"
              @change="orgPannelSencond"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in form.organizationlistB"
                :key="index"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="扣点方式" class="mb20">
          按交易金额扣点 :
          <el-input v-model="form.pointPrice" class="w120"></el-input>&nbsp;%
        </el-form-item>
        <el-form-item>
          按订单笔数扣点 :
          <div class="orderNumList">
            <div class="orderNumItem" v-for="(item,index) in form.orderNumList" :key="index">
              <span class="s1">第{{index+1}}档</span>
              <span class="s2">笔数上限</span>
              <el-input v-model="item.pointOrderNum" class="w120"></el-input>
              <span class="s2">每笔金额</span>
              <el-input v-model="item.pointOrderPrice" class="w120"></el-input>&nbsp; 元
              <span class="del" @click="del(item,index)" v-if="isAdd==1">x</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="isAdd==1">
          <el-button type="primary" plain @click="addNum">新增笔数</el-button>&nbsp;&nbsp;(只能新增10条数据)
        </el-form-item>
        <el-form-item class="textRight">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="save" :disabled="savedisabled">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'orderList',
  data () {
    return {
      savedisabled: false,
      form: {
        name: '',
        organizationlistA: [],
        organizationA: '',
        organizationlistB: [],
        organizationB: '',
        pointPrice: '',
        disabled: false,
        orderNumList: [
          {
            pointOrderNum: '',
            pointOrderPrice: ''
          }
        ]
      },
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      addPoints: false,
      tableData: [],
      orgId: '',
      isAdd: 1,
      getParam: ''
    }
  },
  mounted () {
    this.type = 1
    this.getOrderList()
  },
  methods: {
    orgPannelFirst (orgId) {
      this.orgId = orgId
      this.type = 2
      this.form.organizationB = ''
      this.form.organizationlistB = []
      this.queryChildOrg(orgId)
    },
    orgPannelSencond (orgId) {
      this.orgId = orgId
      console.log(orgId)
    },
    // 编辑
    handleClick (item) {
      this.getParam = item
      this.isAdd = 2
      this.form.organizationlistA = []
      this.form.organizationlistB = []
      this.form.organizationB = ''
      this.form.orderNumList = []
      this.addPoints = true;
      this.orgId = item.orgId
      this.form.disabled = true
      this.form.organizationA = item.orgName
      this.form.pointPrice = item.valDeduct
      this.form.orderNumList.push({
        pointOrderNum: item.mxmRange,
        pointOrderPrice: item.valRange
      })
    },
    inlit () {
      this.form.organizationlistA = []
      this.form.organizationA = ''
      this.form.organizationlistB = []
      this.form.organizationB = ''
      this.form.pointPrice = ''
      this.form.orderNumList = []
      this.addPoints = true;
      this.type = 1
      this.queryChildOrg('')
    },
    add () {
      this.isAdd = 1
      this.form.disabled = false
      this.inlit()
    },
    del (item, index) {
      this.form.orderNumList.splice(index, 1);
    },
    addNum () {
      var num = this.form.orderNumList.length
      if (num === 10) {
        this.$message.error('您只能新增10条数据')
        return false
      }
      var item = { "pointOrderNum": '', "pointOrderPrice": "" };
      this.form.orderNumList.splice(this.form.orderNumList.length, 0, item);
    },
    // 获取子级机构
    queryChildOrg (orgId) {
      this.$http({
        url: this.$http.adornUrl("/ybt-backend/deduct/deductrule/queryChildOrg"),
        method: "post",
        data: this.$http.adornData(
          {
            orgId: orgId,
          }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          if (this.type === 1) {
            this.form.organizationlistA = res.data.sysOrganizations
          } else {
            this.form.organizationlistB = res.data.sysOrganizations
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 扣点配置保存
    save () {
      if (this.orgId == '' || this.orgId == null) {
        this.$message.error('请选择机构')
        return false
      }
      if (this.form.pointPrice == '') {
        this.$message.error('请填写按交易金额扣点')
        return false
      }


      var tableValue = '';
      var orderNumList = this.form.orderNumList
      for (let index = 0; index < orderNumList.length; index++) {
        const element = orderNumList[index];
        if (element.pointOrderNum === '' || element.pointOrderPrice === '') {
          this.$message.error('请填写按订单笔数扣点 ')
          return false
        }
        tableValue += element.pointOrderNum + "_" + element.pointOrderPrice + "-"
      }
      console.log(tableValue)
      if (tableValue == '') {
        this.$message.error('请填写按订单笔数扣点 ')
        return false
      }
      this.savedisabled = true
      if (this.isAdd == 1) {
        // // 扣点配置新增
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/deduct/deductrule/save'),
          method: 'post',
          data: this.$http.adornData({
            orgId: this.orgId,
            isPriceDeduct: 1, // 是否按价格扣点 1
            valDeduct: this.form.pointPrice, // 按价格扣点值
            isOrderRange: 1, // 是否按订单笔数扣点 1
            tableValue: tableValue// 笔数 - 扣点数 多条
          }, true)
        }).then((res) => {
          if (res && res.data.code === 0) {
            this.addPoints = false
            this.$message.success(res.data.msg)
            this.getOrderList()

          } else {
            this.$message.error(res.data.msg)
          }
          this.savedisabled = false
        })
      } else {
        // // 扣点配置修改
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/deduct/deductrule/update'),
          method: 'post',
          data: this.$http.adornData({
            id: this.getParam.id,
            site: this.getParam.siteId,
            isPriceDeduct: 1, // 是否按价格扣点 1
            isOrderRange: 1, // 是否按订单笔数扣点 1
            orgId: this.getParam.orgId,
            valDeduct: this.form.pointPrice, // 按价格扣点值
            mxmRange: orderNumList[0].pointOrderNum, // 笔数 
            valRange: orderNumList[0].pointOrderPrice //扣点数 
          }, true)
        }).then((res) => {
          if (res && res.data.code === 0) {
            this.addPoints = false
            this.$message.success(res.data.msg)
            this.getOrderList()
          }
          this.savedisabled = false
        })
      }

    },
    cancel () {
      this.orgId = ''
      this.addPoints = false
      this.form.organizationlistA = []
      this.form.organizationA = ''
      this.form.organizationlistB = []
      this.form.organizationB = ''
    },
    // 删除扣点配置
    delClick (item) {
      this.$confirm('你确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/deduct/deductrule/delete'),
          method: 'post',
          data: this.$http.adornData({
            id: item.id,
          }, true)
        }).then((res) => {
          if (res && res.data.code === 0) {
            this.addPoints = false
            this.$message.success('删除成功！')
            this.getOrderList()
          }
        })
      }).catch(() => {

      });


    },
    getOrderList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/deduct/deductrule/list'),
        method: 'post',
        data: this.$http.adornData({
          orgName: this.form.name,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.tableData = res.data.page.list
          for (let index = 0; index < res.data.page.list.length; index++) {
            const element = res.data.page.list[index];
            if (element.isPriceDeduct === 1) {
              element.PriceDeduct = '按订单金额扣点'
            } else {
              element.PriceDeduct = ''
            }
            if (element.isOrderRange === 1) {
              element.OrderRange = '按订单笔数扣点'
            } else {
              element.OrderRange = ''
            }
            element.rangArray = element.minRange + "-" + element.mxmRange
          }
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
    }

  },
  components: {
    // delivery,
    // addNewTag
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

