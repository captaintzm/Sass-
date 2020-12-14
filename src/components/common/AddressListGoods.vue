<template>
  <div>
    <el-select v-model="valuePro" placeholder="请选择" @change="selectPro" class="w100">
      <el-option
        v-for="(item,index) in address"
        :key="index"
        :label="item.name"
        :value="item.channelId"
      ></el-option>
    </el-select>
    <el-select
      v-model="valuecity"
      placeholder="请选择"
      @change="selectCity"
      class="w100 ml5"
      v-show="city.length>0"
    >
      <el-option
        v-for="(item,index) in city"
        :key="index"
        :label="item.name"
        :value="item.channelId"
      ></el-option>
    </el-select>
    <el-select
      v-model="valuearea"
      placeholder="请选择"
      @change="selectArea"
      class="w100 ml5"
      v-show="area.length>0"
    >
      <el-option
        v-for="(item,index) in area"
        :key="index"
        :label="item.name"
        :value="item.channelId"
      ></el-option>
    </el-select>
    <el-select
      v-model="valuestree"
      placeholder="请选择"
      @change="selectStree"
      class="w100 ml5"
      v-show="stree.length>0"
    >
      <el-option
        v-for="(item,index) in stree"
        :key="index"
        :label="item.name"
        :value="item.channelId"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'index',
  props: {
    source: {
      type: [Number, String],
      default: 1
    }
  },
  data () {
    return {
      siteId: this._pageSiteId,
      valuePro: '',
      valuecity: '',
      valuearea: '',
      valuestree: '',
      address: [],
      city: [],
      area: [],
      stree: [],
      type: 1,
      channelId: '',
      firstDistrictId: '',
      secondDistrictId: '',
      thirdDistrictId: '',
      fourthDistrictId: '',
      firstDistrictName: '',
      secondDistrictName: '',
      thirdDistrictName: '',
      fourthDistrictName: '',
      sourceid: this.source
    }
  },
  mounted () {
    this.getaddress(1, this.sourceid, '')
  },
  methods: {
    selectPro (channelId) {
      this.type = 2
      this.channelId = channelId
      this.firstDistrictId = channelId
      for (let index = 0; index < this.address.length; index++) {
        if (channelId === this.address[index].channelId) {
          this.firstDistrictName = this.address[index].name
        }
      }
      var mallSiteList = {
        'firstDistrictId': this.firstDistrictId,
        'firstDistrictName': this.firstDistrictName,
        'secondDistrictId': '',
        'secondDistrictName': '',
        'thirdDistrictId': '',
        'thirdDistrictName': '',
        'fourthDistrictId': '',
        'fourthDistrictName': ''
      }
      this.$emit('mallSiteDistrict', mallSiteList)
      this.getaddress(2, this.sourceid, channelId)
    },
    selectCity (channelId) {
      this.type = 3
      this.channelId = channelId
      this.secondDistrictId = channelId
      for (let index = 0; index < this.city.length; index++) {
        if (channelId === this.city[index].channelId) {
          this.secondDistrictName = this.city[index].name
        }
      }
      var mallSiteList = {
        'firstDistrictId': this.firstDistrictId,
        'firstDistrictName': this.firstDistrictName,
        'secondDistrictId': this.secondDistrictId,
        'secondDistrictName': this.secondDistrictName,
        'thirdDistrictId': '',
        'thirdDistrictName': '',
        'fourthDistrictId': '',
        'fourthDistrictName': ''
      }
      this.$emit('mallSiteDistrict', mallSiteList)
      this.getaddress(3, this.sourceid, channelId)
    },
    selectArea (channelId) {
      this.type = 4
      this.channelId = channelId
      this.thirdDistrictId = channelId
      for (let index = 0; index < this.area.length; index++) {
        if (channelId === this.area[index].channelId) {
          this.thirdDistrictName = this.area[index].name
        }
      }
      var mallSiteList = {
        'firstDistrictId': this.firstDistrictId,
        'firstDistrictName': this.firstDistrictName,
        'secondDistrictId': this.secondDistrictId,
        'secondDistrictName': this.secondDistrictName,
        'thirdDistrictId': this.thirdDistrictId,
        'thirdDistrictName': this.thirdDistrictName,
        'fourthDistrictId': '',
        'fourthDistrictName': ''
      }
      this.$emit('mallSiteDistrict', mallSiteList)
      this.getaddress(4, this.sourceid, channelId)
    },
    selectStree (channelId) {
      this.fourthDistrictId = channelId
      for (let index = 0; index < this.stree.length; index++) {
        if (channelId === this.stree[index].channelId) {
          this.fourthDistrictName = this.stree[index].name
        }
      }
      var mallSiteList = {
        'firstDistrictId': this.firstDistrictId,
        'firstDistrictName': this.firstDistrictName,
        'secondDistrictId': this.secondDistrictId,
        'secondDistrictName': this.secondDistrictName,
        'thirdDistrictId': this.thirdDistrictId,
        'thirdDistrictName': this.thirdDistrictName,
        'fourthDistrictId': this.fourthDistrictId,
        'fourthDistrictName': this.fourthDistrictName
      }
      this.$emit('mallSiteDistrict', mallSiteList)
    },
    getaddress (type, sourceid, channelId) {
      this.sourceid = sourceid

      this.$http({
        url: this.$http.adornUrl('/ybt-backend/district/district/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            type: type,
            source: sourceid,
            channelId: channelId === undefined ? '' : channelId
          }
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (type === 1) {
            this.address = data.districtList
            this.valuecity = ''
            this.valuearea = ''
            this.valuestree = ''
            this.city = []
            this.area = []
            this.stree = []
            this.getqueryMallDistrict()
          }
          if (type === 2) {
            this.city = data.districtList
            this.valuecity = ''
            this.valuearea = ''
            this.valuestree = ''
            this.area = []
            this.stree = []
          }
          if (type === 3) {
            this.area = data.districtList
            this.valuearea = ''
            this.valuestree = ''
            this.stree = []
          }
          if (type === 4) {
            this.stree = data.districtList
          }
        }
      })
    },

    getqueryMallDistrict () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/product/siteproduct/queryOrgDistrict'),
        method: 'post',
        data: this.$http.adornData(
          {
            source: this.sourceid
          }, true
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var item = data.mallDistrict
          localStorage.getItem('queryAddress', '')
          localStorage.setItem('queryAddress', JSON.stringify(item))
          this.getAddressTxt()
        }
      })
    },
    getAddressTxt () {
      var item = JSON.parse(localStorage.getItem('queryAddress'))
      for (let index = 0; index < this.address.length; index++) {
        if (Number(item.firstDistrictId) === parseInt(this.address[index].channelId)) {
          this.valuePro = item.firstDistrictName

          this.$http({
            url: this.$http.adornUrl('/ybt-backend/district/district/list'),
            method: 'get',
            params: this.$http.adornParams(
              {
                type: 2,
                source: this.source,
                channelId: item.firstDistrictId
              })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.city = data.districtList
              this.valuecity = item.secondDistrictName
              this.$http({
                url: this.$http.adornUrl('/ybt-backend/district/district/list'),
                method: 'get',
                params: this.$http.adornParams(
                  {
                    type: 3,
                    source: this.source,
                    channelId: item.secondDistrictId
                  })
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.area = data.districtList
                  this.valuearea = item.thirdDistrictName
                  this.$http({
                    url: this.$http.adornUrl('/ybt-backend/district/district/list'),
                    method: 'get',
                    params: this.$http.adornParams(
                      {
                        type: 4,
                        source: this.source,
                        channelId: item.thirdDistrictId
                      })
                  }).then(({ data }) => {
                    if (data && data.code === 0) {
                      this.stree = data.districtList
                      this.valuestree = item.fourthDistrictName
                    }
                  })
                }
              })
            }
          })
        }
      }

      this.firstDistrictId = Number(item.firstDistrictId)
      this.firstDistrictName = item.firstDistrictName
      this.secondDistrictId = Number(item.secondDistrictId)
      this.secondDistrictName = item.secondDistrictName
      this.thirdDistrictId = Number(item.thirdDistrictId)
      this.thirdDistrictName = item.thirdDistrictName
      this.fourthDistrictId = Number(item.fourthDistrictId)
      this.fourthDistrictName = item.fourthDistrictName
      var mallSiteList = {
        'firstDistrictId': Number(item.firstDistrictId),
        'firstDistrictName': item.firstDistrictName,
        'secondDistrictId': Number(item.secondDistrictId),
        'secondDistrictName': item.secondDistrictName,
        'thirdDistrictId': Number(item.thirdDistrictId),
        'thirdDistrictName': item.thirdDistrictName,
        'fourthDistrictId': Number(item.fourthDistrictId),
        'fourthDistrictName': item.fourthDistrictName
      }
      this.$emit('mallSiteDistrict', mallSiteList)
    }
  }
}
</script>
<style  lang="scss" scoped>
</style>
