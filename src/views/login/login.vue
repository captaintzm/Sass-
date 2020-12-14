<template>
  <div class="site-wrapper" :class="{'siteNobg':type!=''}">
    <div class="login clearfix" v-show="type==''">
      <div class="loginInfo">
        <!-- <div class="loginl"></div> -->
        <div class="loginr">
          <h1></h1>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
            v-show="this.showLogin!=true && this.showPassword!=true "
          >
            <el-form-item prop="userName">
              账号
              <el-input v-model="dataForm.userName"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              密&nbsp;&nbsp;码
              <el-input v-model="dataForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="dataForm.checked">记住密码</el-checkbox>
              <el-button type="text" @click="forgetPwd()" style="float:right">忘记密码</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          <!-- 校验登录 -->
          <div
            class="showlogin animated bounceInRight"
            :closeOnClickModal="false"
            v-show="showLogin"
          >
            <el-form :model="showLoginForm" :rules="rulesLogin" ref="ruleForm" class="logocontent">
              <el-form-item label label-width="1px" prop="phone">
                手机号
                <br />
                <el-input v-model="showLoginForm.phone" style="width:270px" placeholder></el-input>
              </el-form-item>
              <el-form-item label label-width="1px" prop="code">
                验证码
                <br />
                <el-input
                  v-model="showLoginForm.code"
                  style="width:128px"
                  placeholder
                  maxlength="4"
                ></el-input>
                <el-button type="primary" v-if="!disabled" @click="sendCode" class="codestyle">获取验证码</el-button>
                <el-button
                  type="primary"
                  v-if="disabled"
                  :disabled="true"
                  class="codestyle codestyle1"
                >{{ count }}s后重新发送</el-button>
              </el-form-item>
              <el-form-item label label-width="1px" style="text-align:center">
                <el-button class="login-btn-submit-1" type="primary" @click="handleRecharge">校验</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 忘记密码 -->
          <div
            class="showlogin animated bounceInRight"
            :closeOnClickModal="false"
            v-show="showPassword"
          >
            <el-form
              :model="showForgetForm"
              :rules="rulesForget"
              ref="rulesForget"
              class="logocontent"
            >
              <el-form-item prop="userName" class="mb20">
                <el-input v-model="showForgetForm.userName" placeholder="请填写账号"></el-input>
              </el-form-item>
              <el-form-item label label-width="1px" prop="phone" class="mb20">
                <el-input v-model="showForgetForm.phone" style="width:270px" placeholder="请填写手机号"></el-input>
              </el-form-item>
              <el-form-item label label-width="1px" prop="code" class="mb20">
                <el-input
                  v-model="showForgetForm.code"
                  style="width:128px"
                  placeholder="请填写验证码"
                  maxlength="4"
                ></el-input>
                <el-button
                  type="primary"
                  v-if="!disabled"
                  @click="forgetsendCode"
                  class="codestyle"
                >获取验证码</el-button>
                <el-button
                  type="primary"
                  v-if="disabled"
                  :disabled="true"
                  class="codestyle codestyle1"
                >{{ count }}s后重新发送</el-button>
              </el-form-item>
              <el-form-item prop="password" class="mb20">
                <el-input
                  v-model="showForgetForm.password"
                  type="password"
                  placeholder="请输入字母加数字共6位的密码"
                  maxlength="6"
                ></el-input>
              </el-form-item>
              <el-form-item label label-width="1px" style="text-align:center">
                <el-button class="login-btn-submit-1" type="primary" @click="handleForget">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <vue-particles
      v-show="type==''"
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
  </div>
</template>

<script>
import { treeDataTranslate, clearLoginInfo } from '@/utils'
import { isMobile } from '@/utils/validate'
export default {
  data () {
    var testpassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!isMobile(value)) {
        value = ''
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (!testpassword.test(value)) {
        callback(new Error('密码必须包含字母加数字，且处于6-20位之间'))
      } else {
        callback()
      }
    }
    return {
      showForgetForm: {
        userName: '',
        phone: '',
        code: '',
        password: ''
      },
      rulesForget: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validateComfirmPassword, trigger: 'blur' }
        ]
      },
      showPassword: false,
      count: 60,
      disabled: false,
      showLoginForm: {
        phone: '',
        code: ''
      },
      dataForm: {
        userName: '',
        password: '',
        uuid: this.$route.query.uuid || '',
        captcha: '',
        checked: false
      },
      rulesLogin: {
        phone: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      dataRule: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '只能输入字母加数字共6位的密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      captchaPath: '',
      type: this.$route.query.type || '',
      showLogin: false
    }
  },
  created () {
    this.dataForm.userName = this.$route.query.username || ''
    this.dataForm.password = this.$route.query.pwd || ''
    this.siteId = ''
    this.token = ''
    // this.getCaptcha();
    clearLoginInfo()
    if (this.type === 'autoLogin') {
      this.$nextTick(() => {
        this.dataFormSubmit()
      })
    }
  },
  watch: {
    disabled (n, o) {
      n && this.countDown()
    }
  },
  destroyed () {
    this.timer && clearInterval(this.timer)
  },
  methods: {

    forgetPwd () {
      this.showPassword = true
    },
    countDown () {
      this.timer = setInterval(() => {
        this.count--
        if (this.count === 0) {
          this.count = 60
          this.disabled = !this.disabled
          clearInterval(this.timer)
        }
      }, 1000)
    },
    forgetsendCode () {
      for (let k in this.showForgetForm) {
        if (k === 'code' || k === 'password') continue
        if (!this.showForgetForm[k]) {
          return this.$message.error('账号或者手机号不能为空')
        }
        if (k === 'phone' && !isMobile(this.showForgetForm[k])) {
          return this.$message.error('手机号格式错误')
        }
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sendCode'),
        method: 'post',
        params: this.$http.adornParams({
          mobile: this.showForgetForm.phone,
          username: this.showForgetForm.userName
        })
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success(data.msg)
          this.disabled = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    sendCode () {
      for (let k in this.showLoginForm) {
        if (k === 'code') continue
        if (!this.showLoginForm[k]) {
          return this.$message.error('手机号不能为空')
        }
      }
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sendLoginCode'),
        method: 'post',
        params: this.$http.adornParams({
          mobile: this.showLoginForm.phone,
          username: this.dataForm.userName,
          siteId: this.siteId
        })
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success(data.msg)
          this.disabled = true
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    handleClose () {
      this.rechargeShow = false
    },
    handleRecharge () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/sys/verify'),
            method: 'post',
            params: this.$http.adornParams({
              mobile: this.showLoginForm.phone,
              smsCode: this.showLoginForm.code
            })
          }).then(({ data }) => {
            if (data.code === 0) {
              this.getToken()
              if (this.siteId === -1) {
                this.getNav()
              } else {
                this.getSiteNav()
                localStorage.setItem('noOrgtype', 1)
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    handleForget () {
      this.$refs['rulesForget'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/sys/forgetPwd'),
            method: 'post',
            params: this.$http.adornParams({
              username: this.showForgetForm.userName,
              password: this.showForgetForm.password,
              mobile: this.showForgetForm.phone,
              smsCode: this.showForgetForm.code
            })
          }).then(({ data }) => {
            if (data.code === 0) {
              this.$message.success('修改成功')
              clearTimeout(this.timer)
              this.timer = setTimeout(() => {
                location.reload()
              }, 3000)
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    getToken () {
      this.$cookie.set('token', this.token)
      sessionStorage.setItem('token', this.token)
      localStorage.setItem('token', this.token)
    },
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/sys/login'),
            method: 'post',
            data: this.$http.adornData({
              username: this.dataForm.userName,
              password: this.dataForm.password,
              uuid: this.dataForm.uuid,
              captcha: this.dataForm.captcha
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.siteId = data.siteId
              this.token = data.token
              localStorage.setItem('orgVip', JSON.stringify(data.orgVip))
              localStorage.setItem('pageSiteId', data.siteId)
              localStorage.setItem('scSiteId', data.siteId)
              localStorage.setItem('orgId', data.orgId)
              localStorage.setItem('roleType', data.roleType)
              localStorage.setItem('orgType', data.orgType)
              sessionStorage.setItem('pageSiteId', data.siteId)
              if (Number(data.isLoginVerify) === 1) {
                this.showLogin = true
              } else {
                this.getToken()
                if (data.siteId === -1) {
                  this.getNav()
                } else {
                  this.getSiteNav()
                  // 没有机构平台
                  localStorage.setItem('noOrgtype', 1)
                }
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    getNav () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/menu/nav'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var menuList = data.menuList[0].url
          if (menuList !== '') {
            localStorage.setItem('menuListFirstUrl', menuList)
            this.$router.push({ path: menuList })
          } else {
            var menuListnav = data.menuList[0].list[0].url
            localStorage.setItem('menuListFirstUrl', menuListnav)
            this.$router.push({ path: menuListnav })
          }
          var menulists = []
          for (let index = 0; index < data.menuList.length; index++) {
            const element = data.menuList[index]
            if (element.url) {
              menulists.push(element.url)
            } else {
              for (let j = 0; j < element.list.length; j++) {
                const jj = element.list[j]
                menulists.push(jj.url)
              }
            }
          }
          localStorage.setItem('menulistsurl', JSON.stringify(menulists))
        }
      })
    },
    getSiteNav () {
      this.sitenavlist = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/menu/siteMenuList'),
        method: 'get',
        params: this.$http.adornParams({
          siteId: localStorage.getItem('scSiteId')
        })
      }).then(({ data }) => {
        if (data && data.length > 0) {
          this.sitenavlist = treeDataTranslate(data, 'menuId')
          localStorage.setItem('siteType', 1)
          window.location.href = '/frontend-vis/#' + this.sitenavlist[0].children[0].url
        }
      })
    }
    // 获取验证码
    // getCaptcha() {
    //   this.dataForm.uuid = getUUID();
    //   this.captchaPath = this.$http.adornUrl(
    //     `/captcha.jpg?uuid=${this.dataForm.uuid}`
    //   );
    // }
  },

  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.login {
  .loginInfo {
    height: 440px;
    margin: 0 auto;
    font-size: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(50%, -50%);
    z-index: 99;
    .loginr {
      background: #ffffff;
      height: 440px;
      overflow: hidden;
      display: inline-block;
      width: 410px;
      padding: 0 70px;
      h1 {
        width: 201px;
        height: 28px;
        margin: 0 auto;
        margin-top: 30px;
        background: url(./img/logo.png) no-repeat center top;
        background-size: cover;
        margin-bottom: 27px;
      }
      /deep/ .el-form-item {
        margin-bottom: 14px;
        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #3e98f6;
          border-color: #3e98f6;
        }
        input:focus {
          border-color: #3e98f6;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #3e98f6;
        }
        .el-button--primary {
          margin-top: 10px;
          width: 270px;
          height: 36px;
          border-radius: 4px;
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          display: inline-block;
          font-weight: normal;
        }
        .el-checkbox__input.is-focus .el-checkbox__inner {
          border-color: #3e98f6;
        }
      }
    }
  }
  #container {
    height: 400px;
  }
}
.site-wrapper {
  background: url(./img/bg.png) no-repeat center top;
  background-size: cover;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  &.siteNobg {
    background: none;
  }
}

.login-captcha {
  img {
    width: 100%;
    height: 100%;
  }
}
.showlogin {
  // background: #ffffff;
  // height: 440px;
  // overflow: hidden;
  // display: inline-block;
  // width: 410px;
  // padding: 0 70px;
  .login-btn-submit-1 {
    margin-top: 20px !important;
    width: 270px;
    height: 36px !important;
    border-radius: 4px !important;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    display: inline-block;
    font-weight: normal;
  }
  .codestyle {
    width: 137px !important;
    height: 36px !important;
    margin-top: 0px !important;
    background: #ffffff !important;
    color: #333 !important;
    font-weight: normal !important;
    border-radius: 4px !important;
    border: 1px solid #dcdfe6 !important;
    font-size: 14px !important;
  }
  .codestyle1 {
    color: #006eff !important;
  }
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }
  to {
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }
  to {
    -webkit-transform: none;
    transform: none;
  }
}
.bounceInRight {
  -webkit-animation-name: bounceInRight;
  animation-name: bounceInRight;
}
.mb20 {
  margin-bottom: 20px !important;
}
</style>
