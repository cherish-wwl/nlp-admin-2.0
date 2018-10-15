<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-cascader
          :show-all-levels="false"
          v-model="selectedOptions"
          :props="serviceClassProps"
          :options="serviceClassTreeData"
          expand-trigger="hover"
          placeholder="请选择服务分类"
          @change="handleChange"/>
      </el-col>
      <el-col :span="5">
        <el-input v-model="searchKey" placeholder="输入想要检索的关键字" @keyup.enter.native="querySearch"/>
      </el-col>
      <el-col :span="8">
        &nbsp; &nbsp;
        <el-button type="primary" @click="querySearch" >搜索</el-button>
        <el-button type="success" @click="jumpPage({name: 'addService'})">添加服务</el-button>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%;" height="calc(70vh)">
        <el-table-column prop="index" label="序号" type="index" align="center"/>
        <el-table-column prop="serviceName" label="服务名称" min-width="200"/>
        <el-table-column prop="serviceDescr" label="描述" width="250">
          <template slot-scope="scope">
            <span :title="scope.row.serviceDescr">
              {{ scope.row.serviceDescr | stringFormatter }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceState" label="服务状态" min-width="80">
          <template slot-scope="scope">
            <span
              v-for="item in dictList"
              v-if="scope.row.serviceState == item.dictCode"
              :key="item.dictCode">
              {{ item.dictName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="isCharge" label="是否免费" min-width="80">
          <template slot-scope="scope">
            <span
              v-for="item in dictList"
              v-if="item.parentCode =='012'&&item.dictCode ==scope.row.isCharge"
              :key="item.dictCode">
              {{ item.dictName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatTime" prop="rel_time" label="发布时间" min-width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" class="colorA" type="text" @click="jumpPage({ name: 'enterInfo', query: { id: scope.row.id } })" >接入信息</el-button>
            <el-button size="small" class="colorB" type="text" @click="jumpPage({ name: 'techDocument', query: { id: scope.row.id } })" >技术文档</el-button>
            <el-button size="small" class="colorC" type="text" @click="jumpPage({ name: 'editService', query: { id: scope.row.id } })" >编辑</el-button>
            <el-button size="small" class="colorD" type="text" @click="deleteRowData(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <br>
    <el-row class="text_center">
      <el-pagination
        :total="totalNumber"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15, 30]"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </el-row>
  </div>
</template>
<script>
import { getServiceClassTreeList, getServiceList, delService } from '@/api/dataService'
import { cutStringByNum, formatTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  filters: {
    // 字符串转换
    stringFormatter(str) {
      return cutStringByNum(str, 15)
    }
  },
  data() {
    return {
      serviceClassTreeData: [],
      serviceClassProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      selectedOptions: [],
      searchKey: '',
      tableData: [],
      loading: false,
      currentPage: 1,
      totalNumber: null,
      pageSize: 5,
      currentClassId: ''
    }
  },
  computed: {
    ...mapGetters([
      'dictList'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      this.loading = true
      await getServiceClassTreeList().then(res => {
        this.serviceClassTreeData = res.data
      })
      await this.setDefultSelectedOptions(this.serviceClassTreeData)
      // console.log(this.selectedOptions)
      this.handleChange(this.selectedOptions)
    },
    // 分页 归零
    initPagination() {
      this.currentPage = 1
      this.totalNumber = null
    },
    // 获取第一组默认值
    async setDefultSelectedOptions(arr) {
      this.selectedOptions.push(arr[0].id)
      if (arr[0].children) {
        this.setDefultSelectedOptions(arr[0].children)
      }
    },
    // 加载服务列表表格
    async loadingTableData() {
      getServiceList({
        id: this.currentClassId,
        pageSize: this.pageSize,
        pageNow: this.currentPage,
        keyword: this.searchKey
      }).then(responce => {
        this.tableData = responce.data.result
        this.totalNumber = responce.total
        this.loading = false
      })
    },
    // 查询
    querySearch() {
      this.loadingTableData()
    },
    // 改变每页显示多少条
    handleSizeChange(val) {
      this.pageSize = val
      this.loadingTableData()
    },
    // 改变当前显示第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadingTableData()
    },
    // 级联选择改变时
    handleChange(arr) {
      const arrLength = arr.length - 1
      this.currentClassId = arr[arrLength]
      this.initPagination()
      this.loadingTableData()
    },
    formatTime(val) {
      return formatTime(val.rel_time, '{y}-{m}-{d}')
    },
    // 跳转页面
    jumpPage(params) {
      this.$router.push(params)
    },
    deleteRowData(row) {
      this.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delService({ id: row.id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新表格
          this.initPagination()
          this.loadingTableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped>
.el-cascader {
  width: 100%;
  padding-right: 20px;
}
</style>

