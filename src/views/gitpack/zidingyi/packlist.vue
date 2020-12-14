<template>
  <div class="siteWrapper">
    <h2 class="mb20">礼包列表</h2>
    <el-form ref="form" label-width="85px">
      <el-form-item label="礼包名称" class="formItem">
        <el-col>
          <el-input v-model="name" size="medium"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="时间" class="formItem" label-width="70px">
        <el-col>
          <el-date-picker
            v-model="orderTime"
            type="datetimerange"
            :picker-options="pickerOptions2"
             format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="selectTimeOrderTime"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="礼包价格" class="formItem">
        <el-col>
          <el-input v-model="minPrice" placeholder="最小值" size="medium" class="w90"></el-input>
          <span>-</span>
          <el-input v-model="maxPrice" placeholder="最大值" size="medium" class="w90"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label-width="20px" class="formItem">
        <el-col>
          <el-button type="primary" @click="packlist()">搜索</el-button>
          <el-button type="primary" @click="gits()">新增</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="packlist">
      <div class="form-order"></div>
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
              <el-button type="info" v-if="items.operStatus==0" @click="shangjia(items.id)">下架</el-button>
              <el-button type="warning" v-if="items.operStatus==1" @click="xiajia(items.id)">上架</el-button>
              <el-button type="primary" v-if="items.ffStatus==2" plain>已完成</el-button>
            </div>
            <div>
              <!-- <el-button type="primary" @click="detailById(items.id,items.ffStatus)">详情</el-button> -->
              <el-button @click="deletes(items.id)" v-if="items.operStatus==0" plain>删除</el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      minPrice: '',
      maxPrice: '',
      value2: '',
      packtodolist: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      name: '',
      orderTime: '',
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted () {

  },
  created () {
    this.packlist()
    //   console.log(this.packtodolist)
  },

  methods: {
    selectTimeOrderTime (val) {
      console.log(val)
      this.orderTime = val
    },
    shangjia (id) {
      this.$confirm('您确定要上架吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/uptStatus'),
          method: 'post',
          params: this.$http.adornParams({
            packsId: id,
            operStatus: 1
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('上架成功')
            this.packtodolist.length = 0
            this.packlist()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    xiajia (id) {
      this.$confirm('您确定要下架吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/uptStatus'),
          method: 'post',
          params: this.$http.adornParams({
            packsId: id,
            operStatus: 0
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('下架成功')
            this.packtodolist.length = 0
            this.packlist()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    deletes (id) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/delete'),
          method: 'post',
          params: this.$http.adornParams({
            id: id
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('删除成功')
            this.packtodolist.length = 0
            this.packlist()
          } else {
            this.$message.error(data.msg)

            console.log(121)
          }
        })
      })
    },
    gits () {
      this.$router.push({ path: '/gitpack-zidingyi-gitpack' })
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
    detailByIds (id) {
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
          return this.$router.push({ path: '/gitpack-zidingyi-gitpack', query: { mallSites, packsInfo, sources, id } })
        } else {
          console.log(121)
        }
      })
    },
    detailById (id, ffStatus) {
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
          let packsInfoAdrr = data.packsInfoAdrr
          let userList = data.userList
          // console.log(mallSites,packsInfo,sources)
          if (ffStatus == 0) {
            return this.$router.push({ path: '/gitpack-zidingyi-gitpack', query: { mallSites, packsInfo, sources, id } })
          } else if (ffStatus == 1) {
            return this.$router.push({ path: '/gitpack-zidingyi-selectshoop', query: { packsId: id, siteId: packsInfo.siteId, source: packsInfo.productSource, ffStatus: packsInfo.ffStatus } })
          } else if (ffStatus == 2) {
            return this.$router.push({ path: '/ceshi-fenfa', query: { packsInfoAdrr, userList, packsInfo, packsId: id } })
          }
        } else {
          console.log(121)
        }
      })
    },

    packlist () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/packsinfo/packsinfo/list'),
        method: 'post',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.name,
          validStartDate: this.orderTime === null || this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[0],
          validEndDate: this.orderTime === null || this.orderTime === '' || this.orderTime === null ? '' : this.orderTime[1],
          minPrice: this.minPrice,
          maxPrice: this.maxPrice
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
    }

  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl';

.packlist {
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

    // margin-top: 30px;
    .listsitem {
      width: 340px;
      height: 260px;
      background: #ffffff;
      opacity: 1;
      margin-right: 50px;
      margin-bottom: 46px;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      overflow: hidden;

      .list-img {
        width: 340px;
        height: 163px;
        background: #ffffff;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .list-text {
        height: 45px;
        // box-shadow: 0px 2px 12px rgba(27, 60, 116, 0.16);
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        padding: 0 20px;
        line-height: 45px;
      }

      .list-btns {
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 20px;

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

.siteWrapper h2 {
  border-left: 4px solid #3E8EF7;
  font-size: 16px;
  padding-left: 10px;
  color: #3c3c3c;
}
</style>
