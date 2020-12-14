<template>
  <div class="siteWrapper">
    <div class="gitpack">
      <div style="text-align:right">
        <el-button
          @click="$router.push({ path: '/gitpack-zidingyi-packlist' })"
          type="primary"
        >返回上一级</el-button>
      </div>
      <ybtSteps stepText1="创建礼包" stepText2="挑选商品" stepText3="分发礼包" styleName="1"></ybtSteps>
      <!-- <div @click="$router.push({ path: '/gitpack-zidingyi-packlist' })" class="backPage">返回上一级</div> -->
      <el-form ref="form" label-width="90px" :label-position="labelPosition">
        <!-- <el-steps :active="1" align-center>
          <el-step title="创建礼包" description></el-step>
          <el-step title="挑选商品" description></el-step>
        </el-steps>-->
        <p class="gitpackhs">礼包封面</p>
        <el-form-item label="礼包名称" required>
          <el-input :style="{'width':'350px'}" v-model="names"></el-input>
        </el-form-item>

        <el-form-item label="礼包标价" required>
          <el-input :style="{'width':'350px'}" v-model="salePrice"></el-input>
          <!-- <input type="text" name="" id="" placeholder="请输入" class="input_text" v-model="salePrice"> -->
          <span class="mechanism" :style="{'margin-left':'30px'}">显示价格</span>
          <el-radio v-model="radios" label="1">是</el-radio>
          <el-radio v-model="radios" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="礼包封面">
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
          <!-- <div v-if="photoUrl=='' && photoUrls !=''"><img :src="photoUrls" alt=""></div> -->
          <div class="tishions">提示：图片和视频只能选择其中一种</div>
        </el-form-item>
        <el-form-item label="祝福文字">
          <textarea class="applydesc" placeholder="请输入祝福语" v-model="shareContent"></textarea>
        </el-form-item>
        <div class="xianzhi">
          <p>限制条件</p>
        </div>
        <el-form-item label="所属商城" required>
          <el-select
            v-model="siteId"
            placeholder="请选择"
            class="el-selects"
            :style="{'width':'350px'}"
          >
            <el-option
              v-for="item in option"
              :key="item.id"
              :label="item.siteName"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <span class="mechanism" :style="{'margin':'0 30px'}">对下级机构开放</span>
        <el-radio v-model="radiocs" label="1">是</el-radio>
        <el-radio v-model="radiocs" label="2">否</el-radio>
        <span class="mechanism" v-if="radiocs==1">供应价:</span>
        <el-input :style="{'width':'60px'}" v-model="supplyPrice" v-if="radiocs==1"></el-input>
          <span class="tishi">提示：开放后您的礼包将展示给下级机构</span>-->
        </el-form-item>

        <el-form-item label="礼包来源" required>
          <el-select
            v-model="productSource"
            placeholder="请选择"
            class="el-selects"
            :style="{'width':'350px'}"
            :disabled="disableds"
          >
            <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
            v-model="orderTime"
            type="datetimerange"
            :picker-options="pickerOptions1"
             format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="selectTimeOrderTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="允许领取商品个数" required label-width="150px">
          <el-input :style="{'width':'350px'}" v-model="selectNum" placeholder="请输入个数"></el-input>
        </el-form-item>

        <div class="gitpack_btn">
          <el-button @click="save('1')">保存为草稿</el-button>
          <el-button type="primary" @click="save('2')">下一步</el-button>
          <!-- <div class="btn rough" @click="save('1')">保存为草稿</div> -->
          <!-- <div class="btn nextstep" @click="save('2')">下一步</div> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ybtSteps from '@/components/steps/ybtSteps'
export default {
  data () {
    return {
      orderTime: '',
      pickerOptions1: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      url: '',
      labelPosition: 'left',
      names: '',
      salePrice: '',
      shareContent: '',
      productSource: '',
      siteId: '',
      selectNum: 1,
      photoUrl: '',
      validStartDate: '',
      validEndDate: '',
      supplyPrice: '',
      ffStatus: 0,
      minPrice: '',
      maxPrice: '',
      isShowPrice: 0,
      isOpenBranch: 1,
      id: '',

      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },

      radios: '1',
      radiocs: '2',
      dialogImageUrl: '',
      fileList: [],
      hideUpload: false,
      dialogVisible: false,
      value1: '',
      value2: '',
      options: [],
      option: [],
      value: '',
      imgArr: [],
      soosous: 0,
      operStatus: 0,
      disableds: false
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
    this.init()
    this.savedo()
    this.routers()
    Date.prototype.toLocaleString = function () {
      return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds()
    };

    // this.$watch('route')
    // this.savedo()
  },

  methods: {
    selectTimeOrderTime (val) {
      console.log(val)
      this.orderTime = val
    },
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({ name: this.mainTabs[this.mainTabs.length - 1].name }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.menuActiveName = ''
        var url = localStorage.getItem('menuListFirstUrl')
        url = url.replace('/', '')
        if (this.mainTabsActiveName === url) {
          location.reload()
        }
        if (location.host === 'sc.ebaoton.cn') {
          location.href = location.origin + '/admin/#/' + url
        } else if (location.host === 'saas-test.ycb51.cn') {
          location.href = location.origin + '/backend_page/#/' + url
        } else {
          location.href = location.origin + '/#/' + url
        }
        // this.$router.push({ name: 'home' })
      }
    },
    init () {
      this.url = this.$http.adornUrl(`/ybt-backend/sys/oss/upload`)
    },
    // router 监听

    getSTime () {
      this.dataForm.beginDate = val
    },
    routers () {
      if (JSON.stringify(this.$route.query) == '{}') {

      } else {
        this.option = this.$route.query.mallSites
        this.options = Object.values(this.$route.query.sources)
        this.names = this.$route.query.packsInfo.name
        this.salePrice = this.$route.query.packsInfo.salePrice
        this.isShowPrice = this.$route.query.packsInfo.isShowPrice
        if (this.isShowPrice == 1) {
          this.radios = '1'
        } else {
          this.radios = '2'
        }
        this.validStartDate = this.$route.query.packsInfo.validStartDate
        this.validEndDate = this.$route.query.packsInfo.validEndDate
        this.orderTime = []
        this.orderTime[0] = this.validStartDate
        this.orderTime[1] = this.validEndDate
        this.selectNum = this.$route.query.packsInfo.selectNum
        this.supplyPrice = this.$route.query.packsInfo.supplyPrice
        this.shareContent = this.$route.query.packsInfo.shareContent
        if (this.supplyPrice) {
          this.radiocs = '1'
        } else {
          this.radiocs = '2'
        }
        console.log(this.$route.query.packsInfo.photoUrl)
        if (this.$route.query.packsInfo.photoUrl != '') {
          this.fileList = [{ name: '', url: '' }]
          this.fileList[0].url = this.$route.query.packsInfo.photoUrl
          this.photoUrl = this.$route.query.packsInfo.photoUrl
        }
        // console.log(this.imgArr)
        this.siteId = this.$route.query.packsInfo.siteId
        if (this.$route.query.packsInfo.productSource != '') {
          this.disableds = true
        } else {
          this.disableds = false
        }

        this.productSource = this.options[(this.$route.query.packsInfo.productSource) - 1]
        console.log(this.options)
        this.id = this.$route.query.id
      }
    },

    // 保存  下一步
    save (itd) {
      let creat = /^\d+$/

      if (this.radios == 1) {
        this.isShowPrice = 1
      } else {
        this.isShowPrice = 0
      }

      if (this.names == '') {
        return this.$message.error('礼包名称不能为空')
      }
      if (this.salePrice == '') {
        return this.$message.error('礼包价格不能为空')
      }
      if (!creat.test(this.salePrice)) {
        return this.$message.error('请输入正确格式的价格')
      }

      if (this.siteId == '') {
        return this.$message.error('请选择商城')
      }
      if (this.productSource == '') {
        return this.$message.error('请选择礼包来源')
      }
      if (this.selectNum == '') {
        return this.$message.error('允许领取个数不能为空')
      }
      if (!creat.test(this.selectNum)) {
        return this.$message.error('允许领取个数格式不正确')
      }

      if (this.imgArr.length > 0) {
        this.photoUrl = this.imgArr[0]
      }
      // let indexs=(this.options).findIndex(this.productSource)
      // console.log(indexs)

      for (let i = 0; i < this.options.length; i++) {
        if (this.productSource == this.options[i]) {
          console.log(i)
          this.soosous = i
        }
      }

      console.log(this.imgArr)

      console.log(this.validStartDate, this.validEndDate)

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/save'),
        method: 'post',
        params: this.$http.adornParams({
          name: this.names,
          salePrice: this.salePrice,
          shareContent: this.shareContent,
          productSource: this.soosous + 1,
          siteId: this.siteId,
          selectNum: this.selectNum,
          isShowPrice: this.isShowPrice,
          ffStatus: this.ffStatus,
          supplyPrice: this.supplyPrice,
          photoUrl: this.photoUrl,
          validEndDate: this.orderTime === null || this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[1],
          validStartDate: this.orderTime === null || this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[0],
          isOpenBranch: this.isOpenBranch,
          operStatus: this.operStatus,
          id: this.id

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // let mallSites=data.mallSites;

          console.log(111)
          if (itd == 1) {
            this.$message.success('保存成功')
            this.$router.push({ path: '/gitpack-zidingyi-packlist' })
          } else if (itd == 2) {
            let packsId = data.packsId
            let siteId = data.siteId
            let source = data.source
            this.$router.push({ path: '/gitpack-zidingyi-selectshoop', query: { packsId, siteId, source, ffStatus: itd } })
          }
        } else {
          this.$message.error('操作失败')
        }
      })
    },

    // 礼包来源  所属商城
    savedo () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/savedo'),
        method: 'post',
        params: this.$http.adornParams({
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // let mallSites=data.mallSites;
          this.option = data.mallSites
          this.options = Object.values(data.sources)
          console.log(111)
          console.log(this.option)
          console.log(Object.values(this.options))
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      console.log(file.response.data)
      this.imgArr.forEach((v, i) => {
        console.log(v);
        console.log(v == file.response.data);
        if (v == file.response.data) {
          this.imgArr.splice(i, 1);
          console.log(this.imgArr);
          
        }
      })
      console.log(this.imgArr)
    },
    handlePictureCardPreview (file) {
      console.log(this.file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess (res, file, fileList) {
      console.log(res, file, fileList)
      this.imgArr.push(res.url)
      console.log(this.imgArr)
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
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl';

.gitpack {
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
  font-family: Microsoft YaHei;
  font-weight: 700;
  line-height: 21px;
  color: #333333;
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
