<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="menuId"
      height="500"
      style="width: 100%; "
      :header-cell-style="{color:'#333',background:'#F5F7FA'}"
    >
      <el-table-column prop="name" header-align="left" min-width="150" label="名称"></el-table-column>
      <el-table-column
        prop="menuType"
        header-align="center"
        align="center"
        width="120"
        :formatter="valimenuType"
        label="菜单类型"
      ></el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        :formatter="parentName"
        label="上级菜单"
      ></el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" header-align="center" align="center" label="排序号"></el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      ></el-table-column>
      <el-table-column
        prop="permission"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      ></el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:menu:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.menuId)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:menu:delete')"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.menuId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    valimenuType (row, column) {
      if (row.menuType === 1) {
        return '机构菜单'
      } else if (row.menuType === 2) {
        return '商城菜单'
      } else if (row.menuType === 3) {
        return 'API应用菜单'
      } else {
        return '分期商城菜单'
      }
    },
    parentName (row, column) {
      if (row.parentName) {
        return row.parentName
      } else {
        return '一级菜单'
      }
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/menu/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, 'menuId')
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/ybt-backend/sys/menu/delete/${id}`),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => { })
    }
  }
}
</script>
