<template>
  <div class="commoditiesAdd">
    <h4 class="title">基本信息</h4>
    <el-form
       :disabled="isdisablehowpic"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="商品编号" prop="itemCode">
         <el-col :span="2" v-if="!this.$route.query.id && activeName==3">
             <span style="display:inline-block">XN—{{supplyId}}</span>
         </el-col>
        <el-col :span="4">
          <el-input
            v-model="ruleForm.itemCode"
            placeholder="请输入商品编号"
            :disabled="!!this.$route.query.id"
            v-if="isCopy!='copy'"
          ></el-input>
          <el-input v-model="ruleForm.itemCode" placeholder="请输入商品编号" v-if="isCopy=='copy'"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品图片" required>
        <el-upload

          class="avatar-uploader"
          :action="url"
          :show-file-list="false"
          :beforeUpload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :data="myHeaders"
        >
          <img
            v-if="ruleForm.photo"
            :src="ruleForm.photo"
            class="avatar"
            style="display:inline-block"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="display:inline-block;padding-left:10px;color:red">建议尺寸：800*800</div>
      </el-form-item>
      <el-form-item label="分类" required>
        <el-col>
          <el-select
            v-model="ruleForm.lableId"
            placeholder="请选择商品一级分类"
            @change="mallProductCates = [],
                    ruleForm.levelId = '',
                    selectLableName(ruleForm.lableId)"
          >
            <el-option
              :label="item.lableName"
              :value="item.id"
              v-for="item in mallCateLables"
              :key="item.id"
            ></el-option>
          </el-select>
          <span v-if="ruleForm.lableId && mallProductCates.length">
            -
            <el-select
              v-model="ruleForm.levelId"
              placeholder="请选择商品二级分类"
              @change="mallItemCates = [],ruleForm.itemCate = '',getThirdCateLevelList(ruleForm.levelId)"
            >
              <el-option
                :label="value.catName"
                :value="value.id"
                v-for="value in mallProductCates"
                :key="value.id"
              ></el-option>
            </el-select>
          </span>
          <span v-if="ruleForm.levelId && mallItemCates.length">
            -
            <el-select v-model="ruleForm.itemCate" placeholder="清选择商品三级分类">
              <el-option
                :label="value.catName"
                :value="value.id"
                v-for="value in mallItemCates"
                :key="value.id"
              ></el-option>
            </el-select>
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="商品名称">
        <!-- <el-col
          :span="item.col"
          v-for="item in shopName"
          :key="item.placeHolder"
          style="margin-right: 10px;"
        >
          <el-input v-model="ruleForm[item.model]" :placeholder="item.placeholder"></el-input>
        </el-col>-->
        <el-col :span="3" style="margin-right: 10px;">
          <el-input v-model="ruleForm.brandName" placeholder="品牌(必填)"></el-input>
        </el-col>
        <el-col :span="3" style="margin-right: 10px;">
          <el-input v-model="ruleForm.fullName" placeholder="全名(必填)"></el-input>
        </el-col>
        <el-col :span="3" style="margin-right: 10px;">
          <el-input v-model="ruleForm.typeNo" :placeholder="activeName==3?'型号(选填)':'型号(必填)'"></el-input>
        </el-col>
        <el-col :span="5" style="margin-right: 10px;">
          <el-input v-model="ruleForm.comments" placeholder="商品详情(非必填)"></el-input>
        </el-col>
        <span style="font-size:14px;color:#999999">商品名称最多200个字符，超过后无法保存</span>
      </el-form-item>
       <el-form-item label="商品卖点">
        <el-col :span="14" style="margin-right: 10px;">
            <el-input type="textarea" v-model="ruleForm.characteristic" placeholder="在商品详情页标题下面展示卖点信息，建议60字以内（非必填）" maxlength="60"></el-input>
          </el-col>
       </el-form-item>
      <h4 class="title">价格信息</h4>
      <el-form-item label="供应价" prop="supplyPrice">
        <el-col :span="4">
          <el-input
            v-model="ruleForm.supplyPrice"
            placeholder="请输入供应价"
            @keyup.stop.native="ruleForm.supplyPrice= ruleForm.supplyPrice.replace(/[^\.\d]/g,'')"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="市场价" prop="markPrice">
        <el-col :span="4">
          <el-input
            v-model="ruleForm.markPrice"
            placeholder="请输入市场价"
            @keyup.stop.native="ruleForm.markPrice= ruleForm.markPrice.replace(/[^\.\d]/g,'')"
          ></el-input>
        </el-col>
      </el-form-item>
       <el-form-item label="面值" prop="price" v-if="activeName==3">
        <el-col :span="4">
          <el-input
            v-model="ruleForm.price"
            placeholder="请输入面值"
            @keyup.stop.native="ruleForm.price= ruleForm.price.replace(/[^\d]/g,'')"
          ></el-input>
        </el-col>
      </el-form-item>
      <h4 class="title" v-if="activeName!=3">库存信息</h4>
      <el-form-item label="库存数量" prop="stockNum" v-if="activeName!=3">
        <el-col :span="4">
          <el-input
            v-model="ruleForm.stockNum"
            placeholder="请输入库存数量"
          ></el-input>
        </el-col>
      </el-form-item>
       <el-form-item label="兑换链接"  v-if="activeName==3">
        <el-col :span="8">
          <el-input
            v-model="ruleForm.exchangeUrl"
            placeholder=""
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品详情">
        <el-col :span="60">
          <quill-editor v-model="ruleForm.content" ref="myQuillEditor" :options="editorOption" ></quill-editor>
        </el-col>
      </el-form-item>
       <el-form-item label="兑换说明" v-if="activeName==3">
        <el-col :span="60">
          <quill-editor v-model="ruleForm.cashExplain" ref="myQuillEditor1" :options="editorOption1" ></quill-editor>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="上架位置" required>
        <el-col :span="8">
          <el-checkbox-group v-model="ruleForm.position" size="small" @change="getposition">
              <el-checkbox label="1">SaaS平台商品库</el-checkbox>
              <el-checkbox label="2">API商品池</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="success" @click="submit(5)">保存为草稿</el-button>
        <el-button type="primary" @click="submit(3)">确认上架</el-button>
      </el-form-item>
    </el-form>
    <el-upload
      :action="url"
      :data="myHeaders"
      multiple
      list-type="picture-card"
      :on-success="handleAvatarSuccessHide"
      :beforeUpload="beforeAvatarUpload"
      style="display:none;"
      id="elUpLoad"
    ></el-upload>
     <el-upload
      :action="url"
      :data="myHeaders"
      multiple
      list-type="picture-card"
      :on-success="handleAvatarSuccessHide1"
      :beforeUpload="beforeAvatarUpload1"
      style="display:none;"
      id="elUpLoad1"
    ></el-upload>
  </div>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  // [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]
export default {
  data () {
    // checkitemCode
    var checkitemCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入值需为数字或字母与数字的组合'))
      } else {
        const reg1 = /^[0-9a-zA-Z]*$/
        console.log(reg1.test(value))
        if (reg1.test(value)) {
          callback()
        } else {
          return callback(new Error('输入值需为数字或字母与数字的组合'))
        }
      }
    }
    var checkcreaterd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入正整数'))
      } else {
        const reg2 = /^\+?[1-9][0-9]*$/
        console.log(reg2.test(value))
        if (reg2.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的值！'))
        }
      }
    }
    return {
      editorOption: {
        placeholder: '上传图片合计不能超过6MB',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('#elUpLoad input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      editorOption1: {
        placeholder: '建议上传图片，图片大小不能超过6M',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('#elUpLoad1 input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      // 一级菜单
      mallCateLables: [],
      // 二级菜单
      mallProductCates: [],
      // 三级菜单
      mallItemCates: [],
      siteId: localStorage.getItem('pageSiteId'),
      // 表单
      ruleForm: {
        itemCode: '',
        // type: '1',
        photo: '',
        lableId: '',
        levelId: '',
        itemCate: '',
        brandName: '',
        fullName: '',
        typeNo: '',
        comments: '',
        characteristic: '',
        supplyPrice: '',
        markPrice: '',
        price: '',
        stockNum: '',
        content: '',
        cashExplain: '',
        exchangeUrl: '',
        position: ['1']
      },
      alertMsg: {
        itemCode: '请填写商品编号',
        photo: '请上传商品图片',
        lableId: '请选择商品一级分类',
        levelId: '请选择商品二级分类',
        itemCate: '请选择商品三级分类',
        brandName: '请填写商品品牌',
        fullName: '请填写商品全名',
        typeNo: '请填写商品型号',
        supplyPrice: '请填写供应价',
        markPrice: '请填写市场价',
        price: '请填写面值',
        stockNum: '请填写库存数量'
      },
      // 商品名称数据
      shopName: [
        { model: 'brandName', placeholder: '品牌(必填)', col: 3 },
        { model: 'fullName', placeholder: '全名(必填)', col: 3 },
        { model: 'typeNo', placeholder: Number(this.activeName) === 3 ? '型号(选填)' : '型号(必填)', col: 3 },
        { model: 'comments', placeholder: '商品详情(非必填)', col: 5 }
      ],
      // 表单校验规则
      rules: {
        itemCode: [
          { validator: checkitemCode, required: true, trigger: 'blur' }
        ],
        brandName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        supplyPrice: [
          { required: true, message: '请输入供应价', trigger: 'blur' }
        ],
        markPrice: [
          { required: true, message: '请输入市场价', trigger: 'blur' }
        ],
        price: [
          {required: true, message: '请输入面值', trigger: 'blur'}
        ],
        stockNum: [
          { validator: checkcreaterd, required: true, trigger: 'change' }
        ]
      },
      // 配置上传图片地址
      url: '',
      // 上传图片携带token
      myHeaders: { token: localStorage.getItem('token') + '.' + localStorage.getItem('orgId') + '.' + localStorage.getItem('pageSiteId') },
      submitFlag: false,
      isCopy: this.$route.query.type,
      activeName: this.$route.query.activeName,
      orgId: localStorage.getItem('orgId'),
      orgType: localStorage.getItem('orgType'),
      supplyId: JSON.parse(localStorage.getItem('userInfo')).supplyId,
      isdisablehowpic: false
    }
  },
  created () {
    // 获取分类一级菜单
    this.getqueryLable()
    // 配置上传地址
    this.url = this.$http.adornUrl(`/ybt-backend/sys/oss/upload`)
    this.code = this.$http.adornUrl(`/ybt-backend/sys/oss/upload`)
    if (this.$route.query.id) this.getProductInfoByProductId()
    if (this.$route.query.id && Number(this.orgType) === 4 && this.supplyId <= 1) {
      this.isdisablehowpic = true
    }
  },
  computed: {
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  methods: {
    getposition (e) {
      console.log(e.length)
      if (e.length === 1) {

      }
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isLt2M) {
        this.$message({
          message: '商品图片合计不得超过6M，请重新选择！',
          type: 'error'
        })
      }
      return isLt2M
    },
    beforeAvatarUpload1 (file) {
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isLt2M) {
        this.$message({
          message: '商品图片合计不得超过6M，请重新选择！',
          type: 'error'
        })
      }
      return isLt2M
    },
    handleAvatarSuccessHide (res, file) {
      let quill = this.$refs.myQuillEditor.quill
      console.log(quill)
      // 如果上传成功
      if (res.code == 0) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
    },
    handleAvatarSuccessHide1 (res, file) {
      let quill = this.$refs.myQuillEditor1.quill
      console.log(quill)
      // 如果上传成功
      if (res.code == 0) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
    },
    cancel () {
      this.tabsCloseCurrentHandle()
      this.$router.replace('/commoditiesList')
    },
    // 通过id查询单条数据
    getProductInfoByProductId () {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/product/product/getProductInfoByProductId'
        ),
        method: 'post',
        data: { id: this.$route.query.id }
      }).then(data => {
        if (data.data.code === 0) {
          for (let k in this.ruleForm) {
            if (data.data.product[k]) this.ruleForm[k] = data.data.product[k]
          }
        }
        if (this.ruleForm.lableId) {
          this.ruleForm.lableId = parseInt(this.ruleForm.lableId)
          this.selectLableName(this.ruleForm.lableId)
        }
        if (this.ruleForm.levelId) {
          this.ruleForm.levelId = parseInt(this.ruleForm.levelId)
          this.getThirdCateLevelList(this.ruleForm.levelId)
        }
        if (this.ruleForm.itemCate) {
          this.ruleForm.itemCate = parseInt(this.ruleForm.itemCate)
        }
        if (data.data.product.source === 1) {
          this.ruleForm.photo =
            'http://img13.360buyimg.com/n1/' + this.ruleForm.photo
        }
        if (this.isCopy === 'copy') {
          this.ruleForm.itemCode = ''
        }
        this.ruleForm.price = data.data.product.faceValue
      })
    },
    tabsCloseCurrentHandle () {
      this.mainTabs = this.mainTabs.filter(
        item => item.name !== this.mainTabsActiveName
      )
    },
    // 表单提交
    submit (operStatus) {
      var reg = /^((0|[1-9])\d*)(\.\d+)?$/
      for (let k in this.ruleForm) {
        if (k === 'comments' || k === 'content' || k === 'exchangeUrl' || k === 'characteristic' || k === 'cashExplain') continue
        if (Number(this.activeName) === 3 && k === 'exchangeUrl' || Number(this.activeName) === 3 && k === 'typeNo' || Number(this.activeName) === 3 && k === 'stockNum' || k === 'price' && Number(this.activeName) !== 3) {
          continue
        }
        if (!this.ruleForm[k]) {
          return this.$message.error(this.alertMsg[k])
        }
        if (k === 'stockNum' && !reg.test(this.ruleForm[k]) && Number(this.activeName) !== 3) {
          return this.$message.error('请输入正确的值！')
        }
      }
      if ((this.ruleForm['brandName'].length + this.ruleForm['fullName'].length + this.ruleForm['typeNo'].length + this.ruleForm['comments'].length) > 200) {
        return this.$message.error('商品名称不得超过200，请校验后输入！')
      }
      // if (this.ruleForm.position.length === 0) {
      //   return this.$message.error('请至少选一个商品上架的位置')
      // }
      // 多次提交节流阀
      if (this.submitFlag) return
      this.submitFlag = true
      let obj = JSON.parse(JSON.stringify(this.ruleForm))
      if (this.isCopy !== 'copy') {
        if (this.$route.query.id) {
          obj.id = this.$route.query.id
        }
      }
      obj.siteId = this.siteId
      obj.operStatus = operStatus
      obj.type = Number(this.activeName)
      if (this.$route.query.id) {

      } else {
        obj.itemCode = obj.type === 3 ? 'XN-' + this.orgId + '' + obj.itemCode : obj.itemCode
      }
      if (obj.type === 3) {
        obj.faceValue = this.ruleForm.price
      }

      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/product/product/saveOrUpdateSupplyProduct'
        ),
        method: 'post',
        data: this.$http.adornData(obj)
      }).then(data => {
        this.submitFlag = false
        if (data && data.data.code === 0) {
          // 循环清空数据
          for (let k in this.ruleForm) {
            this.ruleForm[k] = ''
          }
          this.shopName.forEach(item => {
            item.model = ''
          })
          this.$message.success(operStatus === 3 ? '上架成功' : '保存草稿成功')
          this.tabsCloseCurrentHandle()
          this.$router.replace('/commoditiesList?activeName=' + this.activeName)
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    // 获取分类一级菜单
    getqueryLable () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/product/queryLable'),
        method: 'post',
        params: this.$http.adornParams({
          siteId: this.siteId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.mallCateLables = data.mallCateLables
        }
      })
    },
    // 根据一级分类获取二级菜单
    selectLableName (lableId) {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/product/product/queryProductCate'
        ),
        method: 'post',
        params: this.$http.adornParams({
          lableId
        })
      }).then(data => {
        if (data.data.code === 0) {
          this.mallProductCates = data.data.mallProductCates
        }
      })
    },
    // 根据二级分类获取三级菜单
    getThirdCateLevelList (levelId) {
      this.mallItemCates = []
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/product/product/getThirdCateLevelListByLevelId'
        ),
        method: 'post',
        params: this.$http.adornParams({
          levelId
        })
      }).then(data => {
        if (data.data.code === 0) {
          this.mallItemCates = data.data.supplyCateProductList
        }
      })
    },
    // 上传图片
    handleAvatarSuccess (res, file) {
      if (res.code === 401) {
        if (localStorage.getItem('isFromYunCai') ==='true') {
          this.$router.push({ name: 'loginYc' })
        } else {
          this.$router.push({ name: 'login' })
        }
      } else {
        this.ruleForm.photo = res.url
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload{
   border: 1px dashed #d9d9d9 !important;
}
.commoditiesAdd {
  h4 {
    font-size: 16px;
    font-weight: 600;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  /deep/ .ql-editor {
    min-height: 300px;
    .ql-blank::before{
      font-style: normal;
    }
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
  //上面代码是兼容火狐与谷歌的样式
  //下面代码是兼容ie9以下浏览器的样式，包括ie9
    filter: gray;
  }
}
</style>
