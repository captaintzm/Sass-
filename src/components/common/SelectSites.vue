<template>
  <transition name="fade">
    <el-dialog
      title="选择站点"
      :visible.sync="isShow"
      width="800px"
      heigth="450px"
      :closeOnClickModal="true"
      class="elDialogOpem"
    >
      <span class="tips">商品添加的商品数量不超过500,商城数量不超过5个</span>
      <div class="creatsite">
        <div class="cl">
          <h5>选择应用类型</h5>
          <ul>
            <li class="active">积分应用场景</li>
          </ul>
        </div>
        <div class="cr">
          <h5>
            点击可选中多个站点(
            <span>已选中{{checkboxGroup1.length}}个</span>)
          </h5>
          <el-checkbox-group v-model="checkboxGroup1" size="small" class="checkboxlist">
            <el-checkbox
              :label="item.id"
              border
              v-for="(item,index) in siteList"
              :key="index"
            >{{item.siteName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div style="text-align:right">
        <el-button @click="isShow=false">取消</el-button>
        <el-button type="primary" @click="getsite">确认</el-button>
      </div>
    </el-dialog>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      checkboxGroup1: [],
      siteList: []
    }
  },
  watch: {
    checkboxGroup1 () {
      console.log(this.checkboxGroup1)
    }
  },
  created () {
    this.sbmitlist()
  },
  methods: {

    sbmitlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/querySiteList'),
        method: 'post',
        data: ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.siteList = data.siteList
        } else {

        }
      })
    },
    getsite () {
      if (this.checkboxGroup1.length === 0) {
        return this.$message.error('请至少勾选一个商城，商城数量不超过5个')
      }
      if (this.checkboxGroup1.length > 5) {
        return this.$message.error('商城数量不超过5个')
      }
      this.isShow = false
      this.$emit('getsiteIds', this.checkboxGroup1)
    }
  }
}
</script>

<style lang="scss" scoped>
.elDialogOpem {
  .tips {
    position: absolute;
    left: 90px;
    top: 20px;
    color: #1985ff;
  }
}
.creatsite {
  margin: 0 auto;
  width: 665px;
  .cl,
  .cr {
    width: 320px;
    display: inline-block;
    height: 300px;
    overflow: hidden;

    border: #cdcdcd 1px solid;
    margin-right: 10px;
    h5 {
      text-align: center;
      line-height: 40px;
      border-bottom: #cdcdcd 1px solid;
      margin-bottom: 10px;
    }
    ul {
      li {
        padding: 10px;
        line-height: 30px;
        cursor: pointer;
        &.active {
          background: #f5f5f5;
        }
      }
    }
    .checkboxlist {
      padding: 10px;
      overflow-y: scroll;
      height: 250px;
      .el-checkbox {
        display: block;
        margin-left: 0;
        margin-bottom: 10px;
        width: 215px;
        overflow: hidden;
      }
    }
  }
}
</style>
