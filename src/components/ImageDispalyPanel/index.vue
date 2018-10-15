<template>
  <div>
    <el-select v-model="defaultSelect" placeholder="请选择" @change="setSelectValue">
      <el-option
        v-for="item in imgFileList"
        :key="item.imageId"
        :label="item.fileDesc"
        :value="item.imageId"/>
    </el-select>
    <div :class="defaultSelect!=''?'imgPanel':''">
      <img
        v-for="item in imgFileList"
        v-if="defaultSelect && defaultSelect == item.imageId"
        :key="item.imageId"
        :src="item.fileUrl"
        class="avatar" >
    </div>
  </div>
</template>
<script>
import { getFileList } from '@/api/uploadFile'
export default {
  props: {
    imgTypeId: {
      type: String,
      default: ''
    },
    initSelect: {
      type: String,
      default: ''
    },
    selectIndex: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      imgFileList: [],
      defaultSelect: ''
    }
  },
  watch: {
    initSelect(val) {
      console.log('=============')
      console.log(val)
      this.defaultSelect = val
    }
  },
  mounted() {
    this.defaultSelect = this.initSelect
    getFileList({ fileType: this.imgTypeId }).then(res => {
      this.imgFileList = res.data
      this.imgFileList.unshift({ imageId: '', fileDesc: '请选择' })
    })
  },
  methods: {
    setSelectValue(val) {
      // console.log('-------------------------------')
      // console.log(val)
      this.$emit('setSelectValue', val, this.selectIndex)
    }
  }
}
</script>
<style scoped>
  .el-select {
    width: 100%;
  }
  .imgPanel{
    width: 100%;
    border: 1px solid #ddd;
    margin-top: 20px;
  }
  .imgPanel img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
