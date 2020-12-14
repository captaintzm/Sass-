<template>
  <el-dialog title="SKU批量添加" :visible.sync="showWebsite" width="550px" append-to-body>
    <el-form :model="formchangePrice">
      <el-form-item label>
        <el-input type="textarea" v-model="formchangePrice.remarks" placeholder="每个SKU需用英文逗号隔开"></el-input>
        <el-button type="primary" @click="importsku" plain size="small">确认添加</el-button>&nbsp;
        <span>提示：确认添加后才完成添加操作，否则无法导入</span>
      </el-form-item>
      <el-form-item label class="numstyle">
        <span>总共导入：{{formchangePrice.totalCount}}</span>
        <span>导入成功：{{formchangePrice.successCount}}</span>
        <span>导入失败：{{formchangePrice.errorCount}}</span>
        <el-popover
          placement="bottom"
          title
          width="200"
          trigger="click"
          :content="formchangePrice.errorInfo"
        >
          <el-button slot="reference" plain size="small" type="primary">查看详情</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="销售价" class="formItem">
        商城对用户的价格
        <br />
        <el-radio-group v-model="formchangePrice.resource" @change="getpriceWay">
          <el-radio label="adjust" class="radioItem">
            按照
            <el-select
              v-model="formchangePrice.gyj"
              placeholder="请选择"
              @change="getpriceType"
              class="fipt w90"
            >
              <el-option
                v-for="item in formchangePrice.gyjlist"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>

            <el-select
              v-model="formchangePrice.gyjState"
              placeholder="请选择"
              @change="getpriceAdjust"
              class="fipt w90"
            >
              <el-option
                v-for="item in formchangePrice.gyjStatelist"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input v-model="formchangePrice.priceVal" placeholder="输入值" class="fipt mr5 w90"></el-input>
            <el-select
              v-model="formchangePrice.priceUnit"
              placeholder="请选择"
              @change="getpriceUnit"
              class="fipt w90"
            >
              <el-option
                v-for="item in formchangePrice.priceUnitlist"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-radio>
          <el-radio label="eq" class="radioItem">
            等于
            <el-select
              v-model="formchangePrice.gyj1"
              placeholder="请选择"
              @change="getpriceType1"
              class="fipt w90"
            >
              <el-option
                v-for="item in formchangePrice.gyjlist1"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showWebsite = false">取 消</el-button>
      <el-button type="primary" @click="beforeClose" :disabled="disabled">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      showWebsite: false,
      form: {
        value: ''

      },
      formchangePrice: {
        productIds: '',
        errorCount: '',
        successCount: '',
        totalCount: '',
        errorInfo: '',
        remarks: '',
        resource: 'adjust',
        gyj: '供应价',
        gyjlist: [{
          name: '供应价',
          value: 'supplyPrice'
        },
        {
          name: '市场价',
          value: 'markPrice'
        }],
        gyj1: 'supplyPrice',
        gyjlist1: [{
          name: '供应价',
          value: 'supplyPrice'
        },
        {
          name: '市场价',
          value: 'markPrice'
        }],
        gyjState: 'incr',
        gyjStatelist: [
          {
            name: '上调',
            value: 'incr'
          },
          {
            name: '下降',
            value: 'desc'
          }
        ],
        priceWay: 'adjust', // 按照/等于 adjust/eq
        priceType: 'supplyPrice', // 供应价/市场价 supplyPrice / markPrice
        priceAdjust: 'incr', // 上调或下降 incr / desc
        priceVal: '0', // 输入值
        priceUnit: 'profit', // 价格单位 rmb / profit
        priceUnitlist: [
          {
            name: '%',
            value: 'profit'
          },
          {
            name: '元',
            value: 'rmb'
          }
        ]
      },
      sourceid: this.source,
      siteId: this._pageSiteId,
      disabled: false
    }
  },
  mounted () {
    this.hideGyj()
  },
  methods: {
    hideGyj () {
      this.hideFlag = Number(this._hideFlag)
      this.formchangePrice.gyj = this.hideFlag === 0 ? '供应价' : '市场价'
      this.formchangePrice.gyj1 = this.hideFlag === 0 ? 'supplyPrice' : 'markPrice'
      this.formchangePrice.priceType = this.hideFlag === 0 ? 'supplyPrice' : 'markPrice'
      if (this.hideFlag === 1) {
        this.formchangePrice.gyjlist.splice(this.formchangePrice.gyjlist.findIndex(item => item.value === 'supplyPrice'), 1)
        this.formchangePrice.gyjlist1.splice(this.formchangePrice.gyjlist1.findIndex(item => item.value === 'supplyPrice'), 1)
      }
    },
    getpriceWay (event) {
      this.formchangePrice.priceWay = event
    },
    getpriceType (event) {
      this.formchangePrice.priceType = event
    },
    getpriceAdjust (event) {
      this.formchangePrice.priceAdjust = event
    },
    getpriceUnit (event) {
      this.formchangePrice.priceUnit = event
    },
    getpriceType1 (event) {
      this.formchangePrice.priceType = event
    },
    inint (sourceid) {
      this.sourceid = sourceid
    },
    importsku () {
      if (this.formchangePrice.remarks === '') {
        return this.$message.error('请输入sku')
      }

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/batchSelectBySkus'),
        method: 'post',
        data: this.$http.adornData({
          source: this.sourceid,
          skus: this.formchangePrice.remarks,
          siteId: this._pageSiteId
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.formchangePrice.errorCount = res.data.errorCount
          this.formchangePrice.successCount = res.data.successCount
          this.formchangePrice.totalCount = res.data.totalCount
          this.formchangePrice.errorInfo = res.data.errorInfo
          this.formchangePrice.productIds = res.data.productIds
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getbatchPrePick () {
      if (this.formchangePrice.productIds.length === 0) {
        return this.$message.error('请先确认添加有效的SKU')
      }
      var productIds = ''
      for (let index = 0; index < this.formchangePrice.productIds.length; index++) {
        productIds += this.formchangePrice.productIds[index] + ','
      }
      productIds = productIds.substring(0, productIds.length - 1)

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/batchPrePick'),
        method: 'post',
        data: this.$http.adornData({
          source: this.sourceid,
          productIds: productIds,
          priceWay: this.formchangePrice.priceWay,
          priceType: this.formchangePrice.priceType,
          priceAdjust: this.formchangePrice.priceAdjust,
          priceVal: this.formchangePrice.priceVal,
          priceUnit: this.formchangePrice.priceUnit,
          siteId: this._pageSiteId
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.$message.success(res.data.msg)
          this.$emit('setSkuList', 1)
          this.showbatchAdd = false
          this.showWebsite = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    beforeClose () {
      if (this.formchangePrice.remarks === '') {
        return this.$message.error('请填写sku')
      }
      this.$confirm('是否确认批量添加SKU到我的商品库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getbatchPrePick()
        // this.$emit('setSkuList', this.form.value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.website {
  width: 430px;
  height: 264px;
  /deep/ .van-dialog__header {
    height: 33px;
    font-size: 24px;
    font-weight: bold;
    line-height: 33px;
    color: rgba(108, 107, 143, 1);
    padding-top: 37px;
    text-align: center;
    width: 100%;
  }
  p {
    width: 100%;
    height: 16px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: rgba(148, 155, 184, 1);
    opacity: 1;
    margin-top: 9px;
    text-align: center;
  }
  .ipt {
    margin: 0 auto;
    width: 350px;
    height: 34px;
    margin-top: 20px;
    margin-bottom: 30px;
    /deep/ .van-cell {
      width: 350px;
      height: 34px;
      background: rgba(245, 246, 250, 1);
      border: 1px solid rgba(226, 232, 237, 1);
      opacity: 1;
      border-radius: 4px;
      padding: 0;
      input {
        width: 350px;
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
      }
    }
  }
  /deep/ .van-dialog__footer--buttons {
    display: block;
    text-align: center;
  }
  /deep/ .van-button {
    width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(228, 230, 237, 1);
    border-radius: 4px;
    font-size: 12px;
    color: #949bb8;
    line-height: 34px;
    margin: 0 10px;
    &.van-dialog__confirm {
      background: rgba(68, 134, 244, 1);
      color: #ffffff;
      font-size: 12px;
    }
  }
}
.radioItem {
  margin-bottom: 10px;
}
.numstyle {
  span {
    display: inline-block;
    margin: 0 10px;
  }
}
</style>
