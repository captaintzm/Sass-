<template>
  <div class="yycpack">
   <applyHeader ref="applyheader"/>
    <div class="yycpack_list" v-if="packchose==2">
      <div class="packlist_item" v-for="(items,index) in correctlylist" :key="index">
        <div class="packlist-img">
          <img :src="items.photoUrl" alt />
        </div>

        <div class="packlist-text">
          <p>{{items.name}}</p>
          <div class="packlist_btn">
            <el-button plain @click="detailById(item.id)">管理项目</el-button>
          </div>
          <!-- <div>管理项目</div> -->
        </div>
      </div>
    </div>

    <div class="yycpack_list" v-if="packchose==1">
      <div class="packlist_item" v-for="(item,index) in packList" :key="index">
        <div class="packlist-img">
          <img :src="item.photoUrl" alt />
        </div>
        <div class="packlist-text">
          <p>{{item.name}}</p>
          <div class="packlist_btn">
            <!-- <div>管理项目</div> -->
            <el-button plain @click="detailById(item.id)" type="primary" size="small">管理项目</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      class="page"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :background="true"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
      :current-page="pageIndex"
      v-if="totalPage!=0"
    ></el-pagination>
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
      lbNum: localStorage.getItem('lbNum')
    }
  },
  mounted () {
  },
  watch: {
    packchose () {
      this.instar()
    }
  },
  created () {
    this.packlist()
    this.standardList()
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
      if (this.packchose == 1) {
        return this.packlist()
      }
      if (this.packchose == 2) {
        return this.standardList()
      }
    },
    detailById (id) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/detailById'),
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
          this.$router.push({ path: '/gitpack-zidingyi-gitpack', query: { mallSites, packsInfo, sources, id } })
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

    // 标准礼包列表
    standardList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/standardList'),
        method: 'post',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          this.correctlylist = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          console.log(121)
        }
      })
    },

    // 自定义礼包列表
    packlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/list'),
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
        url: this.$http.adornUrl('mall/mallsite/list'),
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
.yycpack {

  .yycpack_list {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 60px;
    .packlist_item {
      width: 380px;
      height: 214px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      margin: 20px;
      border: 1px solid #dcdfe6;
      .packlist-img {
        height: 129px;
        position: relative;
        img {
          width: 348px;
          height: 141px;
          position: absolute;
          left: 16px;
          top: -20px;
        }
      }
      p {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 19px;
        color: rgba(51, 51, 51, 1);
        margin: 0 0 15px 0;
        display: block;
        width: 100%;
        text-align: center;
      }
      .packlist_btn {
        display: block;
        width: 100%;
        text-align: right;
      }
      .packlist-text {
        padding: 0 17px;
      }
    }
  }
}
</style>
