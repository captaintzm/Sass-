<template>
  <div class="siteWrapper">
    <div class="gitpack">
      <!-- <el-steps :active="1" align-center>
        <el-step title="创建礼包" description></el-step>
        <el-step title="挑选商品" description></el-step>
        <el-step title="分发礼包" description></el-step>
      </el-steps>-->

      <ybtSteps stepText1="创建礼包" stepText2="挑选商品" stepText3="分发礼包" styleName="3"></ybtSteps>

      <p class="gitpackhs">发放概要</p>

      <div class="radio atsup">
        <span class="apply-num">礼包封面*</span>
        <el-upload
          :action="url"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :class="{hide:hideUpload}"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :headers="myHeaders"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <div class="tishions">提示：图片和视频只能选择其中一种</div>
      </div>
      <div class="radio">
        <span class="apply-num zhufu">祝福文字</span>
        <textarea class="applydesc" placeholder="请输入祝福语"></textarea>
      </div>
      <div class="xianzhi">
        <p>限制条件</p>
      </div>
      <div class="radio">
        <span class="apply-num">所属商城</span>
        <el-select v-model="value" placeholder="请选择" class="el-selects">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="mechanism">对下级机构开放</span>
        <el-radio v-model="radio" label="1">是</el-radio>
        <el-radio v-model="radio" label="2">否</el-radio>
        <span class="tishi">提示：开放后您的礼包将展示给下级机构</span>
      </div>
      <div class="radio">
        <span class="apply-num">允许领取商品个数</span>
        <input type="text" name id placeholder="请输入个数" class="input_text" />
        <span class="mechanism">有效时间</span>
        <div class="block">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
          ></el-date-picker>
        </div>
      </div>
      <div class="radio">
        <span class="apply-num">礼包来源</span>
        <el-select v-model="value" placeholder="请选择" class="el-selects">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="radio beizhu">
        <span class="apply-num zhufu">备注</span>
        <textarea class="applydesc" placeholder="请输入备注"></textarea>
      </div>
      <div class="gitpack_btns">
        <div class="btn rough">保存为草稿</div>
        <div class="btn nextstep">下一步</div>
      </div>
    </div>
  </div>
</template>

<script>
import ybtSteps from '@/components/steps/ybtSteps';
export default {
  data () {
    return {
      url: "",
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },

      radio: '1',
      dialogImageUrl: "",
      fileList: [],
      hideUpload: false,
      dialogVisible: false,
      value1: '',
      value2: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      imgArr: [],

    }
  },
  mounted () {

  },
  methods: {
    init () {
      this.url = this.adornUrl('/ybt-backend/sys/oss/upload')
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
      console.log(file.response.data);
      this.imgArr.forEach((v, i) => {
        console.log(v);
        console.log(v == file.response.data);
        if (v == file.response.data) {
          this.imgArr.splice(i, 1);
          console.log(this.imgArr);
          return;
        }
      });
      console.log(this.imgArr);
    },
    handlePictureCardPreview (file) {
      console.log(this.file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess (res, file, fileList) {
      console.log(res, file, fileList);
      this.imgArr.push(res.data);
      console.log(this.imgArr);
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
  },
  components: {
    ybtSteps
  },
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl';

.gitpack {
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
  font-weight: 400;
}

.atsup {
  /deep/ .el-upload-list__item-status-label {
    display: none;
  }

  .tishions {
    color: #FBB471;
    font-size: 12px;
    line-height: 16px;
    margin-top: 6px;
  }
}

.xianzhi {
  font-size: 16px;
  color: #333333;
}

.radio {
  margin-top: 20px;
  padding-left: 111px;
  position: relative;

  .tishi {
    color: #FFB367;
    font-size: 12px;
    margin-left: 35px;
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

  .apply-num {
    color: #303133;
    width: 96px;
    display: inline-block;
    font-size: 12px;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 34px;
  }

  .zhufu {
    font-size: 16px;
    color: #333333;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .input_text {
    width: 30%;
    height: 34px;
    padding-left: 10px;
    background: rgba(245, 246, 250, 1);
    border: 1px solid rgba(226, 232, 237, 1);
    font-size: 12px;
  }

  .mechanism {
    font-size: 12px;
    color: #303133;
    margin-left: 50px;
    margin-right: 20px;
  }

  .block {
    display: inline-block;
  }
}

.beizhu {
  margin-top: 50px;
}

.gitpack_btns {
  margin-top: 50px;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;

  .btn {
    width: 100px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    border-radius: 4px;
    font-size: 12px;
  }

  .rough {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(228, 230, 237, 1);
    margin-right: 20px;
    color: #949BB8;
    font-size: 12px;
  }

  .nextstep {
    background: rgba(68, 134, 244, 1);
    color: #FFFFFF;
    font-size: 12px;
  }
}
</style>
