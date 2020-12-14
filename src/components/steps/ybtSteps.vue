<template>
  <div class="ybt-steps">
    <ul :class="'styleName'+styleName">
      <li class="s1" v-if="stepText1!=''">
        <i class="iconfont icon-chenggong"></i>
        <i class="iconfont icon-xuanzhong"></i>
        <i class="iconfont icon-duoxuanzexiang"></i>
        <br />
        <span>{{stepText1}}</span>
        <div class="line"></div>
      </li>
      <li class="s2">
        <i class="iconfont icon-chenggong"></i>
        <i class="iconfont icon-xuanzhong"></i>
        <i class="iconfont icon-duoxuanzexiang"></i>
        <br />
        <span>{{stepText2}}</span>
        <div class="line"></div>
      </li>
      <li class="s3">
        <i class="iconfont icon-chenggong"></i>
        <i class="iconfont icon-xuanzhong"></i>
        <i class="iconfont icon-duoxuanzexiang"></i>
        <br />
        <span>{{stepText3}}</span>
      </li>
    </ul>
  </div>
</template>

  <script>
export default {
  /** 公共属性 */
  props: {

    stepText1: {
      type: [String],
      default: false
    },
    stepText2: {
      type: [String],
      default: false
    },
    stepText3: {
      type: [String],
      default: false
    },
    styleName: {
      type: [String],
      default: false
    }
  }
}
  </script>

<style lang="scss" scoped>
.ybt-steps {
  padding-top: 20px;
  margin-bottom: 30px;

  ul {
    padding: 0;
    margin: 0;
    text-align: center;

    li {
      display: inline-block;
      padding-right: 200px;
      position: relative;
      vertical-align: top;
      i {
        font-size: 24px;
        display: none;
        &.icon-chenggong {
          color: #1985FF;
        }
        &.icon-xuanzhong {
          color: #1985FF;
        }
        &.icon-duoxuanzexiang {
          color: #e4e6ed;
        }
      }
      span {
        display: inline-block;
        height: 20px;
        font-size: 14px;
        line-height: 1;
        color: rgba(148, 155, 184, 1);
        margin-top: 11px;
      }
      .line {
        width: 200px;
        height: 3px;
        background: #e4e6ed;
        border-radius: 10px;
        position: absolute;
        right: 0;
        top: 11px;
      }
      &.select {
        span {
          color: #1985FF;
        }
        .line {
          background: #1985FF;
        }
        .icon-duoxuanzexiang {
          color: #1985FF;
        }
      }
      &:last-child {
        padding-right: 0;
      }
    }

    &.styleName1 {
      .s1 {
        .icon-xuanzhong {
          display: block;
        }
        span {
          color: #1985FF;
        }
      }
      .s2 {
        .icon-duoxuanzexiang {
          display: block;
        }
      }
      .s3 {
        .icon-duoxuanzexiang {
          display: block;
        }
      }
    }
    &.styleName2 {
      .s1 {
        .icon-chenggong {
          display: block;
        }
        span {
          color: #1985FF;
        }
        .line {
          background: #1985FF;
        }
      }
      .s2 {
        .icon-xuanzhong {
          display: block;
        }
        span {
          color: #1985FF;
        }
      }
      .s3 {
        .icon-duoxuanzexiang {
          display: block;
        }
      }
    }
    &.styleName3 {
      .s1 {
        .icon-chenggong {
          display: block;
        }
        span {
          color: #1985FF;
        }
        .line {
          background: #1985FF;
        }
      }
      .s2 {
        .icon-chenggong {
          display: block;
        }
        span {
          color: #1985FF;
        }
        .line {
          background: #1985FF;
        }
      }
      .s3 {
        .icon-xuanzhong {
          display: block;
        }
      }
    }
  }
}
</style>
