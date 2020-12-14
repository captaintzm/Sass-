<template>
 <div class="resource">
    <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="上级资源：">
            <el-input :disabled="true" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="资源名称：">
            <el-input placeholder="资源名称(必填)" v-model="form.resource"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
            <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="类型：">
            <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="菜单" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="图标：">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="URL路径：">
            <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="权限字符串：">
            <el-input></el-input>
        </el-form-item>
        <el-form-item label="是否可用：">
            <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="fenfa()">确定</el-button>
    </el-form>
 </div>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        form:{
          region: 'shanghai',
          name: '卡bin管理',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        num:0,
      }
    },
  
    components: {
    },
    computed: {
    },
    methods: {
        handleChange(value) {
            console.log(value);
        },
        fenfa(){
            console.log(45564)
        },
    }
  }
</script>

<style lang="scss" scoped>

</style>