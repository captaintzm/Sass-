<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="userAdd"
  >
    <div class="tip" v-if="orgType === '4' && !dataForm.id">
      <div>
        <img src="./../../img/warning.png" alt />
        <span
          v-show="style === 1"
        >您目前为{{getVipType(orgInfo.vipType)}},最多可添加{{orgInfo.overdueFlag === '1' ? orgInfo.totalManagerCount : 0}}个机构管理员,剩余可添加{{orgInfo.moreManagerCount || 0}}个</span>
        <span
          v-show="style === 2 && orgInfo.vipType > 1"
        >您目前为{{getVipType(orgInfo.vipType)}}, 可创建的供应商数不限</span>
        <span
          v-show="style === 2 && orgInfo.vipType === 1"
        >您目前为{{getVipType(orgInfo.vipType)}}, 不可创建自有供应商,升级后可创建个数不限</span>
      </div>
      <span
        v-show="(orgInfo.vipType === 1 && style === 2 )|| (style === 1 && orgInfo.moreManagerCount === 0)"
        @click="$router.push('/memberRecharge')"
        style="color: #1985FF; cursor: pointer;text-decoration: underline;"
      >升级会员</span>
    </div>
    <div class="staff-head">员工信息</div>
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="110px"
      :inline="true"
      class="demo-form-inline"
    >
      <el-form-item label="角色类型">
        <el-select
          v-model="style"
          placeholder="请选择"
          class="el-selects"
          :style="{'width':'250px'}"
          @change="getRoleType"
          :disabled="Boolean(dataForm.id)"
        >
          <el-option v-for="item in option" :key="item.id" :label="item.siteName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构" v-if="style==1">
        <el-input v-model="ordernameons" :style="{width:'250px'}" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属机构" v-if="!dataForm.id && style==2 ">
        <el-input v-model="ordername" :style="{width:'250px'}" :disabled="true"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="所属机构" v-if="dataForm.id ">
        <el-input v-model="ordernameons" :style="{width:'250px'}" :disabled="true"></el-input>
      </el-form-item>-->
      <br />
      <!-- <el-form-item label="姓名" prop="ordname" v-if="style==1">
        <el-input
          placeholder="请输入内容"
          v-model="dataForm.ordname"
          :style="{width:'100px'}"
          maxlength="8"
        />
      </el-form-item>-->
      <el-form-item :label="style==1?'姓名':'供应商名称'" prop="ordname">
        <el-select
          v-model="dataForm.supplyName"
          placeholder="请选择"
          :style="{width:'100px'}"
          v-if="style==2"
          @change="getsupplyName"
          :disabled="Boolean(dataForm.id)"
        >
          <el-option label="请选择" value></el-option>
          <el-option
            :label="item.supplyName"
            :value="item.id"
            v-for="(item,index) in orgsupList"
            :key="index"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="dataForm.ordname"
          :style="{width:'100px'}"
          maxlength="8"
          :disabled="Boolean(dataForm.id)"
          v-if="supplyId==''"
        />
        <!--   slot="prepend" -->
      </el-form-item>
      <el-form-item :label="style==1?'手机号' :'联系方式'" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" :style="{width:'150px'}"></el-input>
      </el-form-item>
      <br />
      <!-- prop="roleIdList" -->
      <el-form-item label="角色" size="mini">
        <el-checkbox-group v-model="dataForm.roleIdList" @change="clickAfter" prop="roleIdList">
          <el-checkbox
            :label="role.roleId"
            v-for="role in roleList"
            :key="role.roleId"
            style="width:150px;"
          >{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <br />
      <div class="staff-head">登录信息</div>
      <el-form-item label="登录账号" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录账号" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
        v-if="!dataForm.id"
      >
        <el-input v-model="dataForm.password" type="password" placeholder="密码" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="comfirmPassword"
        :class="{ 'is-required': !dataForm.id }"
        v-if="!dataForm.id"
      >
        <el-input
          v-model="dataForm.comfirmPassword"
          type="password"
          placeholder="确认密码"
          maxlength="20"
        ></el-input>
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio label="1">禁用</el-radio>
          <el-radio label="0">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisable">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
export default {
  props: {
    idser: {
      type: String
    },
    ordername: {
      type: String,
      default: ''
    },
    orderorgId: {
      type: String
    }
  },
  data () {
    var testpassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else if (!testpassword.test(value)) {
        callback(new Error('密码必须包含字母加数字，且处于6-20位之间'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (!testpassword.test(value)) {
        callback(new Error('密码必须包含字母加数字，且处于6-20位之间'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('手机号不能为空'))
      } else if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      option: [
        {
          siteName: '公司员工',
          id: 1
        },
        {
          siteName: '线上供应商',
          id: 2
        }
      ],
      orgsupList: [],
      ordernameons: this.ordername,
      style: 1,
      visible: false,
      isDisable: false,
      roleList: [],
      dataForm: {
        id: 0,
        name: '',
        userName: '',
        password: '',
        comfirmPassword: '',
        salt: '',
        organizationIds: '',
        mobile: '',
        roleIdList: [],
        status: '0',
        ordname: '',
        supplyName: ''
      },
      supplyId: '',
      dataRule: {
        ordname: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      orgInfo: {},
      vipName: '',
      orgType: localStorage.getItem('orgType')
    }
  },
  watch: {
    visible () {
      if (this.visible == false) {
        this.dataForm.ordname = ''
        this.dataForm.userName = ''
        this.dataForm.salt = ''
        this.dataForm.organizationIds = ''
        this.dataForm.roleIdList = []
        this.dataForm.status = '0'
        this.dataForm.mobile = ''
        this.dataForm.password = ''
        this.ordernameons = ''
        this.ordername = ''
        this.style = 1
        this.supplyId = ''
        this.$refs['dataForm'].resetFields()
      }
    },
    style (n, o) {
      console.log(n)
    }
  },
  created () {
  },
  methods: {
    inint (item) {
      console.log('-----------')
      if (item === undefined) {
        var userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.dataForm.organizationIds = userInfo.sysOrganization.id
        this.ordernameons = userInfo.sysOrganization.name
      }
    },
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
    getsupplyName (val) {
      console.log(val)
      this.supplyId = val
      if (val !== '') {
        this.dataForm.ordname = this.orgsupList.filter(item => item.id === val)[0].supplyName
      } else {

      }
    },
    // /ybt-backend/sys/orgsuppler/list
    orgsupplerlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/orgsuppler/list'),
        method: 'POST',
        data: this.$http.adornData({
          orgId: this.orderorgId
        }, true)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.orgsupList = data.list
        }
      })
    },
    getRoleType (id) {
      this.style = id
      this.roleList = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/role/select'),
        method: 'get',
        params: this.$http.adornParams({
          roleType: this.style,
          orgId: this.orderorgId
        })
      }).then(({ data }) => {
        this.roleList = data && data.code === 0 ? data.list : []
      })
    },
    clickAfter (item) {
      console.log(item)
    },
    init (id, style) {
      this.dataForm.id = id || 0
      this.style = style || 1
      this.roleList = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/role/select'),
        method: 'get',
        params: this.$http.adornParams({
          roleType: this.style,
          orgId: this.orderorgId
        })
      }).then(({ data }) => {
        this.roleList = data && data.code === 0 ? data.list : []
        if (this.dataForm.id) {
          this.getroleselect()
        }
        this.orgsupplerlist()
      })
    },
    getroleselect () {
      this.$http({
        url: this.$http.adornUrl(`/ybt-backend/sys/user/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.userName = data.user.username
          this.dataForm.salt = data.user.salt
          this.dataForm.organizationIds = data.user.organizationIds
          this.dataForm.mobile = data.user.mobile
          if (data.user.roleIdList != null) {
            this.dataForm.roleIdList = data.user.roleIdList
          } else {
            this.dataForm.roleIdList = []
          }
          this.dataForm.status = data.user.locked
          this.ordernameons = data.user.orgName
          this.ordername = data.user.orgName
          this.style = data.user.roleType == null ? 1 : data.user.roleType
          this.dataForm.ordname = this.style === 1 ? data.user.name : data.user.supplyName
          this.dataForm.supplyName = this.style === 1 ? data.user.name : data.user.supplyName
          this.supplyId = this.style === 1 ? '' : data.user.supplyId
          // this.orderorgId = data.user.organizationIds
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisable = true
          this.$http({
            url: this.$http.adornUrl(`/ybt-backend/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'userId': this.dataForm.id || undefined,
              'username': this.dataForm.userName,
              'password': this.dataForm.password,
              'salt': this.dataForm.salt,
              'organizationIds': this.idser || this.dataForm.organizationIds,
              'mobile': this.dataForm.mobile,
              'locked': this.dataForm.status,
              'roleIdList': this.dataForm.roleIdList,
              'name': this.style === 1 ? this.dataForm.ordname : this.dataForm.ordname,
              'supplyName': this.style === 2 ? this.dataForm.ordname : '',
              'supplyId': this.style === 2 ? this.supplyId : ''
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
            this.isDisable = false
          })
        }
      })
    },
    getVipType (val) {
      let text = ''
      switch (val) {
        case 1:
          text = '基础会员'
          break
        case 2:
          text = 'VIP会员'
          break
        case 3:
          text = 'PLUS会员'
          break
      }
      return text
    }
  }
}
</script>

<style lang="scss">
.staff-head {
  border-left: 4px solid #1985ff;
  font-size: 16px;
  padding-left: 10px;
  color: #3c3c3c;
  position: relative;
  height: 16px;
  line-height: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}
.tip {
  display: flex;
  justify-content: space-between;
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
.userAdd /deep/ .el-dialog__body {
  padding-top: 0;
}
</style>
