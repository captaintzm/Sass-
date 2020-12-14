<template>
  <el-dialog
    title="修改发票物流"
    :visible.sync="dialogTableVisible"
    width="500px"
    :closeOnClickModal="false"
    append-to-body
  >
    <div class="siteWrapper">
      <el-form ref="form" :model="form"  :rules="rules" label-width="90px" size="medium">
        <el-form-item label="快递公司" class="formItem" prop="company">
          <el-select v-model="form.company" class="w110">
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="(item,index) in form.formDeliveryList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" class="formItem" prop="logisticsNo" label-width="90px">
          <el-input  v-model="form.logisticsNo" placeholder="" class="w140"></el-input>
        </el-form-item><br>
        <el-form-item label="发票号" class="formItem" prop="invoicesNo">
          <el-input  v-model="form.invoicesNo" placeholder="如填写多个发票号，用英文逗号隔开" class="w300"></el-input>
        </el-form-item>
         <el-form-item label="备注" class="formItem">
          <el-input  v-model="form.remarks" placeholder="不超过30字" maxlength="30" class="w300"></el-input>
        </el-form-item>
        <div style="text-align:right" class="mt20">
          <el-button @click="dialogTableVisible=false">取消</el-button>
          <el-button type="primary" @click="sure" :loading="loading" >确认</el-button>
        </div>
        </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      dialogTableVisible: false,
      id: '',
      invoicesId: '',
      form: {
        company: '',
        invoicesNo: '',
        logisticsNo: '',
        remarks: '',
        formDeliveryList: []
      },
      rules: {
        company: [
          this.verify('change', '请选择快递公司')
        ],
        logisticsNo: [
          this.verify('change', '请输入快递单号')
        ],
        invoicesNo: [
          this.verify('change', '请输入发票号')
        ]
      }
    }
  },
  created () {
    this.queryComList()
  },
  watch: {
    dialogTableVisible () {
      if (this.dialogTableVisible === false) {
        this.$refs['form'].resetFields()
      }
    }
  },
  methods: {
    queryComList () {
      this._http.queryComList().then((res) => {
        if (res && res.success) {
          var obj = res.obj
          for (var key in obj) {
            this.form.formDeliveryList.push({
              id: key,
              name: obj[key],
              type: 1
            })
          }
          var item = {
            id: 'zps',
            name: '自配送',
            type: 0
          }
          this.form.formDeliveryList.splice(0, 0, item)
        }
      })
    },
    sure () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this._http.saveOrUpdateLogistics({
            company: this.form.company,
            id: this.id,
            invoicesId: this.invoicesId,
            invoicesNo: this.form.invoicesNo,
            logisticsNo: this.form.logisticsNo,
            remarks: this.form.remarks,
            unFormData: true,
            type: 1
          }).then((data) => {
            if (data && data.code === 0) {
              this.$message.success('修改成功')
              this.$emit('isok')
              this.dialogTableVisible = false
            } else {
              this.$message.error(data.msg)
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    },

    inint (item) {
      this.dialogTableVisible = true
      this.id = item.id
      this.invoicesId = item.invoicesId
      this.form.company = item.company
      this.form.invoicesNo = item.invoicesNo
      this.form.logisticsNo = item.logisticsNo
      this.form.remarks = item.remarks
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scope>

</style>
