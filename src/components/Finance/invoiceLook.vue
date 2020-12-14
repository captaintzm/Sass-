<template>
  <el-dialog
    title="查看发票物流"
    :visible.sync="dialogTableVisible"
    width="900px"
  >
    <div class="siteWrapper">
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
      </el-table>
        <div style="text-align:right" class="mt20">
          <el-button @click="dialogTableVisible=false">取消</el-button>
        </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogTableVisible: false,
      tableData: [],
      id: ''
    }
  },
  mounted () {
  },
  methods: {
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
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scope>

</style>
