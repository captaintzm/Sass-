<template>
  <el-dialog
    title="商品详情"
    :visible.sync="showProDetail"
    width="800px"
    heigth="450px"
    :closeOnClickModal="true"
    class="elDialogOpem"
  >
    <div class="proDetailist">
      <div class="proDetailContent">
        <div class="proDetaiL">
          <img :src="photo" />
        </div>
        <div class="proDetaiR">
          <h1>{{brandName}}</h1>
          <p class="ptitle">{{itemName}}</p>
          <p v-if="type=='xsj'">销售价：{{salePrice}}元</p>
          <p v-if="type=='gyj' && hideFlag==0">供应价：{{supplyPrice}}元</p>
          <p>市场价：{{markPrice}}元</p>
          <p v-if="sourceid==2">库存：{{stockNum}}</p>
          <p v-else>库存：{{status}}</p>
          <p>分类：{{itemCateName}}</p>
          <p>商品来源：{{supplyName}}</p>
          <p>商品ID：{{itemCode}}</p>
        </div>
      </div>
       <div v-if="ProDetaillist.length>0">
        <img :src="item" v-for="item in ProDetaillist" :key="item.id"/>
      </div>
      <div v-else v-html="ProDetail" class="dialogDetail"></div>
    </div>
  </el-dialog>
</template>
<script>

export default {
  name: 'index',
  data () {
    return {
      photo: '',
      brandName: '',
      itemName: '',
      salePrice: '',
      supplyPrice: '',
      markPrice: '',
      sourceid: 1,
      stockNum: 0,
      status: '',
      itemCateName: '',
      supplyName: '',
      itemCode: '',
      ProDetail: '',
      showProDetail: false,
      type: 'xsj',
      hideFlag: '',
      ProDetaillist: []
    }
  },
  mounted () {
    this.hideFlag = Number(this._hideFlag)
  },
  methods: {
    getInt (item, sourceid, stockNum) {
      this.ProDetaillist = []
      this.photo = item.photo
      this.brandName = item.brandName
      this.itemName = item.itemName
      this.supplyPrice = item.supplyPrice
      this.markPrice = item.markPrice
      this.sourceid = item.sourceid
      this.stockNum = item.stockNum
      this.status = stockNum
      // this.itemCateName = sourceid === 1 ? item.itemCateName.replace(/,/g, '<') : ''
      this.itemCateName = item.itemCateName.replace(/,/g, '<')
      this.supplyName = item.supplyName
      this.itemCode = item.itemCode
      this.ProDetail = item.ProDetail
      this.brandName = item.brandName
      if (Number(item.source) === 9) {
        if (item.content !== null) {
          var items = item.content.split(';')
          this.ProDetaillist = items
        }
      } else {
        this.ProDetail = item.content === null ? item.nappintroduction : item.content
      }
    }
  },
  components: {

  }
}
</script>
<style lang="scss" scoped>
.elDialogOpem {
  /deep/ .el-dialog__body {
    padding-top: 0;
  }
  .proDetailist {
    height: 400px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .proDetaiL {
    width: 300px;
    vertical-align: top;
    display: inline-block;
    overflow: hidden;
    img{
      max-width: 100%;
    }
  }
  .proDetaiR {
    width: 400px;
    padding-left: 30px;
    display: inline-block;
    h1 {
      font-size: 16px;
      color: #333333;
      margin-bottom: 10px;
    }
    p {
      line-height: 30px;
      color: #333333;
      font-size: 12px;
    }
    .ptitle {
      color: #999999;
      line-height: 20px;
    }
  }
  .dialogDetail {
    margin-top: 50px;
  }
}
</style>
