<template>
  <div class="fenfa">
    <div>
      <el-button :disabled="ffStatus==2" @click="backPage()">返回上一级</el-button>
    </div>
    <!-- <form id="form1" action="http://192.168.50.40:8081/ybt-backend/packsinfo/packsinfo/importuser" method="post" enctype="multipart/form-data" >
    　　<input type="file" name="F" style="width:160px;" />
    　　<input type="submit" name="Submit" value="提交" />
    </form>-->
    <el-form
      ref="form"
      :model="forms"
      label-width="80px"
      :label-position="labelPosition"
      class="els"
    >
      <el-steps :active="3" align-center>
        <el-step title="创建礼包" description></el-step>
        <el-step title="挑选商品" description></el-step>
        <el-step title="分发礼包" description></el-step>
      </el-steps>
      <p class="gitpackhs">发放概要</p>
      <el-form-item label="总人数">
        <span>{{tableData.length || 0}}</span>
      </el-form-item>
      <!-- <div class="radio">
        <span class="fenfa-apply-num">总人数</span>
        <div class="biaojia">
            <span>{{importUsers.length}}</span>
        </div>
      </div>-->
      <el-form-item label="批量配送">
        <el-radio-group v-model="forms.resource" :disabled="ffStatus==2">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认地址" v-if="forms.resource==1">
        <!-- <span class="fenfa-apply-num">默认地址</span> -->
        <el-cascader
          :disabled="ffStatus==2"
          class="selectorDiv"
          :options="options"
          @active-item-change="handleItemChange"
          @change="channelChange"
          :props="props"
          v-model="val"
          separator="-"
        ></el-cascader>
        <el-input type="textarea" v-model="addressDetail" class="textarea" :disabled="ffStatus==2"></el-input>
      </el-form-item>
      <el-form-item label="批量发放">
        <el-button type="primary" @click="centerDialogs=true" :disabled="ffStatus==2">批量导入</el-button>
      </el-form-item>
      <el-table
        v-if="tableData.length>0"
        :data="tableData"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
        height="250"
        style="width: 361px;margin-top:20px"
      >
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="180"></el-table-column>
        <!-- <el-table-column
        prop="address"
        label="地址">
        </el-table-column>-->
      </el-table>
      <el-form-item class="selectbtn">
        <el-button @click="fenfa('1')" :disabled="ffStatus==2">保存</el-button>
        <el-button type="primary" @click="centerDialogVisible=true" :disabled="ffStatus==2">确认发放</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="提示" :visible.sync="centerDialogs" width="500px">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="url"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :headers="myHeaders"
        :on-change="handleChange"
        :on-success="handleUploadSuccess"
        :auto-upload="false"
      >
        <el-button size="small" type="primary" :style="{'margin-left':'20px'}">选择导入文件</el-button>
      </el-upload>
      <span :style="{'margin-left':'20px'}">
        <a download href="http://sc.ebaoton.cn/file/user_import_no_group.xlsx">模板下载</a>
      </span>
      <div :style="{'margin-top':'10px'}">
        <span :style="{'margin-left':'20px'}">提示</span>
        <span :style="{'margin-left':'20px'}">1、数据格式有误则导入全部失败</span>
        <!-- <p :style="{'margin-left':'75px'}">2、导入后可单击修改</p> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogs = false">取消</el-button>
        <el-button type="primary" @click="centerDialogs = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="500px">
      <div class="fenfa-queren">
        <span>确认礼包发放</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="fenfa('2')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      centerDialogs: false,
      centerDialogVisible: false,
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          console.log(111111111111111111)
          console.log(521221)
          // const { level } = node;
          console.log(node)
          const promise = this.getDistrictList(node).then((res) => {
            console.log(res)
            let item = node.data
            console.log(node.data)

            resolve(res)
          })
        }
      },
      labelPosition: 'left',
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },
      fileList: [],
      radio: 1,
      options: [],
      tableData: [],
      value: '',
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
      arrId: [],
      form: {
        source: 1,
        receiverName: '',
        receiverPhone: '',
        receiverPhone1: '',
        addressDetail: '',
        siteId: '',
        token: '',
        vo: {
          city: '',
          cityName: '',
          county: '',
          countyName: '',
          province: '',
          provinceName: '',
          town: '',
          townName: '',
          source: 1
        }
      },
      val: [],
      returnVal: [],
      returnname: [],
      arr: {},
      mens: 0,
      address: {
        provinceName: '',
        province: '',
        cityName: '',
        city: '',
        countyName: '',
        county: '',
        townName: '',
        town: ''
      },
      addressDetail: '',
      importUsers: [],
      isBatSend: 0,
      addressre: {},
      url: '',
      ffStatus: ''
    }
  },
  mounted () {

  },
  created () {
    this.init()
    if (this.$route.query.userList.length > 0) {
      this.fenfaquery()
    } else {
      return console.log(121212)
    }
  },
  watch: {
    val () {
      console.log(this.val)
    }
  },
  methods: {
    handleChange (file, fileList) {
      this.submitUpload()
    },
    init () {
      this.url = this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/importuser')
      console.log(this.url)
    },
    backPage () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/detailById'),
        method: 'post',
        params: this.$http.adornParams({
          id: this.$route.query.packsId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)

          let mallSites = data.mallSites
          let packsInfo = data.packsInfo
          let sources = data.sources
          let packsInfoAdrr = data.packsInfoAdrr
          let userList = data.userList
          // console.log(mallSites,packsInfo,sources)
          this.$router.push({ path: '/gitpack-zidingyi-selectshoop', query: { packsId: this.$route.query.packsId, siteId: packsInfo.siteId, source: packsInfo.productSource } })
        } else {
          console.log(121)
        }
      })
    },
    fenfaquery () {
      if (JSON.stringify(this.$route.query) == '{}') {
        console.log(12121212122121)
      } else {
        console.log(111111111)
        this.ffStatus = this.$route.query.packsInfo.ffStatus
        this.tableData = this.$route.query.userList
        console.log(this.$route.query)
        if (this.$route.query.packsInfoAdrr == undefined) {
          console.log('12123132')
        } else {
          this.addressre = this.$route.query.packsInfoAdrr.address

          console.log(typeof (JSON.parse(this.addressre)))
          this.addressDetail = this.$route.query.packsInfoAdrr.addressDetail
          this.val.length = 4
          let adres = []
          for (let i in this.addressre) {
            // adres.push(this.addressre[i])
          }
          console.log(adres)
          this.val[0] = JSON.parse(this.addressre).province
          this.val[1] = JSON.parse(this.addressre).city
          this.val[2] = JSON.parse(this.addressre).county
          this.val[3] = JSON.parse(this.addressre).town
          console.log(this.val)
        }

        this.isBatSend = this.$route.query.packsInfo.isBatSend
        if (this.isBatSend == 1) {
          this.forms.resource = '1'
        } else {
          this.forms.resource = '2'
        }
      }
    },
    fenfa (ffStatus) {
      this.address.province = this.val[0]
      this.address.city = this.val[1]
      this.address.county = this.val[2]
      this.address.town = this.val[3]

      this.address.provinceName = this.form.vo.provinceName
      this.address.cityName = this.form.vo.cityName
      this.address.countyName = this.form.vo.countyName
      this.address.townName = this.form.vo.townName
      if (this.forms.resource == 1) {
        this.isBatSend = 1
      } else {
        this.isBatSend = 0
      }
      this.$http.post(
        // /packsinfo/packsinfo/productList
        this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/distribute'),
        this.$http.adornParams({
          packsId: this.$route.query.packsId,
          importUsers: this.tableData,
          ffStatus: ffStatus,
          isBatSend: this.isBatSend,
          address: JSON.stringify(this.address),
          addressDetail: this.addressDetail
        })
      ).then(({ data }) => {
        if (data && data.code === 0) {
          if (ffStatus == 2) {
            this.$message.success('发放成功')
          }
          this.centerDialogVisible = false
          this.$router.push({ path: '/gitpack-zidingyi-packlist' })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleItemChange (arrId) {
      console.log(arrId)
      console.log(this.options)
      this.arrId = arrId
    },
    getDistrictList (node) {
      return new Promise((resolve, reject) => {
        let item = node.data
        console.log(item)
        let level = node.level
        console.log(this.form.source)
        if (this.form.source == 1) {
          var Id = item ? item.value : 0
        } else {
          var Id = item
            ? node.level <= 3
              ? item.value
              : item.parentId + item.value
            : 0
        }
        let param = {
          source: this.form.source,
          parentId: Id
        }
        // this.$http.post(
        //   this.$api.districtList,
        //   this.$until.getFormData({
        //     source: this.form.source,
        //     parentId: Id
        //   })
        // )
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/district/district/listBySource'),
          method: 'post',
          params: this.$http.adornParams({
            source: this.form.source,
            parentId: Id

          })
        }).then(({ data }) => {
          // console.log(data)
          if (data.code == 0) {
            let rows = data.districtList
            let arr
            console.log(rows)

            if (rows.length > 0) {
              data.districtList.forEach(item => {
                // 用来获取点击最后的数据
                // console.log(item.districtId)
                // console.log(item)
                // console.log(arr)
                this.arr[item.districtId] = item
                // console.log(item)
                // console.log(arr)
              })
              console.log(this.arr)
              arr = data.districtList.map(item => {
                return {
                  source: this.form.source,
                  value: item.districtId,
                  label: item.name,
                  parentId: item.parentId,
                  children: [],
                  leaf: level == 3
                }
              })
            }            else {
              arr = [
                {
                  source: this.form.source,
                  value: node.value + '99',
                  label: '全区',
                  leaf: true
                }
              ]
            }
            resolve(arr)
          }
        })
      })
    },
    channelChange (value) {
      this.arrId = value
      let arr = []
      this.arrId.forEach(item => {
        // 找到对应id的值
        arr.push(this.arr[item])
        // console.log(this.arr[item].name)
        console.log(item)
      })
      arr.forEach((item, index) => {
        // form表单赋值 保存

        if (item && index == 0) {
          this.form.vo.provinceName = item.name
          this.form.vo.province = item.districtId
        }
        if (item && index == 1) {
          this.form.vo.cityName = item.name
          this.form.vo.city = item.districtId
        }
        if (item && index == 2) {
          this.form.vo.countyName = item.name
          this.form.vo.county = item.districtId
        }
        if (item && index == 3) {
          this.form.vo.townName = item.name
          this.form.vo.town = item.districtId
        }
        if (!item && index == 3) {
          this.form.vo.townName = '全区';
          this.form.vo.town = '99';
        }
      })
    },
    handleUploadSuccess (response, file, fileList) {
      console.log(response)
      if (response.code == 0) {
        this.$message.success('上传成功')
        this.centerDialogs = false
        this.$refs.upload.clearFiles()
      }
      if (response.code != 0) {
        this.$message.error('请按照正确的格式上传')
        this.$refs.upload.clearFiles()
      }
      this.fileList.length = 0
      this.tableData = response.userList
      // this.importUsers=response.userList
      // console.log(this.importUsers)
      this.handleRemove()
      console.log(this.tableData)
    },
    submitUpload () {
      this.$refs.upload.submit()
      console.log(111111)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },

    daoru () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/importuser'),
        method: 'post',
        enctype: 'multipart/form-data',
        params: this.$http.adornParams({

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(11111)
        } else {
          console.log(1222222)
        }
      })
    }
    //   sbmit(){
    //     this.$http({
    //       url: this.$http.adornUrl('mall/mallsite/list'),
    //       method: 'get',
    //       params: this.$http.adornParams({

    //       })
    //     }).then(({data}) => {
    //       if (data && data.code === 0) {
    //         console.log(111)
    //       } else {
    //        console.log(121)
    //       }
    //     })
    //   }
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';

.els {
  z-index: -9999;
}

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
    margin: 30px 0 40px;
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
