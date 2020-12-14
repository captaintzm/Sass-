<template>
  <transition name="fade">
    <el-dialog
      title
      :visible.sync="showWebsite"
      :show-close="false"
      width="960px"
      :lock-scroll="false"
      class="padding0"
    >
 <div
      class="site-content"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" >
      <div class="searchBlock">
        <ul class="navsourse">
          <li
            :class="{'active':item.soureType==true}"
            v-for="(item ,index) in source"
            :key="index"
            @click="selectsource(item)"
          >{{item.name}}</li>
        </ul>
        <div class="searchPannel">
          <el-form ref="form" :model="form" label-width="80px" size="medium">
            <el-form-item label="供应价" class="formItem" v-show="hideFlag==0">
              <el-input v-model="form.supplyPriceStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.supplyPriceEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="销售利润率" class="formItem"  v-show="hideFlag==0" label-width="100px">
              <el-input v-model="form.profitStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.profitEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="利润率" class="formItem"  v-show="hideFlag!=0" label-width="100px">
              <el-input v-model="form.sonProfitStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.sonProfitEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
             <el-form-item label="分销利润率" class="formItem" v-show="hideFlag==0" label-width="100px">
              <el-input v-model="form.distribProfitStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.distribProfitEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="商品" class="formItem">
              <el-input v-model="form.itemName" placeholder="名称或SKU" class="fipt w150"></el-input>
              <!-- <el-input v-model="form.itemCode" placeholder="SKU" class="fipt ml5"></el-input> -->
            </el-form-item>
            <el-form-item label="库存状态" class="formItem" v-show="sourceid!=7 && sourceid!=9 ">
              <el-select
                v-model="goodsStatus"
                placeholder="全部"
                class="fipt"
                @change="getGoodsStatus"
              >
                <el-option label="全部" value></el-option>
                <el-option label="有货" value="-1"></el-option>
                <el-option label="无货" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分销价" class="formItem" v-show="hideFlag==0">
              <el-input v-model="form.distribPriceStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.distribPriceEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="市场价" class="formItem">
              <el-input v-model="form.markPriceStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.markPriceEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="销售价" class="formItem">
              <el-input v-model="form.salePriceStart" placeholder="最低" class="fipt"></el-input>
              <span class="jg">-</span>
              <el-input v-model="form.salePriceEnd" placeholder="最高" class="fipt"></el-input>
            </el-form-item>
            <el-form-item label="分类" class="formItem">
                <Classification
                  ref="classificate"
                  @getCateId1="getCateId1"
                  @getCateId2="getCateId2"
                  @getCateId3="getCateId3"
                ></Classification>
            </el-form-item>

            <el-form-item label="供应商" class="formItem"  v-show="sourceid==2">
                <el-select
                v-model="supplyListValue"
                class="w140"
                placeholder="请选择"
              >
               <el-option label="全部" value=""></el-option>
                <el-option
                  :label="item.supplyName"
                  :value="item.supplyId"
                  v-for="(item,index) in getSupplyList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区" class="formItem" v-show="sourceid!=2">
              <AddressListGoods ref="addressList" @mallSiteDistrict="mallSiteList" :source="sourceid"  @getmallSiteDistrict="getmallSiteData"></AddressListGoods>
              <!-- <AddressList ref="addressList" @mallSiteDistrict="mallSiteList" :source="sourceid" @getmallSiteDistrict="getmallSiteData"></AddressList> -->
            </el-form-item>
            <el-form-item label="排序" class="formItem" v-show="hideFlag==0">
              <el-select
                v-model="form.orderFlag"
                placeholder="排序"
                class="fipt"
                @change="getSort"
                style="width:160px"
              >
                <el-option label="全部" value></el-option>
                <el-option label="供应价正序" value="a.supply_price asc"></el-option>
                <el-option label="供应价倒序" value="a.supply_price desc"></el-option>
                <el-option label="按利润率从小到大" value="a.profit_percent asc"></el-option>
                <el-option label="按利润率从大到小" value="a.profit_percent desc"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="formItem ml0">

            </el-form-item>
          </el-form>
        </div>
        <div class="searchTable">
          <el-row style="padding:0 20px">
            <el-button type="primary" size="small" @click="onsearch">搜索</el-button>
          </el-row>

          <div class="tablescroll">
            <el-table
              height="600"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%;overflow: hidden;"
              :header-cell-style="{color:'#333',background:'#F5F7FA'}"
            >
              <el-table-column prop="itemName" label="商品名称" width="250" key="2">
                <template slot-scope="scope">
                  <div @click="siteproductQuery(scope.row)" style="cursor:pointer">
                    <img :src="scope.row.url" width="70" height="70" />
                    <div class="scopepannel">{{scope.row.itemName}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column  align="center" prop="supplyName" label="供应商" key="3"></el-table-column>
              <el-table-column  align="center" prop="itemCode" label="商品编码" key="4"></el-table-column>
              <el-table-column  align="center" prop="markPrice" label="市场价" key="5">
                <template slot-scope="scope">
                  <el-button
                    @click="lookPrice(scope.row)"
                    type="text"
                    size="small"
                    v-show="sourceid==1"
                  >查看实时价</el-button>
                  <div>{{scope.row.markPrice}}</div>
                </template>
              </el-table-column>
              <el-table-column  align="center" prop="supplyPrice" label="供应价" key="6" v-if="hideFlag==0"></el-table-column>
              <el-table-column  align="center" prop="distribPrice"  label="分销价" width="100" ></el-table-column>
              <el-table-column  align="center" prop="salePrice" label="销售价" key="7"></el-table-column>
              <!-- <el-table-column prop="profitPercent" label="销售利润率(%)"></el-table-column> -->
              <el-table-column
                align="center"
                width="150"
                prop="profitPercent"
                label="销售利润率(%)"
              >
               <template slot-scope="scope">
                    <span>{{scope.row.profitPercent}}</span>
                    <!-- <span v-if="hideFlag==0"><br>{{scope.row.distribProfitPercent}}</span> -->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="status" label="库存状态"></el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
            class="pagination"
          ></el-pagination>
        </div>
      </div>
    </div>
    </el-dialog>
  </transition>
</template>
<script>
import AddressListGoods from '@/components/common/AddressListGoods'
import Classification from '@/components/Classification/Classification'
// import ClassificationMyGoods from '@/components/ClassificationMyGoods'
export default {
  name: 'index',
  data () {
    return {
      batchGoodsInfo: false,
      errorMsg: '',
      errorItems: '',
      ishowxiajia: false,
      errorInfo: '',
      errorIds: [],
      isshowtime: false,
      hideFlag: '',
      showtime: {
        salePrice: '',
        url: ''
      },
      radio: 1,
      ishowbatchRemove: false,
      advertId: this.$route.query.id,
      showWebsite: false,
      pageIndex: 1,
      pageSize: 50,
      totalPage: 0,
      form: {
        productCateId1: '',
        // itemCode: '',
        itemName: '',
        productCateId: '',
        profitStart: '',
        profitEnd: '',
        sonProfitStart: '',
        sonProfitEnd: '',
        salePriceStart: '',
        salePriceEnd: '',
        markPriceStart: '',
        markPriceEnd: '',
        supplyPriceStart: '',
        supplyPriceEnd: '',
        distribPriceStart: '',
        distribPriceEnd: '',
        distribProfitStart: '',
        distribProfitEnd: '',
        priceList: '',
        priceList1: '',
        relationship: '',
        valuePro: '',
        valuecity: '',
        valuearea: '',
        valuestree: '',
        operStatusid: '',
        checked: false,
        sheng: '',
        shi: '',
        qu: '',
        jie: '',
        orderFlag: ''
      },

      batchRemoveForm: {
        status: '1'
      },
      address: [],
      city: [],
      area: [],
      stree: [],
      tableData: [],
      operStatus: '',
      goodsStatus: '',
      source: [
        {
          type: 1,
          name: '京东',
          soureType: true,
          isXn: 1
        },
        {
          type: 3,
          name: '苏宁易购',
          soureType: false,
          isXn: 1
        },
        {
          type: 4,
          name: '网易严选',
          soureType: false,
          isXn: 1
        },
        {
          type: 102,
          name: '平台供应商',
          soureType: false,
          isXn: 1
        },
        {
          type: 7,
          name: '平台虚拟商品',
          soureType: false,
          isXn: 1
        },
        {
          type: 2,
          name: '自有供应商',
          soureType: false,
          isXn: 1

        },
        {
          type: 2,
          name: '自有虚拟商品',
          soureType: false,
          isXn: 3
        }

      ],
      isXuni: 1,
      sourceid: 1, // 默认为1 1 京东 3 苏宁易购 4 欧菲斯
      parentId: 0,
      type: 1,
      skuIds: '',
      multipleSelection: [],
      formprice: {
        salePrice: '',
        distribPrice: ''
      },
      formLabelWidth: '60px',
      loading: true,
      cateLable: '', // 分类一
      cateLevel: '', // 分类二
      cateProduct: '', // 分类三
      isFirst: true,
      isFirstTrue: true,
      supplyListValue: '',
      getSupplyList: []
    }
  },
  watch: {
    ishowxiajia () {
      if (this.ishowxiajia === false) {
        this.pageIndex = 1
        this.getsiteSelect()
      }
    },
    isshowtime () {
      this.formprice.salePrice = ''
      this.formprice.distribPrice = ''
      this.formprice.url = ''
      // if (this.isshowtime === false) {
      //   this.getsiteSelect()
      // }
    },
    ishowbatchRemove () {
      if (this.ishowbatchRemove === true) {

      } else {
        this.batchRemoveForm.status = '1'
        this.productIds = ''
      }
    }
  },
  mounted () {
    if (this.$route.query.relationship === undefined) {
      this.form.relationship = ''
    } else {
      this.form.relationship = this.$route.query.relationship
      this.form.priceList = 'supplyPrice'
    }
    // if (document.cookie.indexOf('always') > 0) {
    this.source.push({
      type: 9,
      name: '小米有品',
      soureType: false,
      isXn: 1
    })
    // }
    this.siteId = ''
    this.getsiteSelectlist = []
    this.getId = ''
    this.operStatusStyle = ''
    this.productIds = ''
    this.hideFlag = Number(this._hideFlag)
  },
  methods: {
    inint (item) {
      this.siteId = item.id
      this.getSupplyLists()
    },
    getSupplyLists () {
      this.getSupplyList = []
      // querySupplyList
      this.$http.querySupplyList({
        siteId: this.siteId,
        orgId: localStorage.getItem('orgId')
      }).then((res) => {
        if (res && res.code === 0) {
          this.getSupplyList = res.obj
        }
      })
    },

    // batchRemove

    openUrl (id) {
      window.open('https://item.jd.com/' + id + '.html', '_blank')
      // this.isshowtime = false
    },
    // 查看时时价
    lookPrice (item) {
      // this.isshowtime = true
      this.$http.realPrice({
        productNo: item.productNo
      }).then((data) => {
        if (data && data.code === 0) {
          this.showtime.salePrice = data.realPrice.mark_price === undefined ? '暂无报价' : data.realPrice.mark_price + '元'
          this.showtime.url = data.realPrice.item_code
          this.openUrl(this.showtime.url)
        }
      })
    },
    // renderTabfenxiao (h, { column, $index }) {
    //   if (this.hideFlag === 0) {
    //     return (
    //       <span>
    //         <span>分销价</span>
    //       </span>)
    //   } else {
    //     return (
    //       <span>
    //         <span><el-tooltip class="item" effect="light" content="为礼品公司提供给客户的供应价" placement="top">
    //           <i class="tip_icon"></i>
    //         </el-tooltip>供货价</span>
    //       </span>)
    //   }
    // },
    // renderTabHeader (h, { column, $index }) {
    //   if (this.hideFlag === 0) {
    //     return (
    //       <span>
    //         <span><el-tooltip class="item" effect="light" content="销售利润率=（销售价-供应价）/销售价" placement="top">
    //           <i class="tip_icon"></i>
    //         </el-tooltip>销售利润率(%)<br/><el-tooltip class="item" effect="light" content="分销利润率=（分销价-供应价）/分销价" placement="top">
    //           <i class="tip_icon"></i>
    //         </el-tooltip>分销利润率(%)</span>
    //       </span>)
    //   } else {
    //     return (
    //       <span>
    //         <span><el-tooltip class="item" effect="light" content="利润率=（销售价-供货价）/销售价" placement="top">
    //           <i class="tip_icon"></i>
    //         </el-tooltip>利润率(%)</span>
    //       </span>)
    //   }
    // },
    siteproductQuery (item) {
      if (this.sourceid === 2) {
        this.$http.getDetailByProductNo({
          productNo: item.productNo
        }).then((data) => {
          if (data && data.code === 0) {
            if (data.productNo == null) {
              this.$message.error('没有查询到商品信息')
              return false
            }
            this.$refs.lookDetail.showProDetail = true
            this.$refs.lookDetail.type = 'xsj'
            this.$refs.lookDetail.salePrice = item.salePrice
            this.$refs.lookDetail.getInt(data.productNo, this.sourceid, item.status)
          }
        })
      } else {
        this.$http.siteproductQuery({
          productNo: item.productNo
        }).then((data) => {
          if (data && data.code === 0) {
            if (data.productNo.code === 500) {
              this.$message.error(data.productNo.msg)
            } else {
              this.$refs.lookDetail.showProDetail = true
              this.$refs.lookDetail.type = 'xsj'
              this.$refs.lookDetail.salePrice = item.salePrice
              this.$refs.lookDetail.getInt(data.productNo.productDetail, this.sourceid, item.status)
            }
          }
        })
      }
    },

    mallSiteList (item) {
      this.form.valuePro = item.firstDistrictId === null ? '' : item.firstDistrictId
      this.form.firstDistrictName = item.firstDistrictName
      this.form.valuecity = item.secondDistrictId === null ? '' : item.secondDistrictId
      this.form.secondDistrictName = item.secondDistrictName
      this.form.valuearea = item.thirdDistrictId === null ? '' : item.thirdDistrictId
      this.form.thirdDistrictName = item.thirdDistrictName
      this.form.valuestree = item.fourthDistrictId === null ? '' : item.fourthDistrictId
      this.form.fourthDistrictName = item.fourthDistrictName
      // 是否是第一次进来
      if (this.isFirst === true) {
        this.isFirst = false
        this.getsiteSelect()
      }
    },
    getmallSiteData (item) {
      this.form.valuePro = item.firstDistrictId === null ? '' : item.firstDistrictId
      this.form.firstDistrictName = item.firstDistrictName
      this.form.valuecity = item.secondDistrictId === null ? '' : item.secondDistrictId
      this.form.secondDistrictName = item.secondDistrictName
      this.form.valuearea = item.thirdDistrictId === null ? '' : item.thirdDistrictId
      this.form.thirdDistrictName = item.thirdDistrictName
      this.form.valuestree = item.fourthDistrictId === null ? '' : item.fourthDistrictId
      this.form.fourthDistrictName = item.fourthDistrictName
      this.getsiteSelect()
    },
    getCateId1 (id) {
      this.cateLable = id // 分类一
    },
    getCateId2 (id) {
      this.cateLevel = id // 分类二
    },
    getCateId3 (id) {
      this.cateProduct = id // 分类三
    },
    // 添加商品
    addPro () {
      this.$router.push('platform')
    },
    // 批量改价
    batchChangePrice () {
      var productIds = ''
      if (this.multipleSelection.length > 0) {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          productIds += this.multipleSelection[index].id + ','
        }
        productIds = productIds.substring(0, productIds.length - 1)
        this.productIds = productIds
        this.$refs.batchChangePrice.getSource('myGoods', this.productIds)
        this.$refs.batchChangePrice.showbatchChangePrice = true
      } else {
        this.$message.error('请选择一个商品')
        return false
      }
    },

    // 批量下架
    batchOperStatus (type) {
      var ids = ''; var proNos = ''; var confirmtxt = ''
      for (let index = 0; index < this.multipleSelection.length; index++) {
        ids += this.multipleSelection[index].id + ','
        proNos += this.multipleSelection[index].productNo + ','
      }
      ids = ids.substring(0, ids.length - 1)
      proNos = proNos.substring(0, proNos.length - 1)
      if (ids.length === 0) {
        this.$message.error('请选择一个商品')
        return false
      }
      if (type === 1) {
        confirmtxt = '是否确认对已选商品进行批量下架操作，下架后该商品将不在专题及移动端显示？'
      } else {
        confirmtxt = '是否确认对已选商品进行批量上架操作？'
      }

      this.$confirm(confirmtxt, '批量操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.changeStatus({
          ids: ids,
          operStatus: type === 1 ? 4 : 3,
          siteId: this.siteId,
          productNos: proNos
        }).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            // this.pageIndex = 1
            this.multipleSelection = []
            this.getsiteSelect()
          } else {
            this.errorIds = []
            this.errorInfo = data.msg
            this.errorIds = data.sku
            this.ishowxiajia = true

            // this.$message({
            //   type: 'error',
            //   message: data.msg
            // })
          }
        })
      }).catch(() => {

      })
    },

    getoperS (item) {
      var operStatus = item.operStatus === '上架' ? '下架' : '上架'
      var confirmtxt = ''
      if (operStatus === '下架') {
        confirmtxt = '是否确认下架该商品？下架后该商品将不在专题及移动端显示!'
      } else {
        confirmtxt = '是否确认上架该商品？'
      }
      this.$confirm(confirmtxt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.changeStatus({
          ids: item.id,
          operStatus: item.operStatus === '上架' ? '4' : '3',
          siteId: this.siteId,
          productNos: item.productNo
        }).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.multipleSelection = []
            this.getsiteSelect()
          } else {
            this.errorIds = []
            this.errorInfo = data.msg
            this.errorIds = data.sku
            this.ishowxiajia = true
          }
        })
      }).catch(() => {

      })
    },
    // 改价
    changePrice (item) {
      this.showWebsite = true
      this.getId = item.id
      this.formprice.salePrice = item.salePrice
      this.formprice.distribPrice = item.distribPrice
      this.getsupplyPrice = item.supplyPrice
      this.operStatusStyle = item.operStatusS
    },

    setajaxUpdate () {
      if (this.formprice.salePrice === '') {
        this.$message.error('请填写销售价')
        return false
      }
      if (this.formprice.salePrice === '0' || this.formprice.salePrice === '0.00' || this.formprice.salePrice === undefined) {
        this.$message.error('商品价格不能修改为0')
        return false
      }
      if (this.formprice.distribPrice === '' && this.hideFlag === 0) {
        this.$message.error('请填写分销价')
        return false
      }
      if (this.formprice.distribPrice === undefined && this.hideFlag === 0) {
        this.$message.error('请填写分销价')
        return false
      }
      if (this.formprice.distribPrice === '0' && this.hideFlag === 0) {
        this.$message.error('商品价格不能修改为0')
        return false
      }
      if (this.formprice.distribPrice === '0.00' && this.hideFlag === 0) {
        this.$message.error('商品价格不能修改为0')
        return false
      }
      this.$http.ajaxUpdate({
        id: this.getId,
        salePrice: this.formprice.salePrice,
        supplyPrice: this.getsupplyPrice,
        distribPrice: this.formprice.distribPrice,
        siteId: this.siteId
      }).then((data) => {
        if (data && data.code === 0) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.showWebsite = false
          this.multipleSelection = []
          this.getsiteSelect()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    saveSNDistrict () {
      if (this.form.valuePro === '' || this.form.valuecity === '' || this.form.valuearea === '') {
        return this.$message.error('请补全地址信息，以便查看商品库存状态')
      }
      this.$http.saveSNDistrict({
        id: this.siteId,
        provinceId: this.form.valuePro,
        cityId: this.form.valuecity,
        countyId: this.form.valuearea,
        townId: this.form.valuestree
      }).then((data) => {
      })
    },
    onsearch () {
      if (this.sourceid === 3) {
        this.saveSNDistrict()
      }
      if (this.sourceid === 9 && this.form.valuecity === '') {
        return this.$message.error('请补全地址信息，以便查看商品库存状态')
      }
      this.multipleSelection = []
      this.pageIndex = 1
      this.getsiteSelect()
    },
    getGoodsStatus (item) {
      this.goodsStatus = item
      console.log(this.goodsStatus)
    },
    getoperStatus (item) {
      this.form.operStatusid = item
      this.getsiteSelect()
    },
    getpriceList (item) {
      this.form.priceList = item
    },
    getpriceList1 (item) {
      this.form.priceList1 = item
    },
    getrelationship (item) {
      this.form.relationship = item
    },
    clearfiled () {
      const defaultFormData = {
        productCateId1: '',
        itemName: '',
        productCateId: '',
        profitStart: '',
        profitEnd: '',
        sonProfitStart: '',
        sonProfitEnd: '',
        salePriceStart: '',
        salePriceEnd: '',
        markPriceStart: '',
        markPriceEnd: '',
        supplyPriceStart: '',
        supplyPriceEnd: '',
        distribPriceStart: '',
        distribPriceEnd: '',
        distribProfitStart: '',
        distribProfitEnd: '',
        priceList: '',
        priceList1: '',
        relationship: '',
        operStatusid: '',
        checked: false,
        orderFlag: ''
      }
      return defaultFormData
    },
    selectsource (item) {
      this.multipleSelection = []
      for (let index = 0; index < this.source.length; index++) {
        this.source[index].soureType = false
      }
      this.sourceid = item.type
      this.isXuni = item.isXn
      item.soureType = true
      this.form = Object.assign({}, {}, this.clearfiled())
      console.log(this.form)
      this.pageIndex = 1
      this.goodsStatus = ''
      this.isFirst = true
      this.$refs.addressList.getaddress(1, this.sourceid, '')
    },

    getsiteSelect () {
      this.skuIds = ''
      this.tableData = []
      this.getsiteSelectlist = []
      this.loading = true
      this.$http.queryMySiteProduct({
        siteId: this.siteId,
        advertId: this.advertId === undefined ? 0 : this.advertId, // 专题ID（必填）
        operStatus: this.form.operStatusid, // 商品状态（必填） 3 上架 4 下架
        source: this.sourceid,
        // itemCode: this.form.itemCode,
        itemName: this.form.itemName,
        cateLable: this.cateLable, // 分类一
        cateLevel: this.cateLevel, // 分类二
        cateProduct: this.cateProduct, // 分类三
        profitStart: this.form.profitStart,
        profitEnd: this.form.profitEnd,
        sonProfitStart: this.form.sonProfitStart,
        sonProfitEnd: this.form.sonProfitEnd,
        salePriceStart: this.form.salePriceStart,
        salePriceEnd: this.form.salePriceEnd,
        markPriceStart: this.form.markPriceStart,
        markPriceEnd: this.form.markPriceEnd,
        supplyPriceStart: this.form.supplyPriceStart,
        supplyPriceEnd: this.form.supplyPriceEnd,
        distribPriceStart: this.form.distribPriceStart,
        distribPriceEnd: this.form.distribPriceEnd,
        distribProfitStart: this.form.distribProfitStart,
        distribProfitEnd: this.form.distribProfitEnd,
        relationship: this.form.relationship,
        province: this.form.valuePro,
        city: this.form.valuecity,
        county: this.form.valuearea,
        town: this.form.valuestree,
        stock: this.goodsStatus,
        supplyPrice: this.form.priceList === 'supplyPrice' ? 'supplyPrice' : '',
        markPrice: this.form.priceList === 'markPrice' ? 'markPrice' : '',
        distribPrice: this.form.priceList === 'distribPrice' ? 'distribPrice' : '',
        salePrice: this.form.priceList === 'salePrice' ? 'salePrice' : '',
        supplyPrice1: this.form.priceList1 === 'supplyPrice1' ? 'supplyPrice1' : '',
        markPrice1: this.form.priceList1 === 'markPrice1' ? 'markPrice1' : '',
        distribPrice1: this.form.priceList1 === 'distribPrice1' ? 'distribPrice1' : '',
        salePrice1: this.form.priceList1 === 'salePrice1' ? 'salePrice1' : '',
        orderFlag: this.form.orderFlag,
        supplyId: this.sourceid === 2 ? this.supplyListValue : '',
        page: this.pageIndex,
        limit: this.pageSize,
        type: this.isXuni
      }).then((data) => {
        if (data.code === 0) {
          this.getsiteSelectlist = data.page.list
          this.totalPage = data.page.totalCount
          if (data.page.list.length === 0) {
            this.loading = false
            return false
          }

          for (let index = 0; index < this.getsiteSelectlist.length; index++) {
            this.skuIds += this.getsiteSelectlist[index].itemCode + ','
          }
          this.skuIds = this.skuIds.substring(0, this.skuIds.length - 1)
          if (this.sourceid === 1 || this.sourceid === 3 || this.sourceid === 4) {
            this.loading = false
            for (let j = 0; j < this.getsiteSelectlist.length; j++) {
              this.tableData.push({
                id: this.getsiteSelectlist[j].id,
                url: this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + this.getsiteSelectlist[j].photo : this.getsiteSelectlist[j].photo,
                itemName: this.getsiteSelectlist[j].itemName,
                supplyName: this.getsiteSelectlist[j].supplyName,
                itemCode: this.getsiteSelectlist[j].itemCode,
                productId: this.getsiteSelectlist[j].productId,
                markPrice: parseFloat(this.getsiteSelectlist[j].markPrice).toFixed(2),
                supplyPrice: parseFloat(this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                salePrice: this.getsiteSelectlist[j].salePrice,
                rate: this.getsiteSelectlist[j].rate,
                profitPercent: this.getsiteSelectlist[j].profitPercent,
                distribProfitPercent: this.getsiteSelectlist[j].distribProfitPercent,
                status: this.getsiteSelectlist[j].stockStatus === -1 ? '有货' : '无货',
                operStatus: this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                productNo: this.getsiteSelectlist[j].productNo,
                zcStockNum: this.getsiteSelectlist[j].zcStockNum,
                type: this.getsiteSelectlist[j].type,
                distribPrice: this.getsiteSelectlist[j].distribPrice
              })
            }
            if (this.multipleSelection.length) {
              this.toggleSelection(this.multipleSelection)
            }
          } else if (this.sourceid === 2 && this.isXuni === 1) {
            this.loading = false
            for (let j = 0; j < this.getsiteSelectlist.length; j++) {
              if (this.goodsStatus === -1) {
                if (this.getsiteSelectlist[j].stockNum > 0) {
                  this.tableData.push({
                    id: this.getsiteSelectlist[j].id,
                    url: this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + this.getsiteSelectlist[j].photo : this.getsiteSelectlist[j].photo,
                    itemName: this.getsiteSelectlist[j].itemName,
                    supplyName: this.getsiteSelectlist[j].supplyName,
                    itemCode: this.getsiteSelectlist[j].itemCode,
                    productId: this.getsiteSelectlist[j].productId,
                    markPrice: this.getsiteSelectlist[j].markPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].markPrice).toFixed(2),
                    supplyPrice: this.getsiteSelectlist[j].supplyPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                    salePrice: this.getsiteSelectlist[j].salePrice,
                    profitPercent: this.getsiteSelectlist[j].profitPercent,
                    distribProfitPercent: this.getsiteSelectlist[j].distribProfitPercent,
                    status: this.getsiteSelectlist[j].stockNum,
                    operStatus: this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                    productNo: this.getsiteSelectlist[j].productNo,
                    zcStockNum: this.getsiteSelectlist[j].zcStockNum,
                    type: this.getsiteSelectlist[j].type,
                    distribPrice: this.getsiteSelectlist[j].distribPrice
                  })
                }
              } else {
                this.tableData.push({
                  id: this.getsiteSelectlist[j].id,
                  url: this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + this.getsiteSelectlist[j].photo : this.getsiteSelectlist[j].photo,
                  itemName: this.getsiteSelectlist[j].itemName,
                  supplyName: this.getsiteSelectlist[j].supplyName,
                  itemCode: this.getsiteSelectlist[j].itemCode,
                  productId: this.getsiteSelectlist[j].productId,
                  markPrice: this.getsiteSelectlist[j].markPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].markPrice).toFixed(2),
                  supplyPrice: this.getsiteSelectlist[j].supplyPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                  salePrice: this.getsiteSelectlist[j].salePrice,
                  profitPercent: this.getsiteSelectlist[j].profitPercent,
                  distribProfitPercent: this.getsiteSelectlist[j].distribProfitPercent,
                  status: this.getsiteSelectlist[j].stockNum,
                  operStatus: this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                  productNo: this.getsiteSelectlist[j].productNo,
                  zcStockNum: this.getsiteSelectlist[j].zcStockNum,
                  type: this.getsiteSelectlist[j].type,
                  distribPrice: this.getsiteSelectlist[j].distribPrice
                })
              }
            }
            if (this.multipleSelection.length) {
              this.toggleSelection(this.multipleSelection)
            }
          } else {
            this.getStock(this.skuIds)
          }
        }
      })
    },
    // 库存
    getStock (skuIds) {
      var _this = this
      _this.$http.getStock({
        siteId: _this.siteId,
        source: _this.sourceid,
        skus: skuIds,
        provinceId: _this.form.valuePro,
        cityId: _this.form.valuecity,
        countyId: _this.form.valuearea,
        townId: _this.form.valuestree,
        type: _this.isXuni
      }).then((data) => {
        if (data && data.code === 0) {
          _this.loading = false
          var getStocklist = data.skus
          for (let i = 0; i < getStocklist.length; i++) {
            for (let j = 0; j < _this.getsiteSelectlist.length; j++) {
              if (getStocklist[i].skuId === _this.getsiteSelectlist[j].itemCode) {
                if (_this.goodsStatus === -1) {
                  if (getStocklist[i].status === '1') {
                    _this.tableData.push({
                      id: _this.getsiteSelectlist[j].id,
                      url: _this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + _this.getsiteSelectlist[j].photo : _this.getsiteSelectlist[j].photo,
                      itemName: _this.getsiteSelectlist[j].itemName,
                      supplyName: _this.getsiteSelectlist[j].supplyName,
                      itemCode: _this.getsiteSelectlist[j].itemCode,
                      productId: _this.getsiteSelectlist[j].productId,
                      markPrice: _this.getsiteSelectlist[j].markPrice.toFixed(2),
                      supplyPrice: _this.getsiteSelectlist[j].supplyPrice.toFixed(2),
                      salePrice: _this.getsiteSelectlist[j].salePrice,
                      profitPercent: _this.getsiteSelectlist[j].profitPercent,
                      distribProfitPercent: _this.getsiteSelectlist[j].distribProfitPercent,
                      status: getStocklist[i].status === '1' ? '有货' : '无货',
                      operStatus: _this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                      productNo: _this.getsiteSelectlist[j].productNo,
                      isSelect: false,
                      zcStockNum: _this.getsiteSelectlist[j].zcStockNum,
                      type: _this.getsiteSelectlist[j].type,
                      distribPrice: _this.getsiteSelectlist[j].distribPrice
                    })
                  }
                } else {
                  _this.tableData.push({
                    id: _this.getsiteSelectlist[j].id,
                    url: _this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + _this.getsiteSelectlist[j].photo : _this.getsiteSelectlist[j].photo,
                    itemName: _this.getsiteSelectlist[j].itemName,
                    supplyName: _this.getsiteSelectlist[j].supplyName,
                    itemCode: _this.getsiteSelectlist[j].itemCode,
                    productId: _this.getsiteSelectlist[j].productId,
                    markPrice: _this.getsiteSelectlist[j].markPrice.toFixed(2),
                    supplyPrice: _this.getsiteSelectlist[j].supplyPrice.toFixed(2),
                    salePrice: _this.getsiteSelectlist[j].salePrice,
                    profitPercent: _this.getsiteSelectlist[j].profitPercent,
                    distribProfitPercent: _this.getsiteSelectlist[j].distribProfitPercent,
                    status: getStocklist[i].status === '1' ? '有货' : '无货',
                    operStatus: _this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                    productNo: _this.getsiteSelectlist[j].productNo,
                    zcStockNum: _this.getsiteSelectlist[j].zcStockNum,
                    type: _this.getsiteSelectlist[j].type,
                    isSelect: false,
                    distribPrice: this.getsiteSelectlist[j].distribPrice
                  })
                }
              }
            }
          }
        } else {
          for (let k = 0; k < _this.getsiteSelectlist.length; k++) {
            _this.getsiteSelectlist[k].status = ''
            _this.getsiteSelectlist[k].operStatus = _this.getsiteSelectlist[k].operStatus === '3' ? '上架' : '下架'
          }
          _this.tableData = _this.getsiteSelectlist
        }
        if (this.multipleSelection.length) {
          this.toggleSelection(this.multipleSelection)
        }
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getsiteSelect()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getsiteSelect()
    },
    getGoodsInfo () {
    },
    getSort (type) {
      console.log(type)
      this.pageIndex = 1
      this.getsiteSelect()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeTableSort (column, prop, order) {
      // ascending 表示升序，descending 表示降序，null 表示还原为原始顺序
      // console.log(column.prop); //prop标签 => nickname
      if (this.isFirstTrue === true) {
        this.isFirstTrue = false
        return false
      }
      if (column.prop === 'supplyPrice' && column.order === 'ascending') {
        this.form.orderFlag = 'a.supply_price asc'
      } else if (column.prop === 'supplyPrice' && column.order === 'descending') {
        this.form.orderFlag = 'a.supply_price desc'
      } else if (column.prop === 'profitPercent' && column.order === 'ascending') {
        this.form.orderFlag = 'a.profit_percent asc'
      } else if (column.prop === 'profitPercent' && column.order === 'descending') {
        this.form.orderFlag = 'a.profit_percent desc'
      }
      this.pageIndex = 1
      this.multipleSelection = []
      this.getsiteSelect()
      // console.log(column.order);//descending降序、ascending升序
    }
    // onSubmit () {
    //   this.showWebsite = false
    //   this.$emit('multipleSelection', this.multipleSelection)
    // }
  },
  components: {
    // ClassificationMyGoods,
    AddressListGoods,
    Classification
  }
}
</script>
