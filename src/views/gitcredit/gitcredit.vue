<template>
  <div class="gitcredit">
    <div @click="$router.push({ path: '/gitcredit-creditlist' })" class="backPage">返回上一级</div>
    <el-form ref="form" label-width="130px" :label-position="labelPosition">
      <el-steps :active="1" align-center>
        <el-step title="创建积分" description></el-step>
        <el-step title="发放积分" description></el-step>
        <el-step title="企业充值" description></el-step>
        <el-step title="企业激活" description></el-step>
      </el-steps>
      <p class="gitpackhs">积分封面</p>
      <el-form-item label="积分主题">
        <el-input :style="{'width':'350px'}" v-model="names"></el-input>
      </el-form-item>

      <el-form-item label="积分封面*">
        <el-upload
          :action="url"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :class="{hide:hideUpload}"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :headers="myHeaders"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <div class="tishions">提示：图片和视频只能选择其中一种</div>
      </el-form-item>

      <el-form-item label="祝福文字">
        <textarea class="applydesc" placeholder="请输入祝福语" v-model="detail"></textarea>
      </el-form-item>
      <div class="xianzhi">
        <p>限制条件</p>
      </div>

      <el-form-item label="所属商城">
        <el-select v-model="siteId" placeholder="请选择" class="el-selects" :style="{'width':'350px'}">
          <el-option v-for="item in option" :key="item.id" :label="item.siteName" :value="item.id"></el-option>
        </el-select>

        <span class="mechanism" :style="{'margin':'0 58px 0 30px'}">有效时间</span>
        <el-date-picker
          v-model="validStartDate"
          type="datetime"
           format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="getSTime"
          placeholder="选择日期时间"
        ></el-date-picker>
        <el-date-picker
          v-model="validEndDate"
          type="datetime"
           format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="getSTime"
          placeholder="选择日期时间"
        ></el-date-picker>
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
      url: "",
      labelPosition: "left",
      names: "",
      detail: "",
      siteId: "",
      photoUrl: "",
      validStartDate: "",
      validEndDate: "",
      ffStatus: 0,
      id: "",

      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },

      dialogImageUrl: "",
      fileList: [],
      hideUpload: false,
      dialogVisible: false,
      option: [],
      value: '',
      imgArr: [],
      operStatus: 1,
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
    this.init()
    this.routers()
    Date.prototype.toLocaleString = function () {
      return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    };
  },

  methods: {
    init () {
      this.url = this.$http.adornUrl(`/ybt-backend/sys/oss/upload`)
    },
    getSTime () {
      this.dataForm.beginDate = val
    },
    // router 监听
    routers () {
      console.log(JSON.stringify(this.$route.query) == "{}")
      if (JSON.stringify(this.$route.query) == "{}") {

      } else {
        this.option = this.$route.query.mallSites
        this.names = this.$route.query.packsInfo.name
        this.validStartDate = this.$route.query.packsInfo.validStartDate
        this.validEndDate = this.$route.query.packsInfo.validEndDate
        this.photoUrl = this.$route.query.packsInfo.photoUrl
        // console.log(this.imgArr)
        this.siteId = this.$route.query.packsInfo.siteId
        this.id = this.$route.query.id
        this.detail = this.$route.query.packsInfo.detail
      }
      // if(this.$route.query.mallSites.length>0){
      //   this.option=this.$route.query.mallSites
      //   this.names=this.$route.query.packsInfo.name
      //   this.validStartDate=this.$route.query.packsInfo.validStartDate
      //   this.validEndDate=this.$route.query.packsInfo.validEndDate
      //   this.photoUrl=this.$route.query.packsInfo.photoUrl
      //   // console.log(this.imgArr)
      //   this.siteId=this.$route.query.packsInfo.siteId
      //   this.id=this.$route.query.id
      //   this.detail=this.$route.query.packsInfo.detail
      // }

    },

    //保存  下一步
    save (itd) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/nextPush'),
        method: 'post',
        params: this.$http.adornParams({
          id: this.id,

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
        } else {
          this.$message(data.msg)
        }
      })

      if (this.imgArr.length > 0) {
        this.photoUrl = this.imgArr[0]
      }
      console.log(this.imgArr)
      console.log(this.validStartDate, this.validEndDate)


      this.$http({
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/save'),
        method: 'post',
        params: this.$http.adornParams({
          name: this.names,
          detail: this.detail,
          siteId: this.siteId,
          ffStatus: this.ffStatus,
          photoUrl: this.photoUrl,
          validEndDate: this.validEndDate,
          validStartDate: this.validStartDate,
          id: this.id,
          operStatus: this.operStatus

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // let mallSites=data.mallSites;

          console.log(111)
          if (itd == 1) {
            this.$message('操作成功');
            this.$router.push({ path: '/gitcredit-creditlist' })
          } else if (itd == 2) {
            let voucherId = data.voucherId
            this.$router.push({ path: '/gitcredit-distributect', query: { voucherId } })
          }

        } else {
          this.$message(data.msg)
        }
      })
    },

    // 礼包来源  所属商城
    savedo () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/savedo'),
        method: 'post',
        params: this.$http.adornParams({
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // let mallSites=data.mallSites;
          this.option = data.mallSites;
          console.log(111)
          console.log(this.option)
        } else {
          this.$message.error('操作失败');
        }
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleRemove (file, fileList) {
      this.imgArr.forEach((v, i) => {
        if (v == file.response.data) {
          this.imgArr.splice(i, 1);
          return;
        }
      });
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess (res, file, fileList) {
      this.imgArr.push(res.url);
    },
    sbmit () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/list'),
        method: 'get',
        params: this.$http.adornParams({
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
        } else {
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
