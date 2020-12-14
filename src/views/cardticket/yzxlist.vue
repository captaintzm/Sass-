<template>
  <div class="creditlist">
    <el-button @click="$router.push({ path: '/cardticket-gitcardticket' })">新增</el-button>
    <div class="lists">
      <div v-for="(items,index) in packtodolist" :key="index" class="listsitem">
        <div class="list-img">
          <img :src="items.photoUrl" alt />
        </div>
        <div class="list-text">
          <div>{{items.name}}</div>
          <div>{{items.salePrice}}</div>
        </div>
        <div class="list-btns">
          <div>
            <el-button type="info" v-if="items.ffStatus==0">草稿</el-button>
            <el-button type="warning" v-if="items.ffStatus==1">待发放</el-button>
            <el-button type="primary" plain v-if="items.ffStatus==2">已完成</el-button>
          </div>
          <div>
            <el-button type="primary" @click="detailById(items.id,items.ffStatus)">详情</el-button>
            <el-button @click="deletes(items.id)" v-if="items.ffStatus!=2" plain>删除</el-button>
            <el-button v-if="items.ffStatus==2" plain>再次发放</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-pagination
      class="page"
      v-if="packtodolist.length>0"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :background="true"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
      :current-page="pageIndex"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value2: '',
      validStartDate: "",
      validEndDate: "",
      packtodolist: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
    }
  },
  mounted () {

  },
  created () {
    this.packlist()
    this.tabsCloseOtherHandle()
    //   console.log(this.packtodolist)
  },
  computed: {
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
  },
  methods: {
    // /packsinfo/packsinfo/delete
    tabsCloseOtherHandle () {
      // this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    deletes (id) {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/delete'),
        method: 'post',
        params: this.$http.adornParams({
          id: id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.packtodolist.length = 0
          this.packlist()
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
    detailById (id, ffStatus) {
      this.$router.push({ path: "/cardticket-setcardticket", query: { id: id } })
      // this.$http({
      //     url: this.$http.adornUrl('card/cardyyzx/cardInfoList'),
      //     method: 'post',
      //     params: this.$http.adornParams({
      //         cardYyzxId:id
      //     })
      // }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //     console.log(111)
      //     let mallSites=data.mallSites
      //     let packsInfo=data.voucher
      //     this.$router.push({path:"/cardticket-setcardticket",query:{mallSites,packsInfo,id}})
      //     } else {
      //         console.log(121)
      //     }
      // })
    },
    packlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/card/cardyyzx/list'),
        method: 'post',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(111)
          this.packtodolist = data.page.list
          this.totalPage = data.page.totalCount
          console.log(this.packtodolist)
        } else {
          console.log(121)
        }
      })
    },

  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../common/css/variable.styl';

.creditlist {
  // padding-left: 3.5%;
  .reset-size {
    display: inline-block;

    /deep/ .el-input--mini .el-input__inner {
      height: 36px;
      line-height: 36px;
    }

    /deep/ .el-form-item__label {
      line-height: 36px;
    }
  }

  .block {
    display: inline-block;

    /deep/ .el-date-editor.el-input {
      width: 150px;
    }

    /deep/ .el-input__inner {
      width: 148px;
    }
  }

  .packPrice {
    /deep/ .el-input--mini .el-input__inner {
      width: 82px;
    }
  }

  .maxPrice {
    width: 80px;
  }

  .lists {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 30px;

    .listsitem {
      width: 340px;
      height: 260px;
      background: rgba(255, 255, 255, 1);
      opacity: 1;
      margin-right: 50px;
      margin-bottom: 46px;

      .list-img {
        width: 340px;
        height: 163px;
        border: 1px solid #D8D8D8;
        background: rgba(216, 216, 216, 1);
        box-shadow: 0px 2px 12px rgba(27, 60, 116, 0.16);

        img {
          width: 100%;
          height: 100%;
        }
      }

      .list-text {
        height: 57px;
        box-shadow: 0px 2px 12px rgba(27, 60, 116, 0.16);
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        padding: 0 10px;
        line-height: 57px;
      }

      .list-btns {
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background: #F3F4FA;

        /deep/ .el-button--medium {
          width: 56px;
          height: 26px;
          padding: 0;
          line-height: 26px;
          text-align: center;
        }
      }
    }
  }
}
</style>
