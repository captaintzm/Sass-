<template>
  <div class="siteWrapper">
    <div class="tip" v-if="orgInfo.vipType === 1">
      <img src="./../img/warning.png" alt />
      <span>您目前为基础会员,最多能创建5个商城,目前还可建{{5-siteListNum}}个</span>
    </div>
    <ybtSteps :stepText1="stepText1" stepText2="填写基本信息" stepText3="配置商城" styleName="2"></ybtSteps>
    <div class="form-Pannel">
      <div class="form-list">
        <el-form
          :inline="true"
          :model="formInline"
          :rules="rules"
          ref="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="商城名称" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="商城说明" prop="name" v-if="orgType==2">
            <el-input v-model="formInline.summary" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="登录方式" prop="radio" required>
            <el-radio v-model="formInline.radio" label="1">手机号+密码</el-radio>
            <el-popover placement="top" title="提示" width="300" trigger="hover">
              <div class="popover-content">选取该登录方式后，可切换到【手机+验证码】，将不可切换到【账号+密码】</div>
              <i
                class="el-icon-question"
                style="margin-left: -30px;margin-right: 30px;color:#909399;font-size:14px;cursor:pointer"
                slot="reference"
              ></i>
            </el-popover>
            <el-radio v-model="formInline.radio" label="2">手机号+验证码</el-radio>
            <el-popover placement="top" title="提示" width="300" trigger="hover">
              <div class="popover-content">选取该登录方式后，可切换到【手机+密码】，将没法切换到【账号+密码】</div>
              <i
                class="el-icon-question"
                style="margin-left: -30px;margin-right: 30px;color:#909399;font-size:14px;cursor:pointer"
                slot="reference"
              ></i>
            </el-popover>
            <el-radio v-model="formInline.radio" label="3">账号+密码</el-radio>
            <el-popover placement="top" title="提示" width="300" trigger="hover">
              <div class="popover-content">选取该登录方式后，将不可再切换到【手机+验证码】【手机+密码】</div>
              <i
                class="el-icon-question"
                style="margin-left: -30px;margin-right: 30px;color:#909399;font-size:14px;cursor:pointer"
                slot="reference"
              ></i>
            </el-popover>
          </el-form-item>
          <el-form-item label="默认地址" class="selectStyle" required>
            <el-select v-model="formInline.valuePro" placeholder="请选择" @change="selectPro">
              <el-option
                v-for="(item,index) in address"
                :key="index"
                :label="item.name"
                :value="item.channelId"
              ></el-option>
            </el-select>
            <el-select v-model="formInline.valuecity" placeholder="请选择" @change="selectCity">
              <el-option
                v-for="(item,index) in city"
                :key="index"
                :label="item.name"
                :value="item.channelId"
              ></el-option>
            </el-select>
            <el-select v-model="formInline.valuearea" placeholder="请选择" @change="selectArea">
              <el-option
                v-for="(item,index) in area"
                :key="index"
                :label="item.name"
                :value="item.channelId"
              ></el-option>
            </el-select>
            <el-select v-model="formInline.valuestree" placeholder="请选择" @change="selectStree">
              <el-option
                v-for="(item,index) in stree"
                :key="index"
                :label="item.name"
                :value="item.channelId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货币单位" prop="unit">
            <el-input v-model="formInline.unit" placeholder="请输入，例如积分或福气值"></el-input>
          </el-form-item>
          <el-form-item label="兑换汇率" class="p-other" prop="fen">
            <el-input
              v-model="formInline.fen"
              placeholder="请输入"
              class="width100"
              @keyup.native="validFen"
              maxlength="4"
            ></el-input>
            <span class="t1">{{formInline.unit}}=1元</span>
          </el-form-item>
          <el-form-item label="货币精度" required>
            <!-- <el-radio v-model="formInline.radioNum" label="-1">不设置</el-radio> -->
            <el-radio
              v-model="formInline.radioNum"
              label="2"
              :disabled="formInline.isShowrAdioNum"
            >2位小数</el-radio>
            <el-radio
              v-model="formInline.radioNum"
              label="0"
              :disabled="formInline.isShowrAdioNum"
            >保留整数</el-radio>
            <el-popover placement="top-start" title="提示" width="300" trigger="hover">
              <div class="popover-content" v-html="contenthtml"></div>
              <i
                class="el-icon-question"
                style="color:#F56C6C;font-size:14px;cursor:pointer"
                slot="reference"
              >提示</i>
            </el-popover>
          </el-form-item>
          <el-form-item label="支付方式" prop="payWay" v-if="siteType" required>
            <el-select v-model="formInline.payWay" placeholder="请选择支付方式">
              <el-option label="农行信用卡支付" value="nh_xyk"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="buttonInfo">
        <el-button
          type="primary"
          @click="copySite('formInline')"
          :disabled="disabled"
          v-if="siteId!='' "
        >下一步</el-button>
        <el-button
          type="primary"
          @click="saveStandSite('formInline')"
          :disabled="disabled"
          v-else-if="copyId!='' "
        >下一步</el-button>
        <el-button type="primary" @click="submitForm('formInline')" :disabled="disabled" v-else>下一步</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import ybtSteps from '@/components/steps/ybtSteps'
export default {
  name: 'site-wrapper',
  data () {
    return {
      disabled: false,
      formInline: {
        name: '',
        summary: '',
        radio: '',
        isShowrAdioNum: this.$route.query.decimalDigits != 2 && this.$route.query.decimalDigits,
        radioNum: this.$route.query.decimalDigits != undefined ? this.$route.query.decimalDigits + '' : '2', // -1 不设置 0 保留整数 1 一位小数 2 2位小数
        valuePro: '',
        valuecity: '',
        valuearea: '',
        valuestree: '',
        unit: '',
        fen: '',
        firstDistrictName: '',
        secondDistrictName: '',
        thirdDistrictName: '',
        fourthDistrictName: '',
        // hideFlag: false,
        // ishideFlag: false
        payWay: 'nh_xyk'
      },
      rules: {
        name: [
          { required: true, message: '请输入商城名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入货币单位', trigger: 'blur' }
        ],
        fen: [
          { required: true, message: '请输入兑换汇率', trigger: 'blur' }
        ],
        radio: [
          { required: true, message: '请选择登陆方式', trigger: 'blur' }
        ],
        payWay: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
        // payWay: [
        //   { required: true, message: '请选择支付方式', trigger: 'blur'}
        // ]
      },
      address: [],
      city: [],
      area: [],
      stree: [],
      type: 1,
      channelId: '',
      contenthtml: '1、商城创建成功后，汇率不可修改<br>2、汇率必须为整数<br>3、货币精度：向上取整，例如12.10元则显示为13元',
      // hideFlaghtml: '勾选后不可修改，并在商城首页编辑、商品专题；我的商品库、礼包挑选商品页、我的订单、财务明细等页面内隐藏供应价、销售利润率等字段',
      siteId: this.$route.query.siteId || '',
      copyId: this.$route.query.copyId || '',
      orgType: '',
      stepText1: '',
      orgInfo: {},
      siteListNum: localStorage.getItem('siteListNum'),
      siteType: this.$route.query.type == 2 // 1: 积分商城 2：分期商城
    }
  },
  created () {
    this.getOrgVipDetail()
  },
  mounted () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.orgType = userInfo.sysOrganization.type
    this.stepText1 = this.orgType === 2 ? '' : '选择商城模板'
    // this.gethideFlag()
    this.getaddress()
  },
  watch: {
    'formInline.radio' (value) {
      let str = ''
      if (value == 1) {
        str = '选取该登录方式后，可切换到【手机+验证码】，将不可切换到【账号+密码】'
      }
      if (value == 2) {
        str = '选取该登录方式后，可切换到【手机+密码】，将没法切换到【账号+密码】'
      }
      if (value == 3) {
        str = '选取该登录方式后，将不可再切换到【手机+验证码】【手机+密码】'
      }
      if (value) {
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { }).catch(() => {
          this.formInline.radio = ''
        })
      }
    }
  },
  methods: {
    getOrgVipDetail () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/orgVipDetail'),
        method: 'post',
        params: this.$http.adornParams({
          orgId: localStorage.getItem('orgId')
        })
      }).then(({ data }) => {
        console.log(data)
        if (data.code === 0) {
          this.orgInfo = data.result
        }
      })
    },
    validFen () {
      this.formInline.fen = this.formInline.fen.replace(/[^\.\d]/g, '')
      this.formInline.fen = this.formInline.fen.replace('.', '')
    },
    selectPro (event) {
      this.type = 2
      this.channelId = event
      for (let index = 0; index < this.address.length; index++) {
        if (event === this.address[index].channelId) {
          this.formInline.firstDistrictName = this.address[index].name
        }
      }
      this.getaddress()
    },
    selectCity (event) {
      this.type = 3
      this.channelId = event
      for (let index = 0; index < this.city.length; index++) {
        if (event === this.city[index].channelId) {
          this.formInline.secondDistrictName = this.city[index].name
        }
      }
      this.getaddress()
    },
    selectArea (event) {
      this.type = 4
      this.channelId = event
      for (let index = 0; index < this.area.length; index++) {
        if (event === this.area[index].channelId) {
          this.formInline.thirdDistrictName = this.area[index].name
        }
      }
      this.getaddress()
    },
    selectStree (event) {
      for (let index = 0; index < this.stree.length; index++) {
        if (event === this.stree[index].channelId) {
          this.formInline.fourthDistrictName = this.stree[index].name
        }
      }
    },
    getaddress () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/district/district/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            source: 1,
            type: this.type,
            channelId: this.channelId
          }
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (this.type === 1) {
            this.address = data.districtList
            this.formInline.valuecity = ''
            this.formInline.valuearea = ''
            this.formInline.valuestree = ''
            this.city = []
            this.area = []
            this.stree = []
          }
          if (this.type === 2) {
            this.city = data.districtList
            this.formInline.valuecity = ''
            this.formInline.valuearea = ''
            this.formInline.valuestree = ''
            this.area = []
            this.stree = []
          }
          if (this.type === 3) {
            this.area = data.districtList
            this.formInline.valuearea = ''
            this.formInline.valuestree = ''
            this.stree = []
          }
          if (this.type === 4) {
            this.stree = data.districtList
          }
          console.log(this.formInline.valuecity, this.formInline.valuearea, this.formInline.valuestree)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formInline.valuePro === '' || this.formInline.valuearea === '' || this.formInline.valuecity === '') {
            this.$message.error('请填写完整的默认地址')
            return false
          }
          if (this.formInline.fen > 1000) {
            this.$message.error('兑换汇率不得超过1000')
            return false
          }
          if (this.formInline.radioNum === '') {
            return this.$message.error('请选择货币精度')
          }
          this.disabled = true
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/mall/mallsite/save'),
            method: 'post',
            data: {
              mallSite: {
                'cashRate': this.formInline.fen,
                'cashUnit': this.formInline.unit,
                'loginWay': this.formInline.radio,
                'siteName': this.formInline.name,
                'mallInstruction': this.formInline.summary,
                'templateConfigStatus': 2,
                'decimalDigits': this.formInline.radioNum,
                'paywayConf': this.siteType ? 'nh_xyk' : 'ye',
                'siteType': this.siteType ? 2 : 1
                // 'hideFlag': this.formInline.hideFlag === true ? '1' : '0'
              },
              mallSiteDistrict: {
                'firstDistrictId': this.formInline.valuePro,
                'fourthDistrictId': this.formInline.valuestree,
                'secondDistrictId': this.formInline.valuecity,
                'thirdDistrictId': this.formInline.valuearea,
                'firstDistrictName': this.formInline.firstDistrictName,
                'secondDistrictName': this.formInline.secondDistrictName,
                'thirdDistrictName': this.formInline.thirdDistrictName,
                'fourthDistrictName': this.formInline.fourthDistrictName
              }
            }
          }).then(({ data }) => {
            console.log(data)
            this.disabled = false
            if (data.code === 0) {
              sessionStorage.setItem('pageSiteId', data.siteId)
              localStorage.setItem('pageSiteId', data.siteId)
              // this.homepagemodeSave(data.siteId)
              localStorage.setItem('siteName', this.formInline.name)
              this.$router.push({ path: '/yycenter-sohpp' })
              localStorage.setItem('siteType', 1)
              window.open(location.origin + '/frontend-vis/#/index', '_blank')
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 录入新增模板
    homepagemodeSave (siteId) {
      var bigjson = {
        'areaList': [1908161, 1908162, 19081612, 1908164, 19081614, 1908169, 1908165, 1908166, 19081617, 1908168, 1908167, 19081619, 19081618, 19081611, 19081616],
        'modeList': {
          'search': {
            'imgs': [
              {
                'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190923/d3b52f470f4841dda032e1cd2d8feb96.png',
                'url': { 'url': '', 'type': '' }
              }
            ],
            'note': '请输入商品名称或商品编码',
            'area': 'search',
            'isOn': 1,
            'sort_id': '1908161',
            'custom': ''
          },
          'banner': {            'imgs': [{
              'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/77e45321c4e243a68dddeec460186a2f.png',
              'url': { 'url': '', 'type': '', 'lastSelect': 0 }            }],
            'note': '',
            'area': 'banner',
            'sort_id': '1908162',
            'isOn': 1,
            'custom': ''
          },
          'tips': {            'img': [

            ],
            'note': '铁路局员工福利商城开业大酬宾，全场五折起！全场五折起！',
            'area': 'tips',
            'isOn': 1,
            'sort_id': '19081612',
            'custom': ''          },
          'icon': {            'imgs': [
              {                'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/df9616900c214574b7291b06d92bbb54.png',
                'text': '热卖爆款',
                'url': { 'url': '', 'type': '', 'lastSelect': 0 }              },
              {                'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/4fdeb34cf28a4b0fb93ff158693173fe.png',
                'text': '办公用品',
                'url': { 'url': '', 'type': '', 'lastSelect': 0 }              }, {                'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/d1b41da732c64238a4f42425a9b521ec.png',
                'text': '家居厨具',
                'url': { 'url': '', 'type': '', 'lastSelect': 0 }              }, {                'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/31e3a40f90b64f37a116f13f0747ef6d.png',
                'text': '礼品箱包',
                'url': { 'url': '', 'type': '', 'lastSelect': 0 }              }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/a0570bc6990940a892fde49e8742d975.png', 'text': '汽车用品', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/7d7dd16ab7484530bf46efff29ae80ed.png', 'text': '粮油干调', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/d1e439d8e0304837926115c966e4bf26.png', 'text': '方便速食', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/dc9f6bfbc4c44e60b973ca4133c74a99.png', 'text': '酒水乳饮', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/767d3f8c4926498dadeb03f475fc7438.png', 'text': '休闲零食', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/b7f7e14618c84873880434a2d8ba0d12.png', 'text': '日用百货', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }],
            'note': '',
            'area': 'icon',
            'isOn': 1,
            'sort_id': '1908164',
            'custom': ''          },
          'navigation': {            'imgs': [
              { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/6e92b1800f7048e39540d5129282a4c0.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/26c2833e8caf41b0a1d04e84d4a5d865.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }],
            'note': '',
            'area': 'navigation',
            'sort_id': '1908165',
            'isOn': 1,
            'custom': ''          },
          'topic1': {            'imgs': [
              { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/f25477f5f32647569b175f0d563f0d08.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/6389142d010646a7b227f93e0d6070e4.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/b7d3453e10f9407a9fd63378b5b62adb.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/f346c1cce8194df7a72783840b1068c2.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/f0e00d8c27d14ae0816bc6236df8538d.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }],
            'note': '',
            'area': 'topic1',
            'sort_id': '1908166',
            'isOn': 1,
            'custom': ''          },
          'topic2': {            'imgs': [
              { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/6c8de9a53c2b42ab8990968cc72c5dc5.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/ef5af9f4e8d14631ae53a8f7ba4bf872.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/fec35d7359d14cb8919de77f8068402b.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }],
            'note': '',
            'area': 'topic2',
            'sort_id': '1908167',
            'isOn': 1,
            'custom': ''          },
          'hotTitle': {            'imgs': [
              { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/99fccbc775154827837c9c010b80ebfc.png', 'text': '', 'url': { 'url': '', 'type': '0' } }],
            'note': '',
            'area': 'hottitle',
            'sort_id': '1908168',
            'isOn': 1,
            'custom': ''          },
          'crushTitle': {            'imgs': [
              { 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/59b4692c91904504a28f710dda45c098.png', 'text': '', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }],
            'note': '',
            'area': 'crushTitle',
            'isOn': 1,
            'sort_id': '19081614',
            'custom': ''          },
          'product': {            'imgs': [
              { 'product_id': '1', 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/58a848fbd607474e8734349bbec3150a.png', 'name': '小米Air3新款笔记本电脑', 'mprice': '169', 'tag_url': '￥4888', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'product_id': '2', 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/7273012969894c1ebbcb8dfefa42ae1a.png', 'name': '小米Air3新款笔记本电脑', 'mprice': '169', 'tag_url': '￥4888', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }, { 'product_id': '3', 'src': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20190829/e4f160001ac84eb784f2fbdeba897d56.png', 'name': '小米Air3新款笔记本电脑', 'mprice': '169', 'tag_url': '￥4888', 'url': { 'url': '', 'type': '', 'lastSelect': 0 } }],
            'note': ' ',
            'title': '热销产品',
            'select': [],
            'area': 'product',
            'ismarket': 0,
            'isOn': 1,
            'hideTitle': 0,
            'sort_id': '1908169',
            'custom': ''          },
          'special': {
            'imgs': [],
            'note': ' ',
            'title': '热销产品',
            'select': [],
            'area': 'special',
            'ismarket': 0,
            'isOn': 1,
            'hideTitle': 0,
            'sort_id': '19081611',
            'custom': ''          },
          'commoditytopics': {
            'area': 'commoditytopics',
            'custom': '',
            'imgs': [],
            'isCopy': true,
            'isOn': 1,
            'isShowBox': true,
            'items': '',
            'note': '',
            'sort_id': '19081617',
            'templateName': 'home-commodity-topics-template',
            'title': '每日上新',
            'topicradio1': '1'
          },
          'specialTopic': {
            'area': 'specialTopic',
            'custom': '',
            'imgs': [],
            'isCopy': true,
            'isOn': 1,
            'isShowBox': true,
            'items': '',
            'note': '',
            'sort_id': '19081618',
            'templateName': 'home-special-topic-template',
            'title': '展示专题',
            'topicradio1': '1'
          },
          'seckillZone': {
            'templateName': 'home-product-list-seckill-zone',
            'imgs': [],
            'isCopy': true,
            'isShowBox': true,
            'note': ' ',
            'title': '营销专区',
            'select': [],
            'area': 'seckillZone',
            'ismarket': 0,
            'isOn': 1,
            'hideTitle': 0,
            'sort_id': '19081619',
            'topicradio1': '1',
            'titleSrc': 'http://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20200609/fc32656ad531413db62beaa0f2c966dc.png',
            'custom': ''          },
          'vedioPro': { 'imgs': [{ 'product_id': '1', 'src': '', 'type': '1', 'url': { 'url': '', 'type': '1' } }], 'area': 'vedioPro', 'isOn': 1, 'sort_id': '19081616', 'custom': '' }        }      }
      console.log(bigjson)
      const homePageList = Object.keys(bigjson.modeList).map(key => ({
        key,
        value: bigjson.modeList[key]
      }))
      var homePageMode = []
      for (let index = 0; index < homePageList.length; index++) {
        const item = homePageList[index]
        homePageMode.push({
          modeName: item.key,
          modeNo: item.value.sort_id,
          sort_id: item.value.sort_id,
          siteId: siteId,
          type: 0,
          productFlag: item.key === 'special' ? 1 : 0,
          value: JSON.stringify(item.value)
        })
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/homepagemode/save'),
        method: 'post',
        data:
        {
          type: 0,
          homePageModes: homePageMode,
          areaList: '1908161,1908162,19081612,1908164,19081614,1908169,1908165,1908166,19081617,1908168,1908167,19081619,19081618,19081611,19081616'
        }
      }).then(({ data }) => {
        console.log(data)
        this.disabled = false
        if (data.code === 0) {
          // this.$router.push({ path: '/yycenter-sohpp' })
          // window.open(location.origin + '/frontend-vis/#/index', '_blank')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 复制商城
    copySite (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formInline.valuePro === '' || this.formInline.valuearea === '' || this.formInline.valuecity === '') {
            this.$message.error('请填写完整的默认地址')
            return false
          }
          if (this.formInline.fen > 1000) {
            this.$message.error('兑换汇率不得超过1000')
            return false
          }
          if (this.formInline.radioNum === '') {
            return this.$message.error('请选择货币精度')
          }
          this.disabled = true
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/mall/mallsite/copyMall'),
            method: 'post',
            data: {
              mallSite: {
                'id': this.siteId,
                'siteName': this.formInline.name,
                'mallInstruction': this.formInline.summary,
                'cashRate': this.formInline.fen,
                'cashUnit': this.formInline.unit,
                'loginWay': this.formInline.radio,
                'summary': this.formInline.summary,
                'templateConfigStatus': 2,
                'paywayConf': 'ye',
                'decimalDigits': this.formInline.radioNum
                // 'hideFlag': this.formInline.hideFlag === true ? '1' : '0'
              },
              mallSiteDistrict: {
                'firstDistrictId': this.formInline.valuePro,
                'fourthDistrictId': this.formInline.valuestree,
                'secondDistrictId': this.formInline.valuecity,
                'thirdDistrictId': this.formInline.valuearea,
                'firstDistrictName': this.formInline.firstDistrictName,
                'secondDistrictName': this.formInline.secondDistrictName,
                'thirdDistrictName': this.formInline.thirdDistrictName,
                'fourthDistrictName': this.formInline.fourthDistrictName
              }
            }
          }).then(({ data }) => {
            this.disabled = false
            if (data.code === 0) {
              // this.$message.success('预计耗时1分钟，请耐心等待哦~')
              localStorage.setItem('siteName', this.formInline.name)
              this.$router.push({ path: '/yycenter-sohpp' })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 复制标准商城
    saveStandSite (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formInline.valuePro === '' || this.formInline.valuearea === '' || this.formInline.valuecity === '') {
            this.$message.error('请填写完整的默认地址')
            return false
          }
          if (this.formInline.fen > 1000) {
            this.$message.error('兑换汇率不得超过1000')
            return false
          }
          if (this.formInline.radio === '') {
            return this.$message.error('请选择登陆方式')
          }
          if (this.formInline.radioNum === '') {
            return this.$message.error('请选择货币精度')
          }
          this.disabled = true
          console.log(this.siteType)
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/mall/mallsite/saveStandardMall'),
            method: 'post',
            data: {
              mallSite: {
                'id': this.copyId,
                'siteName': this.formInline.name,
                'mallInstruction': this.formInline.summary,
                'cashRate': this.formInline.fen,
                'cashUnit': this.formInline.unit,
                'loginWay': this.formInline.radio,
                'templateConfigStatus': 2,
                'paywayConf': 'ye',
                'decimalDigits': this.formInline.radioNum,
                'siteType': this.siteType ? 2 : 1
                // 'hideFlag': this.formInline.hideFlag === true ? '1' : '0'
              },
              mallSiteDistrict: {
                'firstDistrictId': this.formInline.valuePro,
                'fourthDistrictId': this.formInline.valuestree,
                'secondDistrictId': this.formInline.valuecity,
                'thirdDistrictId': this.formInline.valuearea,
                'firstDistrictName': this.formInline.firstDistrictName,
                'secondDistrictName': this.formInline.secondDistrictName,
                'thirdDistrictName': this.formInline.thirdDistrictName,
                'fourthDistrictName': this.formInline.fourthDistrictName
              }
            }
          }).then(({ data }) => {
            this.disabled = false
            if (data.code === 0) {
              localStorage.setItem('siteName', this.formInline.name)
              this.$router.push({ path: '/yycenter-sohpp' })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  },
  components: {
    ybtSteps
  }

}
</script>

<style lang="scss" scoped>
.tip {
  margin-bottom: 10px;
  padding: 6px;
  line-height: 20px;
  background-color: #fff2d9;
  border: 1px solid #ffa703;
  img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: top;
  }
}
.form-Pannel {
  .form-list {
    width: 1060px;
    padding-top: 50px;
    margin: 0 auto;
    border: 1px solid rgba(75, 121, 175, 0.4);
    // height: 400px;
    margin-top: 64px;
    border-radius: 3px;
    transition: 0.2s ease-in-out;
    /deep/ .el-form {
      width: 600px;
      margin: 0 auto;

      .el-form-item {
        width: 600px;
        .el-input__inner {
          width: 400px;
        }
        .width100 {
          .el-input__inner {
            width: 100px;
          }
        }
        .el-input {
          width: auto;
        }
        &.selectStyle {
          .el-input__inner {
            width: 120px;
          }
        }
      }
    }
    .t1 {
      display: inline-block;
      background-color: #fff;
      border: 1px solid #e5e6e7;
      border-radius: 1px;
      color: inherit;
      font-size: 14px;
      font-weight: 400;
      line-height: 1;
      padding: 10px 12px;
      text-align: center;
    }
  }
  .buttonInfo {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
