<template>
  <el-dialog
    title="添加/查看发票物流"
    :visible.sync="dialogTableVisible"
    width="900px"
    :closeOnClickModal="false"
  >
    <div class="siteWrapper">
      <h1>添加发票物流</h1>
      <el-form ref="form" :model="form"  :rules="rules" label-width="80px" size="medium">
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
         <el-form-item label="备注" class="formItem" label-width="60px">
          <el-input  v-model="form.remarks" placeholder="不超过30字" maxlength="30" class="w300"></el-input>
        </el-form-item>

      <h1>查看发票物流</h1>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="300"
        :header-cell-style="{color:'#333',background:'#F5F7FA'}"
      >
        <el-table-column prop="company" label="快递公司"></el-table-column>
        <el-table-column prop="logisticsNo" label="快递单号" ></el-table-column>
        <el-table-column prop="invoicesNo" label="发票号"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column prop="status" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="update(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="packlist">
        <!-- <el-pagination
          class="page"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :background="true"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          :current-page="pageIndex"
        ></el-pagination> -->
      </div>
        <div style="text-align:right" class="mt20">
          <el-button @click="dialogTableVisible=false">取消</el-button>
          <el-button type="primary" @click="sure" :loading="loading" >确认</el-button>
          <el-button type="primary" @click="done" v-if="tableData.length>0">完成</el-button>
        </div>
        </el-form>
    </div>
    <updateWuliu ref="updateWulius" @isok="getlist"/>
  </el-dialog>

</template>

<script>
import updateWuliu from './updateWuliu'
export default {
  data () {
    return {
      loading: false,
      dialogTableVisible: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      id: '',
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
    update (item) {
      this.$refs.updateWulius.inint(item)
    },
    sure () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this._http.saveOrUpdateLogistics({
            id: '',
            company: this.form.company,
            invoicesId: this.id,
            invoicesNo: this.form.invoicesNo,
            logisticsNo: this.form.logisticsNo,
            remarks: this.form.remarks,
            unFormData: true,
            type: 1
          }).then((data) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.$refs['form'].resetFields()
              this.getlist()
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
    done () {
      this.$confirm(`点击【完成】后，无法继续添加或修改发票物流信息，只能查看发票物流`, '发票物流确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this._http.logisticsConfirm({
          id: this.id,
          type: 1
        }).then((data) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getlist()
            this.dialogTableVisible = false
            this.$emit('getpacklist', '')
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => { })
    },
    inint (item) {
      this.dialogTableVisible = true
      this.id = item.id
      this.getlist()
    },
    getlist () {
      this.tableData = []
      this._http.queryLogistics({
        invoicesId: this.id,
        type: 1
      }).then((res) => {
        if (res && res.code === 0) {
          this.tableData = res.logistics
        }
      })
    }
  },
  components: {
    updateWuliu
  }
}
</script>

<style lang="scss" scope>
.siteWrapper {
  h1{
    border-left: 4px solid #1985FF;
    font-size: 16px;
    padding-left: 10px;
    color: #3c3c3c;
    position: relative;
    height: 24px;
    line-height: 24px;
    margin:10px 0;
  }
}
</style>
