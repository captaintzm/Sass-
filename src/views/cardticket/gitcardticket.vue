<template>
  <div class="gitcredit">
    <div @click="$router.push({ path: '/cardticket-yzxlist' })" class="backPage">返回上一级</div>
    <el-form ref="form" label-width="130px" :label-position="labelPosition">
      <el-steps :active="1" align-center>
        <el-step title="创建卡券" description></el-step>
        <el-step title="激活卡券" description></el-step>
      </el-steps>
      <p class="gitpackhs">基本信息</p>
      <el-form-item label="卡Bin编号">
        <span>{{cardBin}}</span>
        <span :style="{'margin-left':'370px'}">批次号</span>
        {{batchNo}}
      </el-form-item>

      <el-form-item label="卡券名称">
        <el-input :style="{'width':'350px'}" v-model="names"></el-input>
        <span :style="{'margin-left':'20px'}">所属商城</span>
        <el-select v-model="siteId" placeholder="请选择" class="el-selects" :style="{'width':'350px'}">
          <el-option v-for="item in option" :key="item.id" :label="item.siteName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <div class="xianzhi">
        <p>使用信息</p>
      </div>

      <el-form-item label="卡券面值">
        <el-input :style="{'width':'350px'}" v-model="blance"></el-input>
      </el-form-item>

      <el-form-item label="有效期限">
        <el-date-picker
          v-model="validStartDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getSTime"
          placeholder="选择日期时间"
            :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
        <el-date-picker
          v-model="validEndDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="getSTime"
          placeholder="选择日期时间"
            :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="制卡数量">
        <el-input :style="{'width':'350px'}" v-model="cardNum"></el-input>
      </el-form-item>

      <div class="gitpack_btn">
        <el-button @click="save('1')">保存为草稿</el-button>
        <el-button type="primary" @click="save('2')">下一步</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'left',
      names: '',
      detail: '',
      siteId: '',
      photoUrl: '',
      validStartDate: '',
      validEndDate: '',
      ffStatus: 0,
      id: '',
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },
      dialogImageUrl: '',
      fileList: [],
      option: [],
      value: '',
      imgArr: [],
      operStatus: 1,
      cardBin: '',
      batchNo: '',
      blance: 0,
      cardNum: ''
    }
  },
  mounted () {

  },
  watch: {
    // '$route': 'routers'
    // '$route'(to,from){
    //   console.log(to.path)
    //   // if(to.path=="/gitpack-zidingyi-gitpack"){

    //     console.log(this.$route.path)
    //     this.routers()
    //     // this.savedo()
    //   // }
    // }
  },
  created () {
    this.savedo()
    //   this.routers()
    Date.prototype.toLocaleString = function () {
      return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds()
    };
  },

  methods: {
    getSTime () {
      this.dataForm.beginDate = val
    },
    // router 监听
    // routers(){
    //   this.names=this.$route.query.voucher.cardName
    //   this.validStartDate=this.$route.query.voucher.validStartDate
    //   this.validEndDate=this.$route.query.voucher.validEndDate
    //   this.blance=this.$route.query.voucher.price
    //   this.batchNo=this.$route.query.voucher.batchNo
    //   this.cardNum=this.$route.query.voucher.cardNum
    //   this.cardBinNo=this.$route.query.voucher.cardBinNo
    //   // this.fileList=this.$route.query.packsInfo.photoUrl
    //   // console.log(this.imgArr)
    //   this.siteId=this.$route.query.voucher.siteId
    //   this.id=this.$route.query.id
    // },
    // 保存  下一步
    save (itd) {
      if (this.names == '') {
        return this.$message.error('请填写卡券名称')
      }

      if (this.siteId == '') {
        return this.$message.error('请选择所属商城')
      }

      if (this.blance == '') {
        return this.$message.error('请填写卡券面值')
      }

      if (this.validEndDate == '' || this.validStartDate == '') {
        return this.$message.error('请完善有效时间')
      }

      if (this.cardNum == '') {
        return this.$message.error('请填写制卡数量')
      }
      console.log(this.imgArr)

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/card/cardyyzx/save'),
        method: 'post',
        params: this.$http.adornParams({
          cardName: this.names,
          siteId: this.siteId,
          validEndDate: this.validEndDate,
          validStartDate: this.validStartDate,
          cardNum: this.cardNum,
          blance: this.blance,
          cardBinNo: this.cardBin,
          batchNo: this.batchNo
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // let mallSites=data.mallSites;

          console.log(111)
          if (itd == 1) {
            this.$message.success('保存成功')
            this.$router.push({ path: '/cardticket-yzxlist' })
          } else if (itd == 2) {
            let id = data.id
            this.$router.push({ path: '/cardticket-setcardticket', query: { id } })
          }
        } else {
          this.$message.error('操作失败')
        }
      })
    },

    // 礼包来源  所属商城
    savedo () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/card/cardyyzx/savedo'),
        method: 'post',
        params: this.$http.adornParams({
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // let mallSites=data.mallSites;
          this.cardBin = data.cardBin
          this.batchNo = data.batchNo
          // if(this.$route.query.voucher.cardBinNo){
          //   this.cardBin=this.$route.query.voucher.cardBinNo
          // }else{
          //   this.cardBin=data.cardBin
          // }

          // if(this.$route.query.voucher.batchNo){
          //   this.batchNo=this.$route.query.voucher.batchNo
          // }else{
          //   this.batchNo=data.batchNo
          // }
          this.option = data.mallSites
          console.log(111)
        } else {
        }
      })
    },

    sbmit () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/list'),
        method: 'get',
        params: this.$http.adornParams({
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
        } else {
          console.log(121)
        }
      })
    }
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';

.gitcredit {
  .backPage {
    color: #FBB471;
    cursor: pointer;
  }

  padding-left: 3.5%;

  .el-selects {
    width: 30%;
    height: 32px;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    text-decoration: none;
    color: #000000;

    /deep/ .el-input__inner {
      background: #F5F6FA;
      height: 32px;
      line-height: 32px;
      border: 1px solid #DDDDDD;
      border-radius: 0;
    }
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

  /deep/ .el-upload-list__item {
    width: 100px;
    height: 100px;
    line-height: 98px;
  }
}

.gitpackhs {
  font-size: 16px;
  color: #333333;
  font-family: Microsoft YaHei;
  font-weight: 700;
  margin-bottom: 50px;
}

.tishions {
  color: #FBB471;
  font-size: 12px;
  line-height: 16px;
  margin-top: 6px;
}

.tishi {
  color: #FFB367;
  font-size: 12px;
  margin-left: 35px;
}

.xianzhi {
  font-size: 16px;
  color: #333333;
  margin-bottom: 30px;
  margin-top: 50px;
  font-weight: 700;
}

.applydesc {
  height: 103px;
  width: 75%;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 2px;
  border: 1px solid #DDDDDD;
  outline: none;
  resize: none;
  background: #F5F6FA;
}

.gitpack_btn {
  margin-top: 50px;
  padding-left: 500px;
}
</style>
