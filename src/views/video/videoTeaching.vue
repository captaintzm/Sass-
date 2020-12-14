<template>
  <div class="viedeoTeaching">
    <ul>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/1%20%20%E7%99%BB%E5%BD%95%E5%8F%8A%E4%BF%AE%E6%94%B9%E5%AF%86%E7%A0%81.mp4"
          />
        </video>
        <h3 class="title-tip">1.登录及修改密码</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/2%20%20%E6%90%AD%E5%BB%BA%E5%95%86%E5%9F%8E.mp4"
          />
        </video>
        <h3 class="title-tip">2.搭建商城</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/3%20%20%E6%8C%91%E9%80%89%E5%95%86%E5%93%81%E5%8F%8A%E5%95%86%E5%9F%8E%E8%A3%85%E9%A5%B0.mp4"
          />
        </video>
        <h3 class="title-tip">3.挑选商品及商城装饰</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/4%20%20%E5%88%9B%E5%BB%BA%E7%A4%BC%E5%8C%85.mp4"
          />
        </video>
        <h3 class="title-tip">4.创建礼包</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/5%20%20%E5%88%9B%E5%BB%BA%E5%8D%A1%E5%88%B8.mp4"
          />
        </video>
        <h3 class="title-tip">5.创建卡券</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BA%94%E7%94%A8.mp4"
          />
        </video>
        <h3 class="title-tip">6.平台二维码应用</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/%E8%B4%A2%E5%8A%A1%E5%8A%9F%E8%83%BD%E7%82%B9.mp4"
          />
        </video>
        <h3 class="title-tip">7.平台财务功能说明</h3>
      </li>
      <li>
        <video controls name="media" class="video">
          <source
            src="https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/videos/%E7%A4%BC%E5%8C%85%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.mp4"
          />
        </video>
        <h3 class="title-tip">8.礼包管理功能</h3>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.viedeoTeaching {
  ul {
    overflow: hidden;
    li {
      float: left;
      width: 49.6%;
      margin: 0 10px 20px 0;
      &:nth-child(even) {
        margin-right: 0;
      }
      .video {
        width: 100%;
      }
      .title-tip {
        font-size: 16px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
