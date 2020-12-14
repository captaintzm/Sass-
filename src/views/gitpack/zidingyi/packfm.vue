<template>
  <div class="siteWrapper">
    <div class="packfm">
      <el-form ref="form" :model="forms" label-width="100px" :label-position="labelPosition">
        <el-steps :active="2" align-center>
          <el-step title="礼包详情" description></el-step>
          <el-step title="发放礼包" description></el-step>
        </el-steps>
        <p class="gitpackhs">礼包封面（可自定义编辑）</p>

        <el-form-item label="礼包名称">
          <el-input :style="{'width':'350px'}"></el-input>
        </el-form-item>

        <el-form-item label="礼包标价">
          <span :style="{'margin-right':'50px'}">298</span>
          <el-button type="primary">查看礼包商品列表</el-button>
        </el-form-item>

        <el-form-item label="礼包封面*">
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
        </el-form-item>
        <el-form-item label="祝福文字" :style="{'font-size':'16px'}">
          <textarea class="applydesc" placeholder="请输入祝福语"></textarea>
        </el-form-item>
        <div class="xianzhi">
          <p>限制条件</p>
        </div>

        <el-form-item label="有效期">
          <span>2019-12-30</span>
        </el-form-item>

        <div class="packfm_btn">
          <el-button>保存为草稿</el-button>
          <el-button type="primary">下一步</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: "",
      forms: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '2',
        desc: ''
      },
      labelPosition: "left",
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
      this.url = this.$http.adornUrl('/ybt-backend/sys/oss/upload')
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
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl';

.packfm {
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
  margin-bottom: 33px;
}

.xianzhi {
  font-size: 16px;
  color: #333333;
  margin-bottom: 33px;
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

.tishions {
  color: #FBB471;
  font-size: 12px;
  line-height: 16px;
  margin-top: 6px;
}

.packfm_btn {
  padding-left: 350px;
}
</style>
