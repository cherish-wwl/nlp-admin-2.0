<template>
  <div>
    <div class="datasetTop">
      <el-select v-model="attrlistId" placeholder="请选择" class="data1" @change="LevelOneClick">
        <el-option label="全部" value="" />
        <el-option v-for="item in attrlist" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="dataTypelistId" placeholder="请选择" class="data2">
        <el-option label="全部" value="" />
        <el-option
          v-for="item in dataTypelist"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>
      <el-input
        placeholder=" 请输入关键字 "
        suffix-icon="el-icon-search"
        class="data3" />
      <el-button type="primary" size="small" >搜索</el-button>
      <el-button type="primary" size="small" >添加</el-button>
    </div>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="名称" min-width="100" />
      <el-table-column prop="image" label="图片" min-width="100" />
      <el-table-column prop="size" label="大小" min-width="100" />
      <el-table-column prop="uploader" label="上传者" min-width="100" />
      <el-table-column prop="introduce" label="介绍" min-width="500" />
      <el-table-column prop="format" label="格式" min-width="100" />
      <el-table-column prop="url" label="访问路径" min-width="300" />
      <el-table-column label="操作" width="90" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small">删除</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- <div class="block">
      <el-pagination  @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber">
      </el-pagination>
    </div>  -->
  </div>
</template>
<script>
import { getlevelOneData, getlevelTwoData, getTableList } from '@/api/dict'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      attrlist: [],
      attrlistId: null,
      dataTypelist: [],
      dataTypelistId: null,
      oneId: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    LevelOneClick(id) {
      this.tableData = null
      getlevelTwoData({ id: this.attrlistId }).then(responce => {
        this.dataTypelist = responce.data
      })
    },
    taBle(id) {
      this.loading = true
      var item = { id: id, pageSize: this.pageSize, pageNow: this.currentPage }
      getTableList(item).then(responce => {
        console.log(this.tableData = responce.data)
        this.tableData = responce.data
        this.totalNumber = responce.total
        this.loading = false
      })
    },
    async loadingOneLevel() {
      await getlevelOneData().then(responce => {
        // console.log(this.attrlist = responce.data )
        this.loading = true
        this.attrlist = responce.data
        if (this.attrlist.length === 0) {
          this.loading = false
          return
        }
        this.attrlistId = this.attrlist[0].id
      })
    },
    loadingTwoLevel() {
      getlevelTwoData({ id: this.oneId }).then(responce => {
        // console.log(this.dataTypelist=responce.data)
        this.loading = true
        this.dataTypelist = responce.data
        if (this.dataTypelist.length === 0) {
          this.loading = false
          return
        }
        this.dataTypelistId = this.dataTypelist[0].id
      })
    },
    async init() {
      await this.loadingOneLevel()
      this.oneId = this.attrlist[0].id
      this.loadingTwoLevel()
      this.taBle()
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.datasetTop{
  margin: 30px;
}
.data1,.data2,.data3{
  margin-right: 20px;
}
  .el-pagination{
    text-align: right;
  }
  .grid-content {
    min-height: 36px;
  }
  .el-input,.el-select {
    width: 230px;
  }
  .el-dialog__body {
      height: auto !important;
      overflow-y: auto;
  }
  .width50{
    width: 48%;
  }
  .width100{
    width: 100%;
    .el-form-item__content{
      width: 77.5%;
    }
  }
</style>
