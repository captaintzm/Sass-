<template>
  <el-dialog
    title="开票信息维护"
    :visible.sync="dialogTable"
    width="800px"
    :closeOnClickModal="false"
    append-to-body
  >
    <div class="siteWrapper">
      <el-form ref="form" label-width="100px" size="medium">
        <h2>发票基本信息</h2>
        <el-form-item label="发票抬头">
          <el-input size="medium" v-model.trim="form.invoicesHead"></el-input>
        </el-form-item>
        <el-form-item label="税务登记证号">
          <el-input size="medium" v-model.trim="form.taxNo"></el-input>
        </el-form-item>
        <el-form-item label="注册场所地址">
          <el-input size="medium" v-model.trim="form.registerAddress"></el-input>
        </el-form-item>
        <el-form-item label="发票类型">
          <el-radio v-model="form.invoiceType" label="1">增值税专用发票</el-radio>
          <el-radio v-model="form.invoiceType" label="2">增值税普通发票</el-radio>
        </el-form-item>
        <el-form-item label="开户银行">
          <el-input size="medium" v-model.trim="form.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="银行账户">
          <el-input size="medium" v-model.trim="form.bankAccount"></el-input>
        </el-form-item>
        <h2>发票收货地址</h2>
        <el-form-item label="收货人" class="formItem" style="margin-bottom:15px;">
          <el-input size="medium" v-model.trim="form.contactor"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" class="formItem" style="margin-bottom:15px;">
          <el-input size="medium" v-model.trim="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="省市区">
          <AddressList ref="addressList" @mallSiteDistrict="mallSiteListDistrict" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input size="medium" v-model.trim="form.addressDetail" type="textarea"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button type="primary" size="small" @click="dialogTable=false">取消</el-button>
          <el-button type="primary" size="small" @click="saveInvoicesInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import AddressList from '@/components/common/AddressList'
export default {
  data () {
    return {
      dialogTable: false,
      form: {
        invoicesHead: '',
        invoiceType: '1',
        registerAddress: '',
        depositBank: '',
        bankAccount: '',
        contactor: '',
        phone: '',
        addressDetail: '',
        valuePro: '',
        valuecity: '',
        valuearea: '',
        firstDistrictName: '',
        secondDistrictName: '',
        thirdDistrictName: '',
        valueProCityArea: []
      }
    }
  },
  mounted () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.orgId = userInfo.organizationIds
  },
  watch: {
    dialogTable () {
      this.form.invoicesHead = ''
      this.form.invoiceType = '1'
      this.form.registerAddress = ''
      this.form.depositBank = ''
      this.form.bankAccount = ''
      this.form.contactor = ''
      this.form.phone = ''
      this.form.addressDetail = ''
      this.form.valuePro = ''
      this.form.firstDistrictName = ''
      this.form.valuecity = ''
      this.form.secondDistrictName = ''
      this.form.valuearea = ''
      this.form.thirdDistrictName = ''
      this.form.valueProCityArea = []
    }
  },
  methods: {
    // /ybt-backend/sys/sysorganization/saveInvoicesInfo
    mallSiteListDistrict (item) {
      this.form.valuePro = item.firstDistrictId
      this.form.firstDistrictName = item.firstDistrictName
      this.form.valuecity = item.secondDistrictId
      this.form.secondDistrictName = item.secondDistrictName
      this.form.valuearea = item.thirdDistrictId
      this.form.thirdDistrictName = item.thirdDistrictName
    },
    saveInvoicesInfo () {
      let address = ''
      this.form.valueProCityArea = []
      this.form.valueProCityArea.push(
        {
          id: this.form.valuePro,
          name: this.form.firstDistrictName
        },
        {
          id: this.form.valuecity,
          name: this.form.secondDistrictName
        },
        {
          id: this.form.valuearea,
          name: this.form.thirdDistrictName
        }
      )
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/sys/sysorganization/saveInvoicesInfo'),
        method: 'post',
        data: this.$http.adornData(
          {
            orgId: this.orgId,
            invoicesHead: this.form.invoicesHead,
            taxNo: this.form.taxNo,
            invoiceType: this.form.invoiceType,
            registerAddress: this.form.registerAddress,
            depositBank: this.form.depositBank,
            bankAccount: this.form.bankAccount,
            contactor: this.form.contactor,
            phone: this.form.phone,
            address: JSON.stringify(this.form.valueProCityArea),
            addressDetail: this.form.addressDetail
          },
          true
        )
      }).then(res => {
        if (res && res.data.code === 0) {
          this.$message.success('保存成功')
          this.dialogTable = false
          this.$emit('freshList', 1)
        }
      })
    }
  },
  components: {
    AddressList
  }
}
</script>

<style lang="scss" scope>
.siteWrapper h2 {
  border-left: 4px solid #3E8EF7;
  font-size: 16px;
  padding-left: 10px;
  color: #3c3c3c;
}
</style>
