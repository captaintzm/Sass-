<template>
  <div class="yycsohpp">
    <applyHeader ref="applyheader"  styleName="4"/>
    <div class="marketingAct1">
     <div class="jieshao">
        <p>
          海量商品全覆盖 品质服务更安心<br>
          聚合知名电商、主流品牌及厂家，为您提供实物商品、虚拟卡券等多维度商品供应服务<br>
          ·  京东、苏宁、网易严选等知名电商百万SKU商品<br>
          ·  全国主流品牌、厂家直供商品多类覆盖，并提供定制服务；<br>
          ·  加油、话费、猫眼电影、星巴克、视频会员、饿了么等上千种虚拟卡券<br>
        </p>
      </div>
       <img src="./img/liucheng.png" style="max-width: 100%;margin-top:22px;" v-if="queryApiSites.length==0"/>
      <ul v-if="queryApiSites.length>0">
         <li class="actItem" v-for="(item,index) in queryApiSites" :key="index" :style="randomBg(index)">
           <div class="actItem-item">
          <div class="actIteminfo">
           <h3>{{item.siteName}}</h3>
            <p>{{item.mallInstruction}}</p>
            <el-button  type="primary" class="btnPrimary" @click="openService(item)">查看服务</el-button>
           </div>
           <img :src="randomImg(index)"/>
           </div>
         
          <!-- <div class="actImg" v-html="imgran(item,index)">
            <img :src="item.imgSrc" alt />
          </div>
          <div class="details">
            <h3>{{item.siteName}}</h3>
            <el-button  type="primary" class="btnPrimary" @click="openService(item)">查看服务</el-button>
          </div> -->

        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import applyHeader from '../../components/common/applyHeader'
import allImages from './js/randomImg'
export default {
  data () {
    return {
      queryApiSites: [],
      allImages,
      bgColor: [
        'linear-gradient(135deg,rgba(72,155,250,1) 0%,rgba(72,126,250,1) 100%);',
        'linear-gradient(135deg,rgba(108,72,250,1) 0%,rgba(137,72,250,1) 100%);',
        'linear-gradient(135deg,rgba(250,173,72,1) 0%,rgba(250,203,72,1) 100%);'
      ]
    }
  },
  created () {
    this.queryApiSiteList()
  },
  computed: {
   
  },
  methods: {
     randomBg (index) {
      const randIndex = Math.floor(Math.random() * this.bgColor.length)
      return `background:${this.bgColor[randIndex]}`
    },
     randomImg (index) {
      // 根据背景图数组的长度随机选择索引
      const randIndex = Math.floor(Math.random() * this.allImages.length)
      return `${this.allImages[randIndex]}`
    },
    queryApiSiteList () {
      this.$http({
        url: this.$http.adornUrl('/ybt-backend/mall/mallsite/queryApiSiteList'),
        method: 'post',
        data: ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          for (let index = 0; index < data.siteList.length; index++) {
            const item = data.siteList[index]
            var mallTemplateConfig = JSON.parse(item.mallTemplateConfig)
            item.imgSrc = ''
            if (mallTemplateConfig.modelist !== undefined) {
              item.imgSrc = mallTemplateConfig.modelist.banner.imgs === undefined ? JSON.parse(mallTemplateConfig.modelist.banner).imgs[0].src : mallTemplateConfig.modelist.banner.imgs[0].src
            }
          }
          this.queryApiSites = data.siteList
        }
      })
    },
    openService (item) {
      localStorage.setItem('pageSiteId', item.id)
      localStorage.setItem('siteName', item.siteName)
      localStorage.setItem('siteType', item.siteType)
      window.open(location.origin + '/frontend-vis/#/myProductPool', '_blank')
    }

  },
  components: {
    applyHeader
  }
}
</script>

<style lang="scss" >
.yycsohpp {
  .marketingAct1 {
    ul {
      padding: 10px;
      overflow: hidden;
      .actItem {
        width: 520px;
        height: 260px;
        margin: 32px 32px 0 0;
        display: inline-block;
        overflow: hidden;
        vertical-align: top;
        border-radius:8px;
        display:inline-block;
        .actItem-item{
          display: flex;
          justify-content: space-between;
        }
       .actIteminfo{
         padding-left:36px;
         padding-top:59px;
          display:inline-block;
         h3{
            font-size:28px;
            font-weight:bold;
            line-height:40px;
            color:rgba(255,255,255,1);
         }
         p{
            padding-top:16px;
            font-size: 16px;
            color:#ffffff;
         }
         .btnPrimary{
          width:120px;
          height:40px !important;
          font-size:16px;
          font-weight:400;
          line-height:40px !important;
          border:0;
          background:rgba(255,255,255,1);
          color:rgba(25,133,255,1);
          text-align: center;
          padding: 0;
          margin-top:24px;
         }
       }
       img{
         margin-right: 24px;
         width:186px;
         height: 186px;
         margin-top:37px;
         display:inline-block;
         vertical-align: top;
       }

      }
    }
    .jieshao{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        margin-top: 20px;
        padding: 24px;
        color: #333;
        background-color: #F5F8FC;
        border-radius: 6px;
        padding-top: 30px;
        font-size: 14px;
        font-weight:400;
        p{
          line-height: 22px;
        }
    }
  }
}
</style>
