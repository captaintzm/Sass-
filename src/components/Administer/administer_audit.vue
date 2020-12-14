<template>
  <div class="administerAud">
    <el-form :inline="true" :model="auditForm">
      <el-form-item label="申请时间">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="auditForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="提取方式">
        <el-select v-model="auditForm.way" placeholder="请选择提取方式">
          <el-option label="全部" value></el-option>
          <el-option label="转至预存账户" value="现金转预存"></el-option>
          <el-option label="提现" value="提现"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="auditForm.status" placeholder="请选择审核状态">
          <el-option label="全部" value></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="已拒绝" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="礼品公司">
        <el-input v-model="auditForm.gift" placeholder="请输入礼品公司"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="handleAudit">搜索</el-button>
        <el-button type="primary" @click="handleimportReport">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="audTabs"
      style="width: 100%"
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
      :max-height="500"
    >
      <el-table-column align="center" prop="serialNo" label="流水号" width="180"></el-table-column>
      <el-table-column align="center" prop="abstractType" label="提取方式" width="180"></el-table-column>
      <el-table-column align="center" prop="amount" label="提取金额" width="180"></el-table-column>
      <el-table-column align="center" prop="extend.serFee" label="手续费" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.extend">{{scope.row.extend.serFee}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="extend.arrivalAccount" label="到账金额" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.extend">{{scope.row.extend.arrivalAccount}}</span>
          <span v-else>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="extend.bankAccount" label="提现账号" width="180">
        <template slot-scope="scope">
          <span
            v-if="scope.row.extend"
          >{{scope.row.extend.bankAccount == 0 ? '--' : scope.row.extend.bankAccount}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operTime" label="申请时间" width="180"></el-table-column>
      <el-table-column align="center" prop="orgName" label="礼品公司" width="180"></el-table-column>
      <el-table-column align="center" prop="operStatus" label="审核状态" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.operStatus == 0">未审核</span>
          <span v-else-if="scope.row.operStatus == 1">已审核</span>
          <span v-else-if="scope.row.operStatus == 2">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="审核" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.operStatus == 0 && scope.row.abstractType == '提现-0'"
            @click="handleClick(scope.row, 1)"
            type="text"
            size="small"
          >通过</el-button>
          <el-button
            v-if="scope.row.operStatus == 0 && scope.row.abstractType == '提现-0'"
            @click="handleClick(scope.row, 2)"
            type="text"
            size="small"
          >拒绝</el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
    ></el-pagination>
  </div>
</template>

<script>
// import { emit } from 'cluster';
export default {
  data () {
    return {
      orgId: "",
      auditForm: {
        date: "",
        way: "",
        status: "",
        gift: ""
      },
      audTabs: [],
      currentIndex: 1, // 当前页
      pageSize: 10, // 每页数量
      total: 0 // 总条数
    };
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.orgId = userInfo.organizationIds
    this.handleSearchRecord(this.auditForm)
  },
  methods: {
    // Size改变,修改每一页数量
    handleSizeChange (val) {
      this.pageSize = val
      this.handleSearchRecord(this.auditForm)
    },
    // current改变,修改当前页
    handleCurrentChange (val) {
      this.currentIndex = val
      this.handleSearchRecord(this.auditForm)
    },
    // 查询记录
    handleSearchRecord (obj) {
      this.$http({
        url: this.$http.adornUrl(
          "/ybt-backend/finance/orgaccount/getRechargeFlowPage"
        ),
        method: "post",
        data: this.$http.adornData(
          {
            startDate: obj.date[0] ? obj.date[0] : '',
            endDate: obj.date[1] ? obj.date[1] : '',
            operStatus: obj.status,
            abstractType: obj.way,
            type: '', // 01 预存 02提现
            orgName: obj.gift,
            page: this.currentIndex,
            limit: this.pageSize
          },
          true
        )
      }).then(res => {
        console.log(res);
        if (res && res.data.code === 0) {
          let list = res.data.page.list
          list.forEach(e => {
            return e.extend = JSON.parse(e.extend)
          })
          this.audTabs = list;
          this.total = res.data.page.totalCount
        }
      });
    },
    // 提交信息
    handleAudit () {
      this.handleSearchRecord(this.auditForm)
    },
    // 审批
    handleClick (scope, status) {
      this.$confirm(status === 1 ? '是否确认通过该笔提现?' : '是否确认拒绝该笔提现?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(
            "/ybt-backend/finance/orgaccountrecharge/checkCashRecharge"
          ),
          method: "post",
          data: this.$http.adornData(
            {
              serialNo: scope.serialNo,
              operStatus: status
            },
            true
          )
        }).then(res => {
          if (res.data.code === 0) {
            this.handleSearchRecord(this.auditForm)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    // 导出
    handleimportReport () {
      this.$http({
        url: this.$http.adornUrl(
          "/ybt-backend/finance/orgaccount/getRechargeFlowPageExport"
        ),
        method: "post",
        responseType: "arraybuffer",
        data: this.$http.adornData(
          {
            startDate: this.auditForm.date[0] ? this.auditForm.date[0] : '',
            endDate: this.auditForm.date[1] ? this.auditForm.date[1] : '',
            operStatus: this.auditForm.status,
            abstractType: this.auditForm.way,
            orgName: this.auditForm.gift
          },
          true
        )
      }).then(res => {
        console.log(res)
        if (res) {
          let blob = new Blob([res.data], {
            type: "application/x-xls",
            charset: "utf-8"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "审批交易明细.xls";
          var event = new MouseEvent("click");
          link.dispatchEvent(event);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.administerAud {
  /deep/ .el-range-separator {
    width: 6%;
  }
}
</style>