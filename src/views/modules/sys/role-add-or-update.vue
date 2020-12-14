<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称" maxlength="10"></el-input>
      </el-form-item>

      <el-form-item label="角色类型" v-if="!dataForm.id">
        <!-- <el-input v-model="ordername" placeholder="归属机构"></el-input> -->
        <el-select v-model="style" placeholder="请选择" class="el-selects" :style="{'width':'350px'}">
          <el-option v-for="item in option" :key="item.id" :label="item.siteName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :check-strictly="true"
          :default-expand-all="true"
          @check="clickDeal"
          show-checkbox
        ></el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisable">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      style: 1,
      isDisable: false,
      option: [
        {
          siteName: '公司员工',
          id: 1
        },
        {
          siteName: '线上供应商',
          id: 2
        }
      ],
      xitong: '系统设置',
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      labels: [],
      dataForm: {
        id: 0,
        roleName: '',
        orgId: '',
        remark: ''
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      createUserId: '',
      menuIdList: [],
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  watch: {
    visible () {
      if (this.visible === false) {
        this.dataForm.id = 0
        this.dataForm.roleName = ''
        this.dataForm.orgId = ''
        this.dataForm.remark = ''
        this.style = 1
        this.menuList = []
        this.$refs.menuListTree.setCheckedKeys([])
      }
    }
  },
  methods: {
    clickDeal (currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.menuId) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children != undefined) {
          if (currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame (treeList, isSelected) {
      this.$refs.menuListTree.setChecked(treeList.menuId, isSelected)
      if (treeList.children != undefined) {
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent (currentObj) {
      let currentNode = this.$refs.menuListTree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.menuListTree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    init (id) {
      this.menuList = []
      this.dataForm.id = id || 0
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/menu/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.labels = data
        this.menuList = treeDataTranslate(data, 'menuId')
        console.log(this.menuList)
        this.visible = true
        if (this.dataForm.id) {
          this.getroleinfo()
        }
      })
    },
    getroleinfo () {
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/ybt-backend/sys/role/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.roleName = data.role.roleName
            this.dataForm.remark = data.role.remark
            this.dataForm.orgId = data.role.orgId
            this.style = data.role.type
            this.createUserId = data.role.createUserId
            var idx = data.role.menuIdList.indexOf(this.tempKey)
            if (idx !== -1) {
              data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
            }
            // this.getRoleIds(data.role.menuIdList, this.$refs.menuListTree)
            this.$refs.menuListTree.setCheckedKeys([])
            this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      let checkedKeys = this.$refs.menuListTree.getCheckedKeys()
      let hafCheckedKeys = this.$refs.menuListTree.getHalfCheckedKeys()
      let menuIdListIds = checkedKeys.concat(hafCheckedKeys)
      console.log(menuIdListIds)
      // let menuIdListIds = this.getActMenuIds(actArr)
      // console.log(actArr)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisable = true
          this.$http({
            url: this.$http.adornUrl(`/ybt-backend/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'roleId': this.dataForm.id || undefined,
              'roleName': this.dataForm.roleName,
              'orgId': this.dataForm.orgId,
              'remark': this.dataForm.remark,
              'type': this.style,
              'createUserId': this.createUserId || undefined,
              'menuIdList': menuIdListIds
            })
          }).then(({ data }) => {
            this.isDisable = false
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
    // getActMenuIds (arr) {
    //   let actLabel = [...arr]
    //   for (let i = 0; i < actLabel.length; i++) {
    //     let obj = this.labels.filter((item) => actLabel[i] === item.menuId)[0] || {}
    //     if (obj.parentId) {
    //       let parentObj = this.labels.filter((item) => obj.parentId === item.menuId)[0] || {}
    //       actLabel.push(parentObj.menuId)
    //     }
    //   }
    //   let array = Array.from(new Set(actLabel));
    //   return array
    // }
  }
}
</script>

<style lang="scss" scoped>
.shouquan-tab {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  background-color: #ffffff;
  .ites {
    width: 30%;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    text-align: center;
  }
  .ites-muk {
    width: 20%;
  }
  .ites-ym {
    width: 20%;
  }
  .ites-gn {
    width: 60%;
  }
}
.shouquan-conter {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  background-color: #ffffff;
  .conter-one {
    width: 20%;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    text-align: center;
  }
  .conter-tow {
    width: 80%;
    background-color: #ffffff;
    border: 1px solid #bda4a4;
    box-sizing: border-box;
    text-align: center;
    .itemsr {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      border-bottom: 1px solid #cccccc;

      .itemsr-name {
        padding: 5px;
        border-right: 1px solid #cccccc;
        width: 26.5%;
      }
      .col-r {
        width: 80%;
        text-align: left;
        .itemssan {
          padding: 5px;
          display: inline-block;
          text-align: center;
        }
      }
    }
  }
}
</style>
