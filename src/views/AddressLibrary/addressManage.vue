<template>
  <div class="wapper">
    <h2 class="mb20">地址库</h2>
    <div class="site-content">
      <div class="address-left">
        <div class="sid-menu">
          <el-tree
            :data="districtNamelist"
            :props="defaultProps"
            highlight-current
            default-expand-all
            @node-click="itemClick"
          ></el-tree>
        </div>
      </div>
      <div
        class="address-right"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <h3>{{addressInfo}}</h3>
        <el-form :model="form" size="small">
          <el-row :gutter="35">
            <el-col :span="8">
              <el-form-item label="街道名称" label-width="80px">
                <el-input v-model="form.streeName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="getAdressInfo"
          style="width: 100%"
          class="mb20"
          :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        >
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="name" label="街道 / 乡镇名称"></el-table-column>
          <el-table-column prop="districtCode" label="街道 / 乡镇编号"></el-table-column>
          <el-table-column prop="trackState" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">详情/编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
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

    <el-dialog
      title="地址库详情"
      :visible.sync="showAllWebsite"
      width="750px"
      :closeOnClickModal="false"
    >
      <el-form :model="formAddress" class="formAddress">
        <el-form-item label="地址编号:" label-width="80px" class="mb0">{{formAddress.code}}</el-form-item>
        <el-form-item label="省:" class="formItem" label-width="80px">{{formAddress.sheng}}</el-form-item>
        <el-form-item label="市:" class="formItem" label-width="80px">{{formAddress.shi}}</el-form-item>
        <el-form-item label="区/县:" class="formItem" label-width="80px">{{formAddress.qu}}</el-form-item>
        <el-form-item label="街道 / 乡镇:" class="formItem" label-width="100px">
          <el-input v-model="formAddress.stree" placeholder="请输入"></el-input>
        </el-form-item>
        <ul class="navsourse">
          <li
            :class="{'active':item.soureType==true}"
            v-for="(item,index) in source"
            :key="index"
            @click="getclickS(item)"
          >{{item.name}}</li>
        </ul>
        <el-form-item label="地址编号:" label-width="80px" class="mb0">{{formAddress.code}}</el-form-item>
        <el-form-item label="省:" class="formItem" label-width="80px">{{formAddress.sheng}}</el-form-item>
        <el-form-item label="市:" class="formItem" label-width="80px">{{formAddress.shi}}</el-form-item>
        <el-form-item label="区/县:" class="formItem" label-width="80px">{{formAddress.qu}}</el-form-item>
        <el-form-item label="街道 / 乡镇:" class="formItem" label-width="100px">
          <el-select
            placeholder="全部"
            class="fipt w100"
            @change="getfeilei"
            v-model="formAddress.selectStree"
          >
            <el-option
              :label="item.lableName"
              :value="item.id"
              v-for="(item,index) in getCateLables"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right;margin-top:20px">
          <el-button @click="showAllWebsite=false">取消</el-button>
          <el-button type="primary" @click="getAddress">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VJstree from 'vue-jstree';
export default {
  data () {
    return {
      source: [
        {
          type: 1,
          name: '京东',
          soureType: true
        },
        {
          type: 3,
          name: '苏宁易购',
          soureType: false
        },
        {
          type: 4,
          name: '网易严选',
          soureType: false
        }
      ],
      showAllWebsite: false,
      openKeys: '1',
      districtNamelist: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        streeName: ''
      },
      addressInfo: '',
      getAdressInfo: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      loading: true,
      formAddress: {
      },
      getCateLables: [],
      nodeModel: {},
      firstTime: true
    }
  },
  components: {
  },
  mounted () {
    this.getdistrictnamelist(1, 0)
  },
  methods: {
    getfeilei () { },
    getclickS (item) {
      for (let index = 0; index < this.source.length; index++) {
        const element = this.source[index]
        element.soureType = false
      }
      item.soureType = true
    },
    getAddress () { },
    detail (item) {
      console.log(item)
      var area = this.addressInfo.split('/')
      this.formAddress = {
        code: item.districtCode,
        sheng: area[0],
        shi: area[1],
        qu: area[2],
        stree: item.name,
        selectStree: ''
      }
      this.showAllWebsite = true
    },
    itemClick (node) {
      console.log(node)
      if (node.level === 1) {
        this.getdistrictnamelist(2, node.id)
      }      else if (node.level === 2) {
        this.getdistrictnamelist(3, node.id)
      }      else {
        this.getDataList(node)
      }
    },
    getdistrictnamelist (type, id) {
      this.$http({
        url: this.$http.adornUrl('/base-address-api/baseDistrict/backendbasedistrict/getdistrictnamelist'),
        method: 'post',
        data: this.$http.adornData({
          id: id
        }, true)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 省
          if (type === 1) {
            for (let indexA = 0; indexA < data.districtNamelist.length; indexA++) {
              const elementA = data.districtNamelist[indexA]
              elementA.label = elementA.name
              elementA.id = elementA.id
              elementA.children = []
              elementA.opened = true
              elementA.level = 1
              elementA.type = elementA.type
            }
            this.districtNamelist = data.districtNamelist
            if (this.firstTime === true) {
              this.itemClick(this.districtNamelist[0])
            }
          }
          // 市
          if (type === 2) {
            for (let i = 0; i < this.districtNamelist.length; i++) {
              const ii = this.districtNamelist[i]
              ii.children = []
              for (let indexB = 0; indexB < data.districtNamelist.length; indexB++) {
                const elementB = data.districtNamelist[indexB]
                if (ii.id == id) {
                  ii.children.push({
                    opened: true,
                    label: elementB.name,
                    id: elementB.id,
                    children: [],
                    level: 2,
                    type: elementB.type

                  })
                }
              }
            }
            if (this.firstTime === true) {
              this.itemClick(this.districtNamelist[0].children[0])
            }
          }
          // 区
          if (type === 3) {
            for (let j = 0; j < this.districtNamelist.length; j++) {
              const jj = this.districtNamelist[j]
              for (let k = 0; k < jj.children.length; k++) {
                const kk = jj.children[k]
                kk.children = []
                for (let indexC = 0; indexC < data.districtNamelist.length; indexC++) {
                  const elementC = data.districtNamelist[indexC]
                  if (kk.id == id) {
                    kk.children.push({
                      opened: true,
                      label: elementC.name,
                      id: elementC.id,
                      children: [],
                      level: 3,
                      type: elementC.type,
                      levelName: jj.label + ' / ' + kk.label + ' / ' + elementC.name
                    })
                  }
                }
              }
            }
            if (this.firstTime === true) {
              this.firstTime = false
              this.$nextTick(() => {
                this.itemClick(this.districtNamelist[0].children[0].children[0])
              })
            }
          }
        }
      })
    },
    // 获取数据列表
    getDataList (node) {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl('/base-address-api/baseDistrict/backendbasedistrict/getdistrictlist'),
        method: 'post',
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          id: node.id,
          type: node.type
        }, true)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getAdressInfo = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.getAdressInfo = []
          this.totalPage = 0
        }
        this.loading = false
        this.addressInfo = node.levelName
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      if (id) {
        console.log(id)
      } else if (this.ordername == '') {
        return this.$message.error('请选择所属机构')
      }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.userId
        })
      this.$confirm(
        `确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
        })
        .catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  border-left: 4px solid #3E8EF7;
  font-size: 16px;
  padding-left: 10px;
  color: #3c3c3c;
}
.address-left {
  width: 260px;
  display: inline-block;
  border: 1px solid #d7d7d7;
  border-radius: 8px 8px 8px 8px;
  margin-right: 20px;
  min-height: 500px;
  .sid-menu {
    padding: 10px;
    line-height: 32px;
    max-height: 500px;
    overflow-y: auto;
    font-size: 14px;
  }
}
.address-right {
  width: calc(100% - 300px);
  display: inline-block;
  vertical-align: top;
  h3 {
    padding-bottom: 10px;
  }
}
.formAddress {
  margin-top: -20px;
}
.mb0 {
  margin-bottom: 0;
}
.formItem {
  display: inline-block;
  margin-bottom: 10px;
  color: #999999;
}
.navsourse {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  li {
    min-width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    top: 2px;
    position: relative;
    -webkit-transition: 0.2s ease;
    transition: 0.2s ease;
    border: 1px solid #fff;
    border-radius: 3px;
    display: inline-block;
    cursor: pointer;
    &.active {
      border: 1px solid #ddd;
      border-bottom: 1px solid #fff;
      background-color: #fff;
    }
  }
}
/deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #e6f7ff;
  border-right: #1890ff solid 2px;
}
</style>
