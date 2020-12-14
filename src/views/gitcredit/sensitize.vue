<template>
  <div class="fenfa">
    <div>
      <el-button :disabled="ffStatus==4" @click="backPage()">返回上一级</el-button>
    </div>
    <!-- <form id="form1" action="http://192.168.50.40:8081/ybt-backend/packsinfo/packsinfo/importuser" method="post" enctype="multipart/form-data" >
    　　<input type="file" name="F" style="width:160px;" />
    　　<input type="submit" name="Submit" value="提交" />
    </form>-->
    <el-form ref="form" :model="forms" label-width="80px" :label-position="labelPosition">
      <el-steps :active="4" align-center>
        <el-step title="创建积分" description></el-step>
        <el-step title="发放积分" description></el-step>
        <el-step title="企业充值" description></el-step>
        <el-step title="企业激活" description></el-step>
      </el-steps>
      <p class="gitpackhs">发放概要</p>
      <el-form-item label="总积分">
        <span>{{wumen}}</span>
        <span :style="{'margin-left':'50px'}">总人数</span>
        {{wumenum}}
      </el-form-item>

      <el-form-item label="激活福利">
        <el-button type="primary" @click="divide(groupName,4)" :disabled="ffStatus==4">全部激活</el-button>
      </el-form-item>

      <div class="tableIiem">
        <span
          v-for="(items,indexs) in tableData"
          :key="indexs"
          class="tableIndexs"
          @click="tableIndexs=indexs"
          :class="{active:indexs==tableIndexs}"
        >{{indexs==-1?'未分组':indexs}}</span>
      </div>

      <div v-for="(item,index) in tableData" :key="index" v-show="tableIndexs==index">
        <div :style="{'width':'542px'}" class="rers">
          <el-button
            type="primary"
            v-show="tableIndexs==index"
            @click="divide(index,3)"
            :disabled="ffStatus==4"
          >分组激活</el-button>
        </div>
        <el-table
          :data="item"
          border
          style="width:542px"
          :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        >
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="phone" label="电话" width="180"></el-table-column>
          <el-table-column prop="amount" label="充值额度" width="180"></el-table-column>
        </el-table>
      </div>
      <!-- <el-form-item class="selectbtn">
      <el-button @click="fenfa('3')">保存</el-button>
      <el-button type="primary" @click="centerDialogVisible=true">确认分发</el-button>
      </el-form-item>-->
    </el-form>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="500px">
      <div class="fenfa-queren">
        <span>确认积分发放</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="fenfa('4')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      centerDialogVisible: false,
      labelPosition: 'left',
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },

      fileList: [],
      radio: 1,
      options: [],
      tableData: [],
      value: '',
      forms: {},
      form: {},
      wumen: 0,
      wumenum: 0,
      importUsers: [],
      tableIndexs: '',
      groupName: '',
      ffStatus: ''
    }
  },
  mounted () {

  },

  created () {
    this.router()
  },
  watch: {
  },
  methods: {
    backPage () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/detailById'),
        method: 'post',
        params: this.$http.adornParams({
          id: this.$route.query.voucherId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)

          let mallSites = data.mallSites
          let packsInfo = data.voucher
          let userLis = data.userLis
          // console.log(mallSites,packsInfo,sources)
          this.$router.push({ path: '/gitcredit-distributect', query: { voucherId: this.$route.query.voucherId } })
        } else {
          console.log(121)
        }
      })
    },
    divide (index, acticedFlag) {
      this.$http({
        // /packsinfo/packsinfo/productList
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/activied'),
        method: 'post',
        params: this.$http.adornParams({
          voucherId: this.$route.query.voucherId,
          groupName: index,
          ffStatus: acticedFlag
        })

      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(6666)
          this.$message.success('激活成功')
          this.$router.push({ path: '/gitcredit-creditlist' })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    router () {
      this.ffStatus = this.$route.query.ffStatus
      this.tableData = this.$route.query.tableData
      for (var key in this.tableData) {
        this.groupName += key + ','
        console.log(key)
        this.tableIndexs = key
        console.log(this.groupName)
        for (var keys in this.tableData[key]) {
          console.log(this.tableData[key][keys].amount)
          this.importUsers.push(this.tableData[key][keys])
          console.log(this.importUsers)
          this.wumen += ((this.tableData[key][keys].amount) * 1)
        }
        this.wumenum += (this.tableData[key].length)
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
    }
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';

.fenfa {
  .backPage {
    color: #FBB471;
    cursor: pointer;
  }

  padding-left: 3.5%;

  /deep/ .el-dialog {
    height: 300px;
    width: 500px;
    border-radius: 6px;
    overflow: hidden;
  }

  .tableIiem {
    overflow: hidden;

    .tableIndexs {
      float: left;
      width: 180px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 4px 4px 0px 0px;

      &.active {
        background-color: #1985FF;
        color: #ffffff;
      }
    }
  }

  .rers {
    // background-color :#ffffff;
    position: absolute;
    left: 285px;
    top: 223px;
  }

  /deep/ .el-dialog__header {
    padding: 0;
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    background: #F7F7F7;

    /deep/ .el-dialog__title {
      font-size: 14px;
      line-height: 34px;
      margin-left: 15px;
    }

    /deep/ .el-dialog__headerbtn {
      top: 5px;
    }
  }

  /deep/ .el-dialog__body {
    padding: 0;
    font-size: 14px;
    margin: 70px 0 40px;
  }

  /deep/ .el-dialog__footer {
    text-align: center;

    /deep/ .el-button--default {
      background: #F1F1F1;
      width: 87px;
      height: 32px;
      padding: 0;
    }

    /deep/ .el-button--primary {
      width: 87px;
      height: 32px;
      padding: 0;
    }
  }

  .upload-demo {
    // margin-top:40px;
  }

  .selectbtn {
    margin-top: 60px;
    padding-left: 300px;
  }

  /deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 98px;
  }

  /deep/ .el-upload-list--picture-card {
    width: 100px;
    height: 100px;
    line-height: 98px;
  }

  .fenfa-queren {
    text-align: center;
  }

  .gitpackhs {
    font-size: 16px;
    color: #333333;
    font-family: Microsoft YaHei;
    font-weight: 400;
    margin-bottom: 33px;
  }

  .xianzhi {
    font-size: 16px;
    color: #333333;
  }

  .textarea {
    height: 103px;
    width: 690px;
    display: block;
    margin-top: 10px;
  }
}
</style>
