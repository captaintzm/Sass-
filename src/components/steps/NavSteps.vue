<template>
  <div class="ybt-steps">
    <ul v-if="isTest">
      <li :class="{'select':styleName==1,'width01':stepText3=='','width04':stepText4!=''}" @click="clickOne(1)">{{stepText1}}</li>
      <li :class="{'select':styleName==4,'width01':stepText3=='','width04':stepText4!=''}" @click="clickOne(4)" v-if="stepText4!=''">{{stepText4}}</li>
      <li :class="{'select':styleName==2,'width01':stepText3=='','width04':stepText4!=''}" @click="clickOne(2)">{{stepText2}}</li>
      <li :class="{'select':styleName==3,'width01':stepText3=='','width04':stepText4!=''}" @click="clickOne(3)" v-if="stepText3!=''">{{stepText3}}</li>
    </ul>
    <ul v-else>
      <li :class="{'select':styleName==1,'width01':stepText3==''}" @click="clickOne(1)">{{stepText1}}</li>
      <!-- <li :class="{'select':styleName==4,'width01':stepText3=='','width04':stepText4!=''}" @click="clickOne(4)" v-if="stepText4!=''">{{stepText4}}</li> -->
      <li :class="{'select':styleName==2,'width01':stepText3==''}" @click="clickOne(2)">{{stepText2}}</li>
      <li :class="{'select':styleName==3,'width01':stepText3==''}" @click="clickOne(3)" v-if="stepText3!=''">{{stepText3}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  /** 公共属性 */
  props: {
    stepText1: {
      type: [String],
      default: ''
    },
    stepText2: {
      type: [String],
      default: ''
    },
    stepText3: {
      type: [String],
      default: ''
    },
    stepText4: {
      type: [String],
      default: ''
    },
    styleName: {
      type: [String],
      default: ''
    }
  },
  data(){
    return{
      isTest:false
    }
  },
  created(){
  if(location.origin.includes('test')){
     this.isTest = true
   }
  },
  methods: {
    clickOne (type) {
      this.$emit('clickToLink', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.ybt-steps {
  margin-bottom: 30px;
  ul {
    padding: 0;
    margin: 0;
    text-align: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    li {
      height: 50px;
      text-align: center;
      width: 33%;
      font-size: 16px;
      background-color: #e8f7f6;
      line-height: 50px;
      cursor: pointer;
      color: #1985FF;
      display: inline-block;
      &.select {
        background: #1985FF;
        color: #ffffff;
      }
      &.width01 {
        width: 49.6%;
      }
      &.width04{
         width: 24.7%;
      }
    }
  }
}
</style>
