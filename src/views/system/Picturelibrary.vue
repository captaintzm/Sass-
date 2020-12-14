<template>
  <div class="wapper">
    <h2 class="mb20">图片库</h2>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="类型" class="formItem">
        <el-select v-model="form.getStyle" placeholder="全部" class="fipt" @change="clickStatu">
          <el-option label="全部" value></el-option>
          <el-option
            :label="item.name"
            :value="item.type"
            v-for="(item,index) in operStatus"
            :key="index"
          >{{item.name}}</el-option>
        </el-select>
        <el-button type="primary" @click="onsearch">搜索</el-button>
        <el-button type="primary" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
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
        <el-table-column prop="photoUrl" label="图片" width="300">
          <template slot-scope="scope">
            <img :src="scope.row.photoUrl" width="70" height="70" />
          </template>
        </el-table-column>
        <el-table-column prop="type" :formatter="typeFormat" label="类型"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="states" label="操作" width="200" >
          <template slot-scope="scope">
            <div class="btnStatus">
              <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
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

    <el-dialog title="新增图片库" :visible.sync="showWebsite">
      <el-form :model="formAdd">
        <el-form-item label="类型">
          <el-select v-model="formAdd.getStyle" class="fipt" @change="formAddclickStatu">
            <el-option
              :label="item.name"
              :value="item.type"
              v-for="(item,index) in operStatus"
              :key="index"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传">
          <el-upload
            class="avatar-uploader"
            :action="url"
            :show-file-list="false"
            :beforeUpload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :data="myHeaders"
          >
            <img v-if="formAdd.photo" :src="formAdd.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showWebsite = false">取 消</el-button>
        <el-button type="primary" @click="addPic()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'index',
  data () {
    return {
      url: this.$http.adornUrl(`/ybt-backend/sys/oss/upload`),
      formAdd: {
        getStyle: '',
        photo: ''
      },
      siteId: localStorage.getItem('pageSiteId'),
      showWebsite: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false,
      form: {
        getStyle: '',
        myOrOrg: ''
      },
      operStatus: [
        {
          name: '背景图',
          type: 1
        },
        {
          name: '轮播图',
          type: 2
        },
        {
          name: '分类图',
          type: 3
        },
        {
          name: '专题图',
          type: 4
        },
        {
          name: '礼包/卡券/积分封面',
          type: 5
        },
        {
          name: '卡券领取背景图',
          type: 6
        }
      ],
      operStatusType: '',
      tableData: [],
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },
      operType: '',
      photoDetail: ''
    }
  },
  mounted () {
    this.getsiteSelect()
  },
  methods: {
    typeFormat (row) {
      switch (row.type) {
        case 1:
          return '背景图'
        case 2:
          return '轮播图'
        case 3:
          return '分类图'
        case 4:
          return '专题图'
        case 5:
          return '礼包/卡券/积分封面'
        case 6:
          return '卡券领取背景图'
      }
    },
    del (item) {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/photo/photogallery/delete'),
          method: 'post',
          data: this.$http.adornData({
            ids: item.id
          }, true)
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.$message.success('删除成功')
            this.getsiteSelect()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 2MB!',
          type: 'error'
        })
      }

      return isLt2M
    },

    // 上传图片
    handleAvatarSuccess (res, file) {
      if (res.code === 401) {
        if (localStorage.getItem('isFromYunCai') ==='true') {
          this.$router.push({ name: 'loginYc' })
        } else {
          this.$router.push({ name: 'login' })
        }
      } else {
        var img = new Image()
        img.src = res.url
        img.onload = function () {
          this.photoDetail = img.width + '*' + img.height
        }
        this.formAdd.photo = res.url
        console.log(this.photoDetail)
      }
    },
    addPic () {
      if (this.operType === '') {
        return this.$message.error('请选择类型')
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/photo/photogallery/save'),
        method: 'post',
        data: this.$http.adornData({
          type: this.operType,
          photoUrl: this.formAdd.photo,
          photoDetail: this.photoDetail
        }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.showWebsite = false
          this.$message.success('创建成功')
          this.getsiteSelect()
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    onsearch () {
      this.pageIndex = 1
      this.getsiteSelect()
    },
    clickStatu (item) {
      this.operStatusType = item
    },
    formAddclickStatu (item) {
      this.operType = item
    },
    //  新增
    add () {
      this.operType = ''
      this.formAdd.getStyle = '请选择'
      this.formAdd.photo = ''
      this.showWebsite = true
    },

    // 列表
    getsiteSelect () {
      this.tableData = []
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/photo/photogallery/list'),
        method: 'post',
        data: this.$http.adornData({
          type: this.operStatusType,
          page: this.pageIndex,
          limit: this.pageSize
        }, true)
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.loading = false
          this.tableData = data.data.page.list
          this.totalPage = data.data.page.totalCount
        } else {
          this.loading = false
          this.$message.error(data.data.msg)
        }
      })
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
    }
  },
  components: {

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
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
