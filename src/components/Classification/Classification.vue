<template>
  <div>
    <el-select
      placeholder="全部"
      class="fipt w100"
      @change="getfeilei1"
      v-model="productCateId1"
      size="medium"
    >
      <el-option label="全部" value></el-option>
      <el-option
        :label="item.lableName"
        :value="item.id"
        v-for="(item,index) in mallCateLables"
        :key="index"
      ></el-option>
    </el-select>

    <el-select
      v-model="productCateId2"
      placeholder="全部"
      class="fipt w100 ml5"
      @change="getfeilei2"
      size="medium"
      v-if="mallProductCates.length>0"
    >
      <el-option label="全部" value></el-option>
      <el-option
        :label="item.catName"
        :value="item.id"
        v-for="(item,index) in mallProductCates"
        :key="index"
      ></el-option>
    </el-select>

    <el-select
      v-model="productCateId3"
      placeholder="全部"
      class="fipt w100 ml5"
      @change="getfeilei3"
      size="medium"
      v-if="mallcateProduct.length>0"
    >
      <el-option label="全部" value></el-option>
      <el-option
        :label="item.catName"
        :value="item.id"
        v-for="(item,index) in mallcateProduct"
        :key="index"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'index',
  data () {
    return {
      productCateId1: '',
      productCateId2: '',
      productCateId3: '',
      siteId: localStorage.getItem('pageSiteId'),
      mallCateLables: [],
      mallProductCates: [],
      mallcateProduct: []
    }
  },
  mounted () {
    this.getqueryLable()
  },
  methods: {

    // 一级分类
    getqueryLable () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/product/queryLable'),
        method: 'post',
        data: this.$http.adornData({
          siteId: this.siteId
        }, true)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.mallCateLables = data.mallCateLables
        }
      })
    },

    getfeilei1 (id) {
      this.productCateId1 = id
      this.$emit('getCateId1', id)
      this.$emit('getCateId2', '')
      this.$emit('getCateId3', '')
      this.productCateId2 = ''
      this.mallProductCates = []
      this.productCateId3 = ''
      this.mallcateProduct = []
      this.getqueryProductCate(id)
    },

    // 二级分类
    getqueryProductCate (lableId) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/product/queryProductCate'),
        method: 'post',
        data: this.$http.adornData({
          lableId: lableId
        }, true)
      }).then((res) => {
        if (res && res.data.code === 0) {
          this.mallProductCates = res.data.mallProductCates
        }
      })
    },
    getfeilei2 (id) {
      this.productCateId2 = id
      this.$emit('getCateId2', id)
      this.$emit('getCateId3', '')
      this.productCateId3 = ''
      this.mallcateProduct = []
      this.getThirdCateLevelList(id)
      console.log('productCateId:' + this.productCateId)
    },

    // 三级分类
    getThirdCateLevelList (levelId) {
      this.$http({
        url: this.$http.adornUrl(
          '/ybt-backend/product/product/getThirdCateLevelListByLevelId'
        ),
        method: 'post',
        data: this.$http.adornData({
          levelId
        }, true)
      }).then(data => {
        if (data.data.code === 0) {
          this.mallcateProduct = data.data.supplyCateProductList
        }
      })
    },
    getfeilei3 (id) {
      this.productCateId3 = id
      this.$emit('getCateId3', id)
    }
  }
}
</script>
<style  lang="scss" scoped>
.w100 {
  width: 100px;
}
</style>
