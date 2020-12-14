<template>
  <div class="siteWrapper">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="开票信息设置" name="first">
        <el-form ref="form1" label-width="120px" style="margin-top:20px" :model="form">
          <el-button size="small" @click="addTab(activeNamesecond)" class="btn01">
            新增开票信息
            <i class="el-icon-plus"></i>
          </el-button>
          <el-tabs
            v-model="activeNamesecond"
            closable
            @tab-remove="removeTab"
            @tab-click="handleClick1"
          >
            <el-tab-pane
              :key="index"
              v-for="(item,index) in form.activeNameList"
              :label="'发票信息'+(index+1)"
              :name="item.name"
            >
              <el-checkbox v-model="item.setDefault" @change="setDefault(item)">设置默认开票信息</el-checkbox>
              <h2 style="margin-bottom:20px;margin-top:20px;">发票基本信息</h2>
              <el-form-item
                label="发票抬头"
                :rules="rulesForm.invoicesHead"
                :prop="'activeNameList.'+index+'.invoicesHead'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.invoicesHead"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="税务登记证号"
                :rules="rulesForm.taxNo"
                :prop="'activeNameList.'+index+'.taxNo'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.taxNo"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="注册场所地址"
                :rules="rulesForm.registerAddress"
                :prop="'activeNameList.'+index+'.registerAddress'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.registerAddress"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="发票类型" required>
                <el-col :span="10">
                  <el-radio v-model="item.invoiceType" label="1">增值税专用发票</el-radio>
                  <el-radio v-model="item.invoiceType" label="2">增值税普通发票</el-radio>
                </el-col>
              </el-form-item>
              <el-form-item
                label="开户银行"
                :rules="rulesForm.depositBank"
                :prop="'activeNameList.'+index+'.depositBank'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.depositBank"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="银行账户"
                :rules="rulesForm.bankAccount"
                :prop="'activeNameList.'+index+'.bankAccount'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.bankAccount"></el-input>
                </el-col>
              </el-form-item>
              <h2 style="margin-bottom:20px;">
                发票收货地址
                <span style="font-size:14px;color:#999999;padding-left:10px">(发票开好后将会按照此地址寄回)</span>
              </h2>
              <el-form-item
                label="收货人"
                style="margin-bottom:15px;"
                :rules="rulesForm.contactor"
                :prop="'activeNameList.'+index+'.contactor'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.contactor"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item
                label="收货人电话"
                style="margin-bottom:15px;"
                :rules="rulesForm.phone"
                :prop="'activeNameList.'+index+'.phone'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.phone"></el-input>
                </el-col>
              </el-form-item>
              <!-- <el-form-item label="省市区"   :rules="rulesForm.address" :prop="'activeNameList.'+index+'.address'">
                <AddressList :ref="'addressList'+index" @mallSiteDistrict="mallSiteListDistrict" />
              </el-form-item>-->
              <el-form-item
                label="详细地址"
                prop="addressDetail"
                :rules="rulesForm.addressDetail"
                :prop="'activeNameList.'+index+'.addressDetail'"
              >
                <el-col :span="10">
                  <el-input size="medium" v-model.trim="item.addressDetail" type="textarea"></el-input>
                </el-col>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-form-item>
            <el-button size="small" @click="dialogTable=false">取消</el-button>
            <el-button type="primary" size="small" @click="saveInvoicesInfo" :disabled="disabled">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="提现信息设置" name="second">
        <el-form
          ref="form"
          label-width="100px"
          size="medium"
          style="margin-top:20px"
          :model="formInline"
        >
          <h2 style="margin-bottom:20px;">收款基本信息</h2>
          <div v-for="(item,index) in formInline.basicInfoList" :key="index">
            <el-form-item
              label="开户银行"
              label-width="80px"
              class="formItem"
              :rules="rules.bankName"
              :prop="'basicInfoList.'+index+'.bankName'"
            >
              <el-input size="medium" v-model.trim="item.bankName" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item
              label="账号"
              label-width="80px"
              class="formItem"
              :rules="rules.bankAccount"
              :prop="'basicInfoList.'+index+'.bankAccount'"
            >
              <el-input size="medium" v-model.trim="item.bankAccount" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item
              label="开户名"
              label-width="80px"
              class="formItem"
              :rules="rules.bankAccountName"
              :prop="'basicInfoList.'+index+'.bankAccountName'"
            >
              <el-input size="medium" v-model.trim="item.bankAccountName" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label-width="35px" class="formItem">
              <span style="position: relative;" @change="isDefaultitem(item,index)" class="radios">
                <input
                  :id="'item'+index"
                  type="radio"
                  name="test"
                  :value="item.isDefault"
                  :checked="item.isCheck"
                  style="width:30px;"
                />
                <label :for="'item'+index"></label>
                <span>设为默认</span>
              </span>
              <i
                class="el-icon-circle-close"
                v-if="item.isDel"
                @click="del(index)"
                v-show="formInline.basicInfoList.length>1"
              ></i>
            </el-form-item>
          </div>
          <el-form-item label-width="0">
            <!-- :
            &nbsp;&nbsp;账号:
            <el-input size="medium" v-model.trim="item.bankAccount" style="width:200px"></el-input>&nbsp;&nbsp;开户名:
            <el-input size="medium" v-model.trim="item.bankAccountName" style="width:200px"></el-input>&nbsp;&nbsp;-->
          </el-form-item>
          <el-form-item align="left" label-width="0">
            <el-button @click="addInfo" type="text">
              <i class="el-icon-circle-plus"></i>&nbsp;&nbsp;新增收款信息
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="savebasicInfoList"
              :disabled="disabled"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import AddressList from '@/components/common/AddressList'
export default {
  name: 'orderList',
  data () {
    return {
      activeName: this.$route.query.activeName || 'first',
      rules: {
        bankName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        bankAccountName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      formInline: {
        basicInfoList: [
          {
            bankName: '',
            bankAccount: '',
            bankAccountName: '',
            isDefault: '1',
            isDel: true,
            isCheck: true
          }
        ]
      },
      rulesForm: {
        invoicesHead: [
          { required: true, message: '请输入发票抬头', trigger: 'blur' }
        ],
        taxNo: [
          { required: true, message: '请输入税务登记证号', trigger: 'blur' }
        ],
        registerAddress: [
          { required: true, message: '请注册场所地址', trigger: 'blur' }
        ],
        depositBank: [
          { required: true, message: '请输入开户银行', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '请输入银行账户', trigger: 'blur' }
        ],
        contactor: [
          { required: true, message: '请输入收货人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入收货人电话', trigger: 'blur' }
        ],
        addressDetail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      form: {
        activeNameList: [
          {
            setDefault: true,
            name: '1',
            invoicesHead: '',
            taxNo: '',
            registerAddress: '',
            invoiceType: '1',
            depositBank: '',
            bankAccount: '',
            contactor: '',
            phone: '',
            addressDetail: ''
            // address: []
          }
        ]
      },
      // addresslistjson: [],
      tabIndex: 1,
      getIndex: 0,
      activeNamesecond: '1',
      disabled: false
    }
  },
  created () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.orgId = userInfo.organizationIds
    this.savedo()
    this.getCashInfo()
  },
  methods: {
    setDefault (item) {
      for (let index = 0; index < this.form.activeNameList.length; index++) {
        const element = this.form.activeNameList[index]
        element.setDefault = '0'
      }
      item.setDefault === '0' ? item.setDefault = true : item.setDefault = false
    },
    handleClick1 (tab, event) {
      console.log(tab.index)
      this.getIndex = tab.index
      console.log(this.activeNamesecond)
    },
    addTab (targetName) {
      if (this.form.activeNameList.length > 4) {
        return this.$message.error('您只能添加五个开票信息哦')
      }
      let newTabName = ++this.tabIndex + ''
      this.form.activeNameList.push({
        id: '',
        setDefault: false,
        orgId: this.orgId,
        name: newTabName,
        invoicesHead: '',
        taxNo: '',
        registerAddress: '',
        invoiceType: '1',
        depositBank: '',
        bankAccount: '',
        contactor: '',
        phone: '',
        addressDetail: ''
        // address: []
      })
      this.activeNamesecond = newTabName
    },
    removeTab (targetName, action) {
      if (this.form.activeNameList.length > 1) {
        var setDefault = this.form.activeNameList.filter(tab => tab.name === targetName)[0].setDefault
        if (setDefault === '1' || setDefault === true) {
          return this.$message.error('默认的开票信息无法删除')
        }
        this.$confirm('您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let tabs = this.form.activeNameList
          let activeName = this.activeNamesecond
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }
          this.activeNamesecond = activeName
          var id = tabs.filter(tab => tab.name === targetName)[0].id

          this.form.activeNameList = tabs.filter(tab => tab.name !== targetName)
          if (id !== '') {
            this.deleteInvoicesInfo(id)
          }
        }).catch(() => {

        })
      } else {
        this.$message.error('请至少保留一个开票信息')
      }
    },
    // 删除
    deleteInvoicesInfo (id) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/deleteInvoicesInfo'),
        method: 'post',
        data: this.$http.adornData({
          ids: id
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.$message.success('删除成功')
          this.savedo()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    isDefaultitem (item, index) {
      this.formInline.basicInfoList.map((v, i) => {
        if (i == index) {
          v.isCheck = true
        } else {
          v.isCheck = false
        }
      })
    },
    getCashInfo () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/getCashInfo'),
        method: 'post',
        data: this.$http.adornData({
          orgId: this.orgId
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          res.data.cashInfo.map((v, i) => {
            if (v.isDefault === 1) {
              v.isCheck = true
              v.isDel = true
            } else {
              v.isCheck = false
              v.isDel = true
            }
          })
          this.formInline.basicInfoList = res.data.cashInfo
          console.log(this.formInline.basicInfoList)
        }
      })
    },
    savebasicInfoList () {
      this.cashList = []
      var num = 0
      for (let index = 0; index < this.formInline.basicInfoList.length; index++) {
        const element = this.formInline.basicInfoList[index]
        if (element.isCheck === true) {
          if (element.bankName === '' || element.bankAccount === '' || element.bankAccountName === '') {
            num++
          }
        }
        this.cashList.push({
          orgId: this.orgId,
          bankName: element.bankName,
          bankAccount: element.bankAccount,
          bankAccountName: element.bankAccountName,
          isDefault: element.isCheck === true ? '1' : '0'
        })
      }
      if (num > 0) {
        return this.$message.error('信息填写完整后才可设置默认')
      }
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/saveCashInfo'),
        method: 'post',
        data: this.$http.adornData({
          orgId: this.orgId,
          cashList: JSON.stringify(this.cashList)
        }, true)
      }).then(res => {
        if (res && res.data.code === 0) {
          this.disabled = false
          this.$message.success('保存成功')
          this.getCashInfo()
        }
      })
    },
    addInfo () {
      this.formInline.basicInfoList.push({
        bankName: '',
        bankAccount: '',
        bankAccountName: '',
        radioNname: 'radioNname',
        isDefault: this.formInline.basicInfoList.length === 0 ? '1' : '0',
        isDel: true,
        isCheck: this.formInline.basicInfoList.length === 0
      })
      console.log(this.formInline.basicInfoList)
    },

    del (index) {
      this.formInline.basicInfoList.splice(index, 1)
    },
    savedo () {
      this.form.activeNameList = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/invoices/invoicesinfo/savedo'),
        method: 'post',
        data: this.$http.adornData()
      }).then(res => {
        if (res && res.data.code === 0) {
          if (res.data.invoiceInfo.length > 0) {
            for (let index = 0; index < res.data.invoiceInfo.length; index++) {
              const element = res.data.invoiceInfo[index]
              this.form.activeNameList.push({
                orgId: this.orgId,
                id: element.id,
                setDefault: element.setDefault === '1',
                name: (index + 1) + '',
                invoicesHead: element.invoicesHead,
                taxNo: element.taxNo,
                invoiceType: element.invoiceType + '',
                registerAddress: element.registerAddress,
                depositBank: element.depositBank,
                bankAccount: element.bankAccount,
                contactor: element.contactor,
                phone: element.phone,
                addressDetail: element.addressDetail
              })
            }
            this.activeNamesecond = '1'
            this.tabIndex = this.form.activeNameList.length
          } else {
            this.form.activeNameList.push({
              orgId: this.orgId,
              id: '',
              setDefault: true,
              name: '1',
              invoicesHead: '',
              taxNo: '',
              invoiceType: '1',
              registerAddress: '',
              depositBank: '',
              bankAccount: '',
              contactor: '',
              phone: '',
              addressDetail: ''
            })
            this.activeNamesecond = '1'
            console.log(this.activeNamesecond)
          }
        }
      })
    },
    handleClick (tab, event) {

    },

    saveInvoicesInfo () {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          var num = 0
          for (let index = 0; index < this.form.activeNameList.length; index++) {
            const element = this.form.activeNameList[index]
            element.setDefault = element.setDefault === true ? '1' : '0'
            // element.address = JSON.stringify(element.address)
            if (element.setDefault === '0') {
              num++
            }
          }
          if (num === this.form.activeNameList.length) {
            this.form.activeNameList[0].setDefault = '1'
          }
          this.disabled = true
          this.$http({
            url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/saveInvoicesInfo'),
            method: 'post',
            data: JSON.stringify(this.form.activeNameList)
          }).then(res => {
            if (res && res.data.code === 0) {
              this.$message.success('保存成功')
              this.savedo()
            }
            this.disabled = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {

  }
}
</script>
<style lang="scss" scoped>
.siteWrapper h2 {
  border-left: 4px solid #3e8ef7;
  font-size: 16px;
  padding-left: 10px;
  color: #3c3c3c;
}
.radios {
  input[type='radio'] {
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  label {
    position: absolute;
    left: 5px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #999;
    cursor: pointer;
  }
  input:checked + label {
    background-color: #3e8ef7;
    border: 1px solid #3e8ef7;
  }

  input:checked + label::after {
    position: absolute;
    content: '';
    width: 5px;
    height: 10px;
    top: 3px;
    left: 6px;
    border: 2px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }
}
.el-icon-circle-close {
  cursor: pointer;
  font-size: 16px;
}
.btn01 {
  position: absolute;
  right: 10px;
  z-index: 5;
}
</style>
