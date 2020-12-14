<template>
  <div class="finance-steps">
    <ul >
      <li>
        <div class="dd1">
          <div class="d1">
            <i>1</i>选择类型
          </div>
          <div class="d2">
            开票类型有3种：商品、服务、运费，选择其中一种后点击【申请开票】按钮
          </div>
        </div>
        <span class="s1"></span>
      </li>
        <li><div class="dd1">
        <div class="d1">
          <i>2</i>勾选商品
        </div>
        <div class="d2">
         勾选需要开票的商品/服务/运费，点击【索取发票】按钮
        </div></div>
        <span class="s2"></span>
      </li>
        <li><div class="dd1">
        <div class="d1">
          <i>3</i>核对信息
        </div>
        <div class="d2">
          核对发票抬头、类型，发票邮寄地址，点击【保存】按钮
        </div></div>
        <span class="s3"></span>
      </li>
    </ul>
  </div>
</template>

  <script>
    export default {
      /** 公共属性 */
      props: {

      }
    }
  </script>

<style lang="scss" scoped>
  .finance-steps {
      height:169px;
      background:rgba(255,255,255,1);
     margin-bottom: 30px;
    border-bottom: 16px solid #F5F8FC;
    padding: 0 20px;
      ul {
        padding: 0;
        margin: 0;
        display: flex;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        li{
          width: 33%;
          text-align: left;
          padding-left: 36px;
          border-right:1px solid rgba(230,230,230,1);
          padding-right: 82px;
          &:last-child{
            border-right:0
          }
          .dd1{
            display: inline-block;
            width:calc(100% - 100px);
          }
          .d1{
            font-size:18px;
            font-weight:500;
            line-height:1;
            color:rgba(25,133,255,1);
            margin-bottom: 10px;
            i{
              width:20px;
              height:20px;
              background:rgba(25,133,255,1);
              border-radius:50%;
              text-align: center;
              line-height: 20px;
              font-size:16px;
              color:rgba(255,255,255,1);
              display: inline-block;
              margin-right: 5px;
            }
          }
          .d2{

            height:40px;
            font-size:14px;
            font-weight:400;
            line-height:20px;
            color:rgba(51,51,51,1);
          }
          .s1{
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(img/icon1.png) no-repeat center top;
            background-size: 100% 100%;
            margin-left: 24px;
            vertical-align: top
          }
           .s2{
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(img/icon2.png) no-repeat center top;
            background-size: 100% 100%;
            margin-left: 24px;
            vertical-align: top
          }
           .s3{
            width: 72px;
            height: 72px;
            display: inline-block;
            background: url(img/icon3.png) no-repeat center top;
            background-size: 100% 100%;
            margin-left: 24px;
            vertical-align: top
          }
      }
  }
}
</style>
