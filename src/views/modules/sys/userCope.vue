<template>
  <div class="user">
    <el-tabs v-model="activetabs" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="账号">
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select
              v-model="dataForm.status"
              placeholder="请选择"
              class="el-selects"
              :style="{'width':'350px'}"
            >
              <el-option
                v-for="item in options"
                :key="item.status"
                :label="item.statusName"
                :value="item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          v-loading="dataListLoading"
          style="width: 100%;"
          :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        >
          <el-table-column prop="username" header-align="center" align="center" label="账号"></el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="姓名"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="mobile" header-align="center" align="center" label="手机号"></el-table-column>
          <el-table-column prop="orgName" header-align="center" align="center" label="所属机构"></el-table-column>
          <el-table-column
            v-if="activetabs === 'first'"
            prop="roleNames"
            header-align="center"
            align="center"
            label="角色"
          ></el-table-column>
          <el-table-column prop="locked" header-align="center" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.locked == '0'" size="small">正常</el-tag>
              <el-tag v-else size="small" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="180"
            label="创建时间"
          ></el-table-column>
          <el-table-column header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="isAuth('sys:user:update')"
                type="text"
                size="small"
                @click="addOrUpdateHandle(scope.row)"
              >修改</el-button>
              <el-button type="text" size="small" @click="codepaswd(scope.row)">修改密码</el-button>
              <el-button
                v-if="isAuth('sys:user:delete')"
                type="text"
                size="small"
                @click="deleteHandle(scope.row.userId)"
              >删除</el-button>
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
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-show="addOrUpdateVisible==true"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :idser="ids"
      :orderorgId="orderorgId"
    ></add-or-update>
    <el-dialog title="修改密码" :visible.sync="Visiblesone">
      <el-form label-width="130px" :inline="true" class="demo-form-inline">
        <el-form-item label="密码：" :rules="[{ required: true, message: '密码不能为空'}]">
          <el-input v-model="mima" type="password" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="确认密码：" :rules="[{ required: true, message: '确认密码不能为空'}]">
          <el-input v-model="qrmima" type="password" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passwords()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
export default {
  data () {
    return {
      activetabs: "first",
      tabList: [
        {
          label: "员工管理",
          name: "first"
        },
        {
          label: "供应商管理",
          name: "second"
        }
      ],
      options: [
        {
          statusName: "禁用",
          status: 1
        },
        {
          statusName: "正常",
          status: 0
        }
      ],
      dataForm: {
        userName: "",
        status: "",
        style: 1
      },
      ids: localStorage.getItem("orgId"),
      dataList: [],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      addOrUpdateVisible: false,
      orderorgId: '',
      Visiblesone: false,
      mima: '',
      qrmima: '',
      userId: '',
    };
  },
  created () {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList () {
      console.log(this.dataForm);
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/ybt-backend/sys/user/list"),
        method: "post",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName,
          orgId: this.ids,
          locked: this.dataForm.status,
          roleType: this.dataForm.style
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    handleClick (val) {
      console.log(val);
      this.activetabs = val.name;
      console.log(this.activetabs);
      this.dataForm.style = val.name === "first" ? 1 : 2;
      this.getDataList();
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val;
      this.getDataList();
    },
    //  修改
    addOrUpdateHandle (item) {
      this.$refs.addOrUpdate.visible = true;
      if (item != undefined) {
        this.ids = item.organizationIds;
        this.orderorgId = item.organizationIds;
      }
      this.$nextTick(() => {
        if (item == undefined) {
          this.$refs.addOrUpdate.init("", this.dataForm.style);
        } else {
          this.$refs.addOrUpdate.init(item.userId, item.roleType);
        }
      });
    },
    // 删除
    deleteHandle (id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.userId;
        });
      this.$confirm("您确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/ybt-backend/sys/user/delete"),
            method: "post",
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => { });
    },
    // 修改密码
    passwords () {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (this.mima === '') {
        return this.$message.error('密码不能为空')
      }
      if (!reg.test(this.mima)) {
        return this.$message.error('密码必须包含字母加数字，且处于6-20位之间')
      }
      if (this.qrmima === '') {
        return this.$message.error('确认密码不能为空')
      }
      if (!reg.test(this.qrmima)) {
        return this.$message.error('密码必须包含字母加数字，且处于6-20位之间')
      }
      if (this.mima !== this.qrmima) {
        return this.$message.error('两次输入的密码不一致')
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/user/uptPassword'),
        method: 'post',
        params: this.$http.adornParams({
          userId: this.userId,
          password: this.mima
        })
      }).then(({ data }) => {
        if (data.code === 0) {
          this.Visiblesone = false
          this.$message.success('修改成功')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    codepaswd (row) {
      this.userId = row.userId
      this.Visiblesone = true
    },
  },
  watch: {
    Visiblesone () {
      if (this.Visiblesone === false) {
        this.mima = ''
        this.qrmima = ''
        this.userId = ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
};
</script>

<style>
</style>