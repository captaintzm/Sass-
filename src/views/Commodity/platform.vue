<template>
  <div class="wapper">
    <div
      class="site-content"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="searchBlock">
        <ul class="navsourse">
          <li
            :class="{'active':item.soureType==true}"
            v-for="(item ,index) in source"
            :key="index"
            @click="selectsource(item)"
          >
            <img :src="item.src" />
            {{item.name}}
          </li>
        </ul>
        <div v-show="sourceid!=10">
          <div class="searchPannel">
            <el-form ref="form" :model="form" label-width="80px" size="medium">
              <el-form-item label="供应价" class="formItem">
                <el-input v-model="form.supplyPriceStart" placeholder="最低" class="fipt"></el-input>
                <span>-</span>
                <el-input v-model="form.supplyPriceEnd" placeholder="最高" class="fipt"></el-input>
              </el-form-item>
              <el-form-item label="市场价" class="formItem">
                <el-input v-model="form.markPriceStart" placeholder="最低" class="fipt"></el-input>
                <span>-</span>
                <el-input v-model="form.markPriceEnd" placeholder="最高" class="fipt"></el-input>
              </el-form-item>
              <el-form-item label="利润率" class="formItem">
                <el-input v-model="form.profitStart" placeholder="最低" class="fipt"></el-input>
                <span>-</span>
                <el-input v-model="form.profitEnd" placeholder="最高" class="fipt"></el-input>
              </el-form-item>
              <el-form-item label="商品" class="formItem">
                <el-input v-model="form.itemName" placeholder="名称或SKU" class="fipt"></el-input>
                <!-- <el-input v-model="form.itemCode" placeholder="SKU" class="fipt ml5"></el-input> -->
              </el-form-item>
              <el-form-item label="分类" class="formItem">
                <Classification
                  ref="classificate"
                  @getCateId1="getCateId1"
                  @getCateId2="getCateId2"
                  @getCateId3="getCateId3"
                ></Classification>
                <!-- <Classification
                  ref="classificate"
                  @getCateId1="getCateId1"
                  @getCateId2="getCateId2"
                  @getCateId3="getCateId3"
                ></Classification>-->
              </el-form-item>
              <el-form-item label="供应商" class="formItem" v-show="sourceid==2">
                <el-select v-model="supplyListValue" class="w140" placeholder="请选择">
                  <el-option label="全部" value></el-option>
                  <el-option
                    :label="item.supplyName"
                    :value="item.supplyId"
                    v-for="(item,index) in getSupplyList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地区" class="formItem" v-show="sourceid!=2">
                <AddressListGoods
                  ref="addressList"
                  @mallSiteDistrict="mallSiteList"
                  :source="sourceid"
                ></AddressListGoods>
              </el-form-item>
              <el-form-item class="formItem ml0">
                <el-checkbox v-model="form.checked">仅看有货</el-checkbox>
              </el-form-item>
              <el-form-item class="formItem ml0">
                <!-- <el-button type="primary" @click="onsearch">搜索</el-button>
                <el-button type="primary" @click="onSubmit">批量添加</el-button>-->
              </el-form-item>
            </el-form>
            <el-row style="padding:0 20px">
              <el-button type="primary" size="small" @click="onsearch">搜索</el-button>
              <el-button type="primary" size="small" @click="onSubmit">批量添加</el-button>
              <!--<el-button type="primary" size="small" @click="onAdd">SKU批量添加</el-button> -->
              <el-button
                type="text"
                size="small"
                v-if="this.multipleSelection.length>0"
              >您已经选了{{this.multipleSelection.length}}个商品</el-button>
              <!-- <el-button type="primary">批量移除</el-button> -->
              <!-- <el-button type="primary" size="small">导出</el-button> -->
            </el-row>
          </div>
          <div class="searchTable" style="width: 100%">
            <div class="tablescroll">
              <el-table
                height="600"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;overflow: hidden;"
                :header-cell-style="{color:'#333',background:'#F5F7FA'}"
                @select="select"
                @select-all="selectAll"
              >
                <!--   -->
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column prop="itemName" label="商品名称" width="250">
                  <template slot-scope="scope">
                    <div @click="siteproductQuery(scope.row)" style="cursor:pointer">
                      <img :src="scope.row.url" width="70" height="70" />
                      <div class="scopepannel">{{scope.row.itemName}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="supplyName" label="供应商"></el-table-column>
                <el-table-column align="center" prop="itemCode" label="商品编码"></el-table-column>
                <el-table-column align="center" prop="markPrice" label="市场价">
                  <template slot-scope="scope">
                    <el-button
                      @click="openUrl(scope.row.itemCode)"
                      type="text"
                      size="small"
                      v-show="sourceid==1"
                    >查看实时价</el-button>
                    <div>{{scope.row.markPrice}}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="supplyPrice" label="供应价"></el-table-column>
                <!-- <el-table-column prop="distributionPrice" label="分销价" ></el-table-column> -->
                <!-- <el-table-column prop="rate" label="市场利润率(%)"></el-table-column> -->
                <el-table-column
                  prop="rate"
                  align="center"
                  width="150"
                  label="市场利润率(%)"
                  :render-header="renderTabHeader"
                ></el-table-column>
                <el-table-column align="center" prop="status" label="库存状态"></el-table-column>
                <el-table-column prop="states" label="操作" width="100">
                  <template slot-scope="scope">
                    <div class="btnStatus">
                      <el-button @click="edit(scope.row)" type="text" size="small">加入商品池</el-button>
                      <el-button @click="siteproductQuery(scope.row)" type="text" size="small">详情</el-button>
                    </div>
                  </template>
                </el-table-column>
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
        <div v-show="sourceid==10">
          <el-tag type="info" class="eltag">
            <i class="el-icon-caret-right"></i>可将这些精选的专题一键添加到您的商城内，也可以导出SKU后添加部分商品，让您更快速、精准的运营商品
          </el-tag>
          <div class="marketingAct">
            <ul>
              <li class="actItem" v-for="(item,index) in siteList" :key="index">
                <span class="icon-Offline" v-if="item.isUsable==0"></span>
                <div class="ewm" v-show="item.select==true">
                  <div :id="'qrcode'+item.id" class="qrcodeitem"></div>
                </div>
                <div class="actImg">
                  <img :src="item.photo" alt />
                </div>
                <div class="details">
                  <h3>{{item.name}}</h3>
                  <!-- <p class="detailstxt">{{item.mallInstruction}}&nbsp;&nbsp;</p> -->
                  <h4>预设商品{{item.itemsCount}}款</h4>
                  <p>价格区间：{{item.priceMin}}~{{item.priceMax}} ，利润率范围：{{item.profitMin}}~{{item.profitMax}}</p>
                  <p class="detailsfenl">
                    商品分类：
                    <span
                      v-for="(itemA,index) in item.countMaplist"
                      :key="index"
                    >{{itemA.name}}({{itemA.num}}) 、</span>
                  </p>
                </div>
                <div class="actBtnlist">
                  <el-button type="primary" plain @click="lookGoods(item)" class="actBtn">查看商品</el-button>
                  <el-button type="primary" plain @click="chioceTopic(item)" class="actBtn">选择专题</el-button>
                  <el-button type="primary" plain @click="importSku(item)" class="actBtn">导出SKU</el-button>
                </div>
                <div
                  class="loading"
                  v-if="item.selectStatus==true"
                  v-loading="loading"
                  element-loading-text="预计耗时1分钟，请耐心等待哦~"
                ></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title :visible.sync="isshowtime" v-model="isshowtime" width="300px">
      <el-form :model="showtime" label-width="80px">
        <el-form-item label="实时价:" class="formItem">
          {{showtime.salePrice}}元 &nbsp;&nbsp;&nbsp;
          <el-button type="text" @click="openUrl(showtime.url)">跳转到渠道</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title :visible.sync="showWebsite" v-model="showWebsite" width="400px">
      <el-form :model="formprice" label-width="80px">
        <el-form-item label="销售价" class="formItem">
          <el-input
            v-model="formprice.salePrice"
            class="fipt"
            style="width:200px"
            @blur="checkPrice"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="showWebsite=false">取消</el-button>
          <!-- <el-button type="primary" v-if="flagClick==2" :class="{'on':flagClick==2}">确认</el-button> -->
          <el-button type="primary" @click="beforeClose" :disabled="disabled">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="改价"
      :visible.sync="showAllWebsite"
      width="700px"
      :closeOnClickModal="false"
      class="changePrice"
    >
      <el-form :model="formchangePrice">
        <el-form-item label="分销价">
          <span style="font-size:12px;">作为您与客户结算的价格，商城账户余额按照此价格扣除</span>
          <br />
          <el-radio-group
            v-model="formchangePrice.distribPrice.distribPriceWay"
            @change="getpriceWay"
          >
            <el-radio label="adjust" class="radioItem">
              按照
              <el-select
                v-model="formchangePrice.distribPrice.gyj"
                placeholder="请选择"
                class="fipt w90"
                @change="getpriceTypedistribPrice"
              >
                <el-option
                  v-for="item in formchangePrice.distribPrice.gyjlist"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>

              <el-select
                v-model="formchangePrice.distribPrice.distribPriceAdjust"
                placeholder="请选择"
                class="fipt w90"
              >
                <el-option
                  v-for="item in formchangePrice.distribPrice.gyjStatelist"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="formchangePrice.distribPrice.distribPriceVal"
                placeholder="输入值"
                class="fipt mr5"
              ></el-input>
              <el-select
                v-model="formchangePrice.distribPrice.distribPriceUnit"
                placeholder="请选择"
                class="fipt w90"
              >
                <el-option
                  v-for="item in formchangePrice.distribPrice.priceUnitlist"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-radio>
            <br />
            <el-radio label="eq" class="radioItem">
              等于
              <el-select
                v-model="formchangePrice.distribPrice.gyj1"
                placeholder="请选择"
                class="fipt w90"
                @change="getpriceTypedistribPrice1"
              >
                <el-option
                  v-for="item in formchangePrice.distribPrice.gyjlist1"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
          <!-- <br />
          <el-checkbox v-model="formchangePrice.distribPrice.distribPriceEqFlag">不改变分销价</el-checkbox>-->
        </el-form-item>
        <el-form-item label="销售价">
          <span style="font-size:12px;">商城对用户的价格，如需将商城交付给客户，则建议将销售价设置为等于市场价</span>
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
              <el-input v-model="formchangePrice.priceVal" placeholder="输入值" class="fipt mr5"></el-input>
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
            <br />
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
          <!-- <br />
          <el-checkbox v-model="formchangePrice.priceEqFlag">不改变销售价</el-checkbox>-->
        </el-form-item>

        <el-form-item label="是否上架">
          <span style="font-size:12px;">选择不上架，商品依然将挑选至该站点，但是上架状态为未上架，需再次上架后，用户才可见</span>
          <br />
          <el-radio-group v-model="formchangePrice.operStatus" @change="getpriceWay">
            <el-radio label="3" class="radioItem">直接上架</el-radio>
            <el-radio label="4" class="radioItem">暂不上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="reselectSite">重新选择站点</el-button>
          <el-button @click="showAllWebsite=false">取消</el-button>
          <el-button type="primary" @click="getbatchPrePick" :disabled="disabled">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="isshowSku" width="700px" :closeOnClickModal="false">
      <el-form :model="showSku">
        <el-form-item label style="color:#E6A23C">
          <i class="el-icon-warning"></i> &nbsp;如下商品SKU在对应商城内已存在，不可重复添加
        </el-form-item>
        <el-form-item label>{{showSku.showSkulist}}</el-form-item>
      </el-form>
    </el-dialog>
    <LookDetail ref="lookDetail"></LookDetail>
    <SkuBatchSelect ref="skuSelect" @setSkuList="getSkuList" />
    <SelectSites ref="selectSiteslist" @getsiteIds="setSiteIds"></SelectSites>
    <el-dialog
      title="选择站点"
      :visible.sync="isChioceShow"
      width="400px"
      heigth="450px"
      :closeOnClickModal="true"
      class="elDialogOpemlist"
    >
      确定后既可将该专题添加到该商城内
      <div class="creatsite">
        <el-radio-group v-model="radioGroup">
          <el-radio
            :label="item.id"
            v-for="(item,index) in siteLists"
            :key="index"
            class="radioGroupitem"
          >{{item.siteName}}</el-radio>
        </el-radio-group>
      </div>
      <div style="text-align:right" class="divbtn">
        <el-button @click="isChioceShow=false">取消</el-button>
        <el-button @click="getsite(1)">确认并去配置</el-button>
        <el-button type="primary" @click="getsite(2)" :disabled="disabled">确认并继续选择</el-button>
      </div>
    </el-dialog>
    <!-- 查看专题 -->
    <TopicGoods ref="topicGoods" v-if="isTopicShow"></TopicGoods>
  </div>
</template>
<script>
import SkuBatchSelect from '@/components/common/SkuBatchSelect'
import LookDetail from '@/components/common/LookDetail'
import AddressListGoods from '@/components/common/AddressListGoods'
import Classification from '@/components/Classification/Classification'
import SelectSites from '@/components/common/SelectSites'
import TopicGoods from '@/components/common/TopicGoods'
export default {
  name: 'index',
  components: {
    AddressListGoods,
    Classification,
    LookDetail,
    SkuBatchSelect,
    SelectSites,
    TopicGoods
  },
  data () {
    return {
      isTopicShow: true,
      isChioceShow: false,
      radioGroup: '',
      siteList: [],
      siteLists: [],
      showSku: {
        showSkulist: []
      },
      isshowSku: false,
      disabled: false,
      isshowtime: false,
      showtime: {
        salePrice: '',
        url: ''
      },
      formchangePrice: {
        resource: 'adjust',
        gyj: 'supplyPrice',
        gyjlist: [
          {
            name: '供应价',
            value: 'supplyPrice'
          },
          {
            name: '市场价',
            value: 'markPrice'
          }],
        gyj1: 'markPrice',
        gyjlist1: [
          {
            name: '市场价',
            value: 'markPrice'
          },
          {
            name: '供应价',
            value: 'supplyPrice'
          }
        ],
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
        ],
        priceEqFlag: false, // 销售价是否不变 eq/uneq  false:eq  true:uneq
        distribPrice: {
          gyj: 'supplyPrice',
          gyjlist: [
            {
              name: '供应价',
              value: 'supplyPrice'
            },
            {
              name: '市场价',
              value: 'markPrice'
            }],
          gyj1: 'supplyPrice',
          gyjlist1: [
            {
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
          distribPriceWay: 'adjust', // 按照/等于 adjust/eq
          distribPriceType: 'supplyPrice',  // 供应价/市场价 supplyPrice / markPrice
          distribPriceAdjust: 'incr', // 上调或下降 incr / desc
          distribPriceVal: '0', // 输入值
          distribPriceUnit: 'profit', // 价格单位 rmb / profit
          priceUnitlist: [
            {
              name: '%',
              value: 'profit'
            },
            {
              name: '元',
              value: 'rmb'
            }
          ],
          distribPriceEqFlag: false // 分销价是否不变 eq/uneq  false:eq  true:uneq
        },
        operStatus: '3'
      },
      formprice: {
        salePrice: ''
      },
      siteIds: '',
      showWebsite: false,
      showAllWebsite: false,
      pageIndex: 1,
      pageSize: 50,
      totalPage: 0,
      form: {
        // itemCode: '',
        itemName: '',
        profitStart: '',
        profitEnd: '',
        salePriceStart: '',
        salePriceEnd: '',
        markPriceStart: '',
        markPriceEnd: '',
        supplyPriceStart: '',
        supplyPriceEnd: '',
        relationship: '',
        valuePro: '',
        valuecity: '',
        valuearea: '',
        valuestree: '',
        operStatusid: 3,
        checked: false,
        sheng: '',
        shi: '',
        qu: '',
        jie: ''
      },
      supplyListValue: '',
      getSupplyList: [],
      address: [],
      city: [],
      area: [],
      stree: [],
      tableData: [],
      operStatus: '上架',
      source: [
        {
          type: 1,
          name: '京东',
          soureType: true,
          isXn: 1,
          src: require('./img/jd.png')
        },
        {
          type: 3,
          name: '苏宁易购',
          soureType: false,
          isXn: 1,
          src: require('./img/sn.png')
        },
        {
          type: 4,
          name: '网易严选',
          soureType: false,
          isXn: 1,
          src: require('./img/yx.png')
        },
        {
          type: 9,
          name: '小米有品',
          soureType: false,
          isXn: 1,
          src: require('./img/xm.png')
        },
        {
          type: 102,
          name: '平台供应商',
          soureType: false,
          isXn: 1,
          src: require('./img/ybt.png')
        },
        {
          type: 7,
          name: '平台虚拟商品',
          soureType: false,
          isXn: 1,
          src: require('./img/xn.png')
        },
        {
          type: 2,
          name: '自有供应商',
          soureType: false,
          isXn: 1,
          src: require('./img/zy.png')
        },
        {
          type: 2,
          name: '自有虚拟商品',
          soureType: false,
          isXn: 3,
          src: require('./img/zy.png')
        }
      ],
      isXuni: 1,
      sourceid: 1, // 默认为1 1 京东 3 苏宁易购 4 欧菲斯
      parentId: 0,
      type: 1,
      skuIds: '',
      multipleSelection: [],
      salePrice: '',
      txgoods: '',
      flag: false,
      loading: false,
      cateLable: '', // 分类一
      cateLevel: '', // 分类二
      cateProduct: '', // 分类三
      flagClick: 1,
      isFirst: true,
      hideFlag: '',
      roleType: ''

    }
  },

  watch: {
    isshowtime () {
      this.formprice.salePrice = ''
      this.formprice.url = ''
      if (this.isshowtime === false) {
        this.getsiteSelect()
      }
    }
  },
  created () {
    this.roleType = Number(localStorage.getItem('roleType'))
    this.getsiteSelectlist = []
    if (this.roleType === 1) {
      var item = {
        type: 10,
        name: '精选专题',
        soureType: false,
        isXn: 1
      }
      this.source.splice(0, 0, item)
      for (let index = 0; index < this.source.length; index++) {
        const element = this.source[index]
        element.soureType = false
        if (element.type === 10) {
          element.soureType = true
        }
      }
      this.sourceid = 10
      this.choiceAdvertList()
      this.getTotalSite()
    }
    this.querySupplyList()
    this.chioceadvertId = ''
    this.chioceorgId = ''
    this.chiocesiteId = ''
  },
  methods: {
    getsite (type) {
      if (this.radioGroup === '') {
        return this.$message.error('请选择一个站点')
      }
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/site/siteadvert/copyAdvert'),
        method: 'post',
        data: this.$http.adornData({
          advertId: this.chioceadvertId,
          orgId: localStorage.getItem('orgId'),
          siteId: this.radioGroup
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.$message.success('添加成功')
          this.choiceAdvertList()
          this.isChioceShow = false
          if (type === 1) {
            localStorage.setItem('pageSiteId', this.radioGroup)
            localStorage.setItem('siteType', 1)
            window.open(location.origin + '/frontend-vis/#/special/index', '_blank')
          }
        } else {
          this.$message.error(res.data.msg)
        }
        this.disabled = false
      })
    },
    // 查看商品
    lookGoods (item) {
      this.$refs.topicGoods.inint(item)
    },
    // 选择专题
    chioceTopic (item) {
      this.isChioceShow = true
      this.chioceadvertId = item.id
    },
    // 导出SKU
    importSku (item) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/site/siteadvert/exportProducts'),
        method: 'post',
        responseType: 'arraybuffer',
        data: this.$http.adornData(
          {
            advertId: item.id
          }, true)
      }).then((res) => {
        if (res) {
          let blob = new Blob([res.data], {
            type: 'application/x-xls',
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = item.name + '.xls'
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
        }
      })
    },
    getTotalSite () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/site/siteadvert/getTotalSite'),
        method: 'post',
        data: this.$http.adornData({
          orgId: localStorage.getItem('orgId')
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.siteLists = res.data.obj
        }
      })
    },
    choiceAdvertList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/site/siteadvert/choiceAdvertList'),
        method: 'post',
        data: this.$http.adornData({
          orgId: localStorage.getItem('orgId')
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          for (let index = 0; index < res.data.obj.length; index++) {
            const item = res.data.obj[index]
            item.countMaplist = []
            for (let i in item.countMap) {
              item.countMaplist.push({
                name: i,
                num: item.countMap[i]
              })
            }
          }
          this.siteList = res.data.obj
        }
      })
    },
    clearfiled () {
      const defaultFormData = {
        itemName: '',
        profitStart: '',
        profitEnd: '',
        salePriceStart: '',
        salePriceEnd: '',
        markPriceStart: '',
        markPriceEnd: '',
        supplyPriceStart: '',
        supplyPriceEnd: '',
        relationship: '',
        operStatusid: 3,
        checked: false
      }
      return defaultFormData
    },
    querySupplyList () {
      this.getSupplyList = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/querySupplyList'),
        method: 'post',
        data: this.$http.adornData({
          orgId: localStorage.getItem('orgId')
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.getSupplyList = res.data.obj
        }
      })
    },
    // 选中table已有数据
    toggleSelectionA (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$nextTick(() => {
            var checked = this.tableData.find(
              tableRow => tableRow.id === row.id
            )
            this.$refs.multipleTable.toggleRowSelection(checked)
          })
        })
        this.addRows([rows])
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 表格单选事件
    select (selection, row) {
      let allRows = selection.filter(item => !!item)
      // 根据表格单选事件确定取消是取消了哪一行
      if (allRows.find(item => item.id === row.id)) {
        // 选中新增一行
        this.addRows([row])
      } else {
        // 取消删除一行
        this.removeRows([row])
      }
      console.log(this.multipleSelection)
    },
    // 表格全选事件
    selectAll (selection) {
      console.log(selection)
      // 如果有则是全选否则就是全取消
      if (selection.length > 0) {
        this.addRows(this.tableData)
      } else {
        this.removeRows(this.tableData)
      }
      // console.log(this.multipleSelection)
    },
    // 添加选中行
    addRows (rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        if (
          !this.multipleSelection.find(
            item => item.id === key.id
          )
        ) {
          this.multipleSelection.push(key)
        }
      }
    },
    // 取消选中行
    removeRows (rows) {
      if (this.multipleSelection.length > 0) {
        for (let row of rows) {
          this.multipleSelection = this.multipleSelection.filter(item => item.id !== row.id)
        }
      }
    },

    getSkuList () {
      this.multipleSelection = []
      this.getsiteSelect()
    },
    openUrl (id) {
      window.open('https://item.jd.com/' + id + '.html', '_blank')
      // this.isshowtime = false
    },
    // 查看时时价
    lookPrice (item) {
      // this.isshowtime = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/realPrice'),
        method: 'post',
        data: this.$http.adornData({
          productNo: item.productNo
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.showtime.salePrice = ''
          this.showtime.salePrice = res.data.realPrice.mark_price
          this.showtime.url = res.data.realPrice.item_code
          this.openUrl(this.showtime.url)
        }
      })
    },
    renderTabHeader (h, { column, $index }, index) {
      return [h(
        'el-tooltip',
        {
          props: {
            effect: 'light',
            content: '市场利润率=（市场价-供应价）/市场价',
            placement: 'top'
          }
        },
        [
          h('span', {
            class: {
              'tip_icon': true
            }
          })
        ]
      ),
        '市场利润率(%)'

      ]
    },

    siteproductQuery (item) {
      if (this.sourceid === 2) {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/product/product/getDetailByProductNo'),
          method: 'post',
          data: this.$http.adornData({
            productNo: item.productNo
          }, true)
        }).then((res) => {
          if (res && res.data.code === 0) {
            if (res.data.productNo == null) {
              this.$message.error('没有查询到商品信息')
              return false
            }
            this.$refs.lookDetail.showProDetail = true
            this.$refs.lookDetail.type = 'gyj'
            this.$refs.lookDetail.salePrice = item.supplyPrice
            this.$refs.lookDetail.getInt(res.data.productNo, this.sourceid, item.status)
          }
        })
      } else {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/product/siteproduct/query'),
          method: 'post',
          data: this.$http.adornData({
            productNo: item.productNo
          }, true)
        }).then((res) => {
          if (res && res.data.code === 0) {
            if (res.data.productNo.code === 500) {
              this.$message.error(res.data.productNo.msg)
              return false
            }
            this.$refs.lookDetail.showProDetail = true
            this.$refs.lookDetail.type = 'gyj'
            this.$refs.lookDetail.salePrice = item.supplyPrice
            this.$refs.lookDetail.getInt(res.data.productNo.productDetail, this.sourceid, item.status)
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

    getCateId1 (id) {
      this.cateLable = id // 分类一
    },
    getCateId2 (id) {
      this.cateLevel = id // 分类二
    },
    getCateId3 (id) {
      this.cateProduct = id // 分类三
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
    getpriceTypedistribPrice1 (event) {
      this.formchangePrice.distribPrice.distribPriceType = event
    },
    getpriceTypedistribPrice (event) {
      this.formchangePrice.distribPrice.distribPriceType = event
    },
    checkPrice () {
      this.formprice.salePrice = this._.checkToNumA(this.formprice.salePrice)
    },
    beforeClose () {
      if (this.formprice.salePrice === '') {
        return this.$message.error('请填写销售价')
      }
      this.disabled = true

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/prePick'),
        method: 'post',
        data: this.$http.adornData({
          source: this.sourceid,
          productId: this.txgoods.id,
          salePrice: this.formprice.salePrice
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.showWebsite = false
          // this.pageIndex = 1
          this.getsiteSelect()
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },

    onsearch () {
      if (this.sourceid === 9 && this.form.valuecity === '') {
        return this.$message.error('请补全地址信息，以便查看商品库存状态')
      }
      this.multipleSelection = []
      this.pageIndex = 1
      this.getsiteSelect()
    },

    getoperStatus (item) {
      this.form.operStatusid = item
      this.getsiteSelect()
    },
    getrelationship (item) {
      this.form.relationship = item
    },
    selectsource (item) {
      this.multipleSelection = []
      for (let index = 0; index < this.source.length; index++) {
        this.source[index].soureType = false
      }
      item.soureType = true
      this.sourceid = item.type
      this.isXuni = item.isXn
      if (this.sourceid === 10) {
        this.choiceAdvertList()
      } else {
        this.form = Object.assign({}, {}, this.clearfiled())
        console.log(this.form)
        this.pageIndex = 1
        this.isFirst = true
        this.$refs.addressList.getaddress(1, this.sourceid, '')
      }
      // this.getsiteSelect()
    },

    getsiteSelect () {
      this.skuIds = ''
      this.loading = true
      this.tableData = []
      this.getsiteSelectlist = []
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/queryProductList'),
        method: 'post',
        data: this.$http.adornData({
          // siteId: this._pageSiteId,
          source: this.sourceid,
          itemName: this.form.itemName,
          cateLable: this.cateLable, // 分类一
          cateLevel: this.cateLevel, // 分类二
          cateProduct: this.cateProduct, // 分类三
          profitStart: this.form.profitStart,
          profitEnd: this.form.profitEnd,
          markPriceStart: this.form.markPriceStart,
          markPriceEnd: this.form.markPriceEnd,
          supplyPriceStart: this.form.supplyPriceStart,
          supplyPriceEnd: this.form.supplyPriceEnd,
          province: this.form.valuePro,
          city: this.form.valuecity,
          county: this.form.valuearea,
          town: this.form.valuestree,
          stock: this.form.checked === true ? '-1' : '',
          supplyId: this.sourceid === 2 ? this.supplyListValue : '',
          page: this.pageIndex,
          limit: this.pageSize,
          type: this.isXuni
        }, true)
      }).then((res) => {
        if (res.data.code === 0) {
          this.getsiteSelectlist = res.data.page.list
          if (res.data.page.list.length === 0) {
            this.loading = false
            return false
          }
          this.totalPage = res.data.page.totalCount
          for (let index = 0; index < this.getsiteSelectlist.length; index++) {
            this.skuIds += this.getsiteSelectlist[index].itemCode + ','
          }
          this.skuIds = this.skuIds.substring(0, this.skuIds.length - 1)
          // 1，京东；2，自有供应商
          if (this.sourceid === 1 || this.sourceid === 3 || this.sourceid === 4) {
            this.loading = false
            for (let j = 0; j < this.getsiteSelectlist.length; j++) {
              this.tableData.push({
                id: this.getsiteSelectlist[j].id,
                url: this.getsiteSelectlist[j].photoUrl,
                itemName: this.getsiteSelectlist[j].itemName,
                supplyName: this.getsiteSelectlist[j].supplyName,
                itemCode: this.getsiteSelectlist[j].itemCode,
                markPrice: parseFloat(this.getsiteSelectlist[j].markPrice).toFixed(2),
                supplyPrice: parseFloat(this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                salePrice: this.getsiteSelectlist[j].salePrice,
                rate: this.getsiteSelectlist[j].rate,
                status: this.getsiteSelectlist[j].stockStatus === -1 ? '有货' : '无货',
                operStatus: this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                productNo: this.getsiteSelectlist[j].productNo
              })
            }
            if (this.multipleSelection.length) {
              this.toggleSelection(this.multipleSelection)
            }
          } else if (this.sourceid === 2 && this.isXuni === 1) {
            this.loading = false
            for (let j = 0; j < this.getsiteSelectlist.length; j++) {
              if (this.form.checked === true) {
                if (this.getsiteSelectlist[j].stockNum > 0) {
                  this.tableData.push({
                    id: this.getsiteSelectlist[j].id,
                    url: this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + this.getsiteSelectlist[j].photo : this.getsiteSelectlist[j].photo,
                    itemName: this.getsiteSelectlist[j].itemName,
                    supplyName: this.getsiteSelectlist[j].supplyName,
                    itemCode: this.getsiteSelectlist[j].itemCode,
                    markPrice: this.getsiteSelectlist[j].markPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].markPrice).toFixed(2),
                    supplyPrice: this.getsiteSelectlist[j].supplyPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                    salePrice: this.getsiteSelectlist[j].salePrice,
                    rate: this.getsiteSelectlist[j].profitPercent,
                    status: this.getsiteSelectlist[j].stockNum,
                    operStatus: this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                    productNo: this.getsiteSelectlist[j].productNo
                  })
                }
              } else {
                this.tableData.push({
                  id: this.getsiteSelectlist[j].id,
                  url: this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + this.getsiteSelectlist[j].photo : this.getsiteSelectlist[j].photo,
                  itemName: this.getsiteSelectlist[j].itemName,
                  supplyName: this.getsiteSelectlist[j].supplyName,
                  itemCode: this.getsiteSelectlist[j].itemCode,
                  markPrice: this.getsiteSelectlist[j].markPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].markPrice).toFixed(2),
                  supplyPrice: this.getsiteSelectlist[j].supplyPrice === null ? '' : parseFloat(this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                  salePrice: this.getsiteSelectlist[j].salePrice,
                  rate: this.getsiteSelectlist[j].profitPercent,
                  status: this.getsiteSelectlist[j].stockNum,
                  operStatus: this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                  productNo: this.getsiteSelectlist[j].productNo
                })
              }
            }
            if (this.multipleSelection.length) {
              this.toggleSelection(this.multipleSelection)
            }
          } else {
            this.getStock(this.skuIds)
          }
        } else {
          this.loading = false
          this.$message.error(res.data.msg)
        }
      })
    },
    // 库存
    getStock (skuIds) {
      var _this = this
      _this.tableData = []
      // ybt-backend/product/product/getStock
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/product/getStock'),
        method: 'post',
        data: this.$http.adornData({
          source: _this.sourceid,
          skus: skuIds,
          provinceId: _this.form.valuePro,
          cityId: _this.form.valuecity,
          countyId: _this.form.valuearea,
          townId: _this.form.valuestree,
          type: this.isXuni
        }, true)
      }).then((res) => {
        _this.loading = false
        if (res && res.data.code === 0) {
          var getStocklist = res.data.skus
          for (let i = 0; i < getStocklist.length; i++) {
            for (let j = 0; j < _this.getsiteSelectlist.length; j++) {
              if (getStocklist[i].skuId === _this.getsiteSelectlist[j].itemCode) {
                if (_this.form.checked === true) {
                  if (getStocklist[i].status === '1') {
                    _this.tableData.push({
                      id: _this.getsiteSelectlist[j].id,
                      url: _this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + _this.getsiteSelectlist[j].photo : _this.getsiteSelectlist[j].photo,
                      itemName: _this.getsiteSelectlist[j].itemName,
                      supplyName: _this.getsiteSelectlist[j].supplyName,
                      itemCode: _this.getsiteSelectlist[j].itemCode,
                      markPrice: parseFloat(_this.getsiteSelectlist[j].markPrice).toFixed(2),
                      supplyPrice: parseFloat(_this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                      salePrice: _this.getsiteSelectlist[j].salePrice,
                      rate: _this.getsiteSelectlist[j].rate,
                      status: getStocklist[i].status === '1' ? '有货' : '无货',
                      operStatus: _this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                      productNo: this.getsiteSelectlist[j].productNo
                    })
                  }
                } else {
                  _this.tableData.push({
                    id: _this.getsiteSelectlist[j].id,
                    url: _this.sourceid === 1 ? 'http://img13.360buyimg.com/n1/' + _this.getsiteSelectlist[j].photo : _this.getsiteSelectlist[j].photo,
                    itemName: _this.getsiteSelectlist[j].itemName,
                    supplyName: _this.getsiteSelectlist[j].supplyName,
                    itemCode: _this.getsiteSelectlist[j].itemCode,
                    markPrice: parseFloat(_this.getsiteSelectlist[j].markPrice).toFixed(2),
                    supplyPrice: parseFloat(_this.getsiteSelectlist[j].supplyPrice).toFixed(2),
                    salePrice: _this.getsiteSelectlist[j].salePrice,
                    rate: _this.getsiteSelectlist[j].rate,
                    status: getStocklist[i].status === '1' ? '有货' : '无货',
                    operStatus: _this.getsiteSelectlist[j].operStatus === '3' ? '上架' : '下架',
                    productNo: this.getsiteSelectlist[j].productNo
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
    reselectSite () {
      this.$refs.selectSiteslist.isShow = true
    },
    getbatchPrePick () {
      var productIds = ''
      if (this.multipleSelection.length > 0) {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          productIds += this.multipleSelection[index].id + ','
        }
        productIds = productIds.substring(0, productIds.length - 1)
      }
      if (productIds === '') {
        return false
      }
      this.disabled = true
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/orgBatchPrePick'),
        method: 'post',
        data: this.$http.adornData({
          source: this.sourceid,
          productIds: productIds,
          priceWay: this.formchangePrice.resource,
          priceType: this.formchangePrice.resource === 'eq' ? this.formchangePrice.gyj1 : this.formchangePrice.gyj,
          priceAdjust: this.formchangePrice.priceAdjust,
          priceVal: this.formchangePrice.priceVal,
          priceUnit: this.formchangePrice.priceUnit,
          // priceEqFlag: this.formchangePrice.priceEqFlag === true ? 'eq' : 'uneq', // eq/uneq
          // distribPriceEqFlag: this.formchangePrice.distribPrice.distribPriceEqFlag === true ? 'eq' : 'uneq', // eq/uneq
          distribPriceWay: this.formchangePrice.distribPrice.distribPriceWay,
          distribPriceType: this.formchangePrice.distribPrice.distribPriceWay === 'eq' ? this.formchangePrice.distribPrice.gyj1 : this.formchangePrice.distribPrice.gyj,
          distribPriceAdjust: this.formchangePrice.distribPrice.distribPriceAdjust,
          distribPriceVal: this.formchangePrice.distribPrice.distribPriceVal,
          distribPriceUnit: this.formchangePrice.distribPrice.distribPriceUnit,
          siteIds: this.siteIds,
          operStatus: this.formchangePrice.operStatus
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.multipleSelection = []
          this.$refs.selectSiteslist.isShow = false
          this.showAllWebsite = false
          if (res.data.skus.length > 0) {
            this.isshowSku = true
            this.showSku.showSkulist = res.data.skus.join(',')
          } else {
            this.$message.success(res.data.msg)
          }
          this.getsiteSelect()
        } else {
          this.$message.error(res.data.msg)
        }
        this.disabled = false
      })
    },
    onSubmit () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择一个商品')
        return false
      } else if (this.multipleSelection.length > 500) {
        this.$message.error('不能选择大于500的商品 ，请重新选择')
        return false
      } else {
        this.flagClick = 1
        this.$refs.selectSiteslist.isShow = true
      }
    },
    edit (item) {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.toggleSelectionA([item])
      this.onSubmit()
    },
    setSiteIds (ids) {
      this.siteIds = ids.join(',')
      console.log(this.siteIds)
      this.showAllWebsite = true
    },
    onAdd () {
      this.$refs.skuSelect.inint(this.sourceid)
      this.$refs.skuSelect.showWebsite = true
    }
  }

}
</script>
<style lang="scss" scoped>
.wapper {
  .mainRight {
    margin-right: 20px;
    background: #ffffff;
  }
  .site-content {
    color: #303133;
    transition: 0.3s;
    padding: 0;
  }
  .divbtn {
    text-align: right;
    /deep/ .el-button + .el-button {
      margin-left: 6px;
    }
  }
}
.searchBlock {
  // background: #ffffff;
  .navsourse {
    border-bottom: #dddddd 1px solid;
    li {
      // min-width: 120px;
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      top: 2px;
      position: relative;
      -webkit-transition: 0.2s ease;
      transition: 0.2s ease;
      border: #ffffff 1px solid;
      border-radius: 3px;
      display: inline-block;
      cursor: pointer;
      img {
        margin-right: 3px;
        vertical-align: middle;
      }
      &.active {
        border: #dddddd 1px solid;
        border-bottom: #ffffff 1px solid;
        background-color: #fff;
      }
    }
  }
  .searchPannel {
    background: #ffffff;
    padding-top: 20px;
    .formItem {
      display: inline-block;
      margin-bottom: 10px;

      span {
        padding: 0 8px;
      }
      /deep/ .el-button {
        padding: 5px 10px;
      }
      &.ml0 {
        // margin-left: 0;
        /deep/ .el-form-item__content {
          margin-left: 20px !important;
        }
      }
    }
  }
  .tablescroll {
    overflow: hidden;
    max-height: 600px;
    margin-top: 10px;
  }
}
.fipt {
  width: 120px;
  /deep/ .el-input__inner {
    height: 34px;
    line-height: 34px;
  }
  &.w100 {
    width: 100px;
  }
  &.w90 {
    width: 90px;
  }
}

.modal-dialog-2 {
  width: 575px;
  padding: 20px;
  .fipt {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  /deep/ .van-dialog__header {
    text-align: left;
    margin-bottom: 10px;
  }
}
.scopepannel {
  display: inline-block;
  width: 125px;
  vertical-align: top;
  padding-left: 20px;
}
.pagination {
  padding: 20px;
  background: #ffffff;
}
.el-card__body {
  padding-top: 0;
}
.radioItem {
  margin-bottom: 10px;
}
/deep/ .el-table {
  th {
    &:nth-child(7) {
      overflow: visible !important;
      div {
        overflow: visible;
      }
    }
  }
}
.eltag {
  height: 40px;
  line-height: 40px;
  margin-top: 20px;
}
.marketingAct {
  ul {
    padding: 10px;
    overflow: hidden;
    .actItem {
      width: 30%;
      height: 450px;
      padding: 16px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      border-radius: 4px;
      margin: 20px 20px 20px 10px;
      position: relative;
      display: inline-block;
      overflow: hidden;
      vertical-align: top;
      .icon-Offline {
        position: absolute;
        right: 16px;
        top: 16px;
        width: 55px;
        height: 55px;
        // background: url('./img/offline.jpg') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
      }
      .ewm {
        width: 100%;
        height: 206px;
        position: absolute;
        z-index: 99;
        background: rgba(0, 0, 0, 0.6);
        text-align: center;
        bottom: 50px;
        border-radius: 5px;
        padding-top: 30px;
        top: 0;
        left: 0;
        img {
          display: inline-block !important;
        }
      }
      .loading {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 99;
        background: rgba(0, 0, 0, 0.6);
        text-align: center;
        bottom: 50px;
        border-radius: 5px;
        padding-top: 81px;
        top: 0;
        left: 0;

        /deep/ .el-progress__text {
          color: #ffffff;
        }
      }
      .actImg {
        width: 100%;
        height: 190px;
        margin-right: 16px;
        overflow: hidden;
        margin-bottom: 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .details {
        position: relative;
        h3 {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 5px;
          margin-bottom: 10px;
        }
        h4 {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 5px;
        }
        p {
          color: #666;
          font-size: 14px;
          line-height: 18px;
          margin-bottom: 5px;
        }
        .detailsfenl {
          height: 54px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .actBtnlist {
        position: absolute;
        right: 10px;
        bottom: 10px;
        .actBtn {
          padding: 10px 5px;
          margin-top: 10px;
          margin-left: 10px;
        }
      }
    }
  }
}
.elDialogOpemlist {
  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  .creatsite {
    max-height: 200px;
    overflow: hidden;
    overflow-y: scroll;
    margin-bottom: 20px;
    .radioGroupitem {
      display: block;
      margin-left: 0;
      line-height: 30px;
    }
  }
}
</style>
