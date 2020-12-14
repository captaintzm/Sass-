<template>
  <div class="yyccredit">
    <applyHeader ref="applyheader"  styleName="3"/>
    <div class="listImg">
      <a href="http://ybt.ycb51.com/col.jsp?id=114" target="_blank">
        <img src="~@/assets/img/fangan/jjfa_01.png" />
      </a>
      <a href="http://ybt.ycb51.com/col.jsp?id=102" target="_blank">
        <img src="~@/assets/img/fangan/jjfa_02.png" />
      </a>
      <a href="http://ybt.ycb51.com/col.jsp?id=115" target="_blank">
        <img src="~@/assets/img/fangan/jjfa_03.png" />
      </a>
      <br />
      <a href="http://ybt.ycb51.com/col.jsp?id=104" target="_blank">
        <img src="~@/assets/img/fangan/jjfa_04.png" />
      </a>
      <a href="http://ybt.ycb51.com/col.jsp?id=120" target="_blank">
        <img src="~@/assets/img/fangan/jjfa_05.png" />
      </a>
      <a href="http://ybt.ycb51.com/col.jsp?id=116" target="_blank">
        <img src="~@/assets/img/fangan/jjfa_06.png" />
      </a>
    </div>
  </div>
</template>

<script>
import applyHeader from '../../components/common/applyHeader'
export default {
  data () {
    return {
      packList: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      packchose: 1,
      correctlylist: [],
      siteListNum: localStorage.getItem('siteListNum'),
      stageMallListNum: localStorage.getItem('stageMallListNum'), // 分期商城数量
      lbNum: localStorage.getItem('lbNum')
    }
  },
  mounted () {

  },
  created () {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    this.instar()
  },
  methods: {
  
    addSite () {
      var userInfo = JSON.parse(localStorage.getItem('userInfo'))
      var orgType = userInfo.sysOrganization.type
      if (orgType === 2) {
        this.$router.push({ path: '/basicInfo' })
      } else {
        this.$router.push({ path: '/choiceModel' })
      }
    },
    instar () {
      this.totalPage = 0
      this.pageIndex = 1
      this.pageSize = 12
      return this.packlist()
    },
    detailById (id) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/detailById'),
        method: 'post',
        params: this.$http.adornParams({
          id: id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)

          let mallSites = data.mallSites
          let packsInfo = data.packsInfo
          let sources = data.sources
          // console.log(mallSites,packsInfo,sources)
          this.$router.push({ path: '/gitcredit-gitcredit', query: { mallSites, packsInfo, sources, id } })
          // this.packtodolist=data.page.list
          // console.log(this.packtodolist)
        } else {
          console.log(121)
        }
      })
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.packlist()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.packlist()
    },

    // 自定义礼包列表
    packlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/voucher/voucher/list'),
        method: 'post',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          this.packList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          console.log(121)
        }
      })
    },
    sbmit () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/list'),
        method: 'get',
        params: this.$http.adornParams({

        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
        } else {
          console.log(121)
        }
      })
    }
  },
  components: {
    applyHeader
  }
}
</script>

<style lang="scss">
.yyccredit {
  .listImg {
    font-size: 0;
    padding: 45px 0;
    margin: 40px 20px;
    background: #ffffff;
    text-align: center;
    border-radius: 8px;
    img {
      display: inline-block;
      margin: 0 20px;
    }
  }
}
</style>
