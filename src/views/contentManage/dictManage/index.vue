<template>
  <div class="grid-content">
    <span>类型：</span>
    <el-select v-model="searchType" placeholder="请选择类型" @:change="querySearch">
      <el-option label="全部" value="" />
      <el-option
        v-for="item in dictList"
        v-if="item.parentCode =='0'"
        :key="item.dictCode"
        :label="item.dictName"
        :value="item.dictCode" />
    </el-select>
    <span>字典值：</span>
    <el-input
      v-model="searchKey"
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      @:change="querySearch"
      @keyup.enter.native="querySearch" />
    <el-button size="small" type="primary" @click="addRootDict()">添加</el-button>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%" height="300">
      <el-table-column type="index" width="50" />
      <el-table-column prop="dictCode" label="dictCode" min-width="180" />
      <el-table-column prop="dictName" label="dictName" min-width="180" />
      <el-table-column prop="dictValue" label="dictValue" min-width="180" />
      <el-table-column prop="dictState" label="dictState" min-width="180" />
      <el-table-column prop="parentCode" label="parentCode" min-width="180" />
      <el-table-column prop="parentName" label="parentName" min-width="180" />
      <el-table-column prop="updateTime" label="updateTime" min-width="180" />
      <el-table-column prop="updateUser" label="updateUser" min-width="180" />
      <el-table-column prop="createUser" label="createUser" min-width="180" />
      <el-table-column prop="createTime" label="createTime" min-width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="addChildDict(scope.row)">添加</el-button>
          <el-button size="small" type="text" @click="deleteDict(scope.row)">删除</el-button>
          <el-button size="small" type="text" @click="editDict(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :total="totalNumber"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="mode=='add'?'添加':'编辑'" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-position="right" label-width="180px">
        <template v-if="isRootDict != true" >
          <el-form-item label="类别：" prop="parentName">
            <el-input v-model="form.parentName" :disabled="true" />
          </el-form-item>
        </template>
        <el-form-item label="字典名称：" prop="dictName">
          <el-input v-model="form.dictName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { Message } from 'element-ui'
import { dictList } from '@/api/common.js'
import { dictList as pageDictList, addDict, updateDict, delDict } from '@/api/dictManage.js'
export default {
  data() {
    return {
      searchType: '',
      dictList: '',
      imageUrl: '',
      searchKey: null,
      loading: false,
      tableData: null,
      currentPage: 1,
      pageSize: 5,
      totalNumber: 0,
      mode: 'add',
      dialogFormVisible: false,
      isRootDict: false,
      form: {
        dictName: '',
        dictCode: '',
        parentCode: '',
        parentName: ''
      },
      rules: {
        dictName: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 不能超过 20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingTableData()
    }, 300)
  },
  methods: {
    // 查询
    querySearch() {
      console.log('===================查询关键字======================')
      console.log(this.searchKey)
      this.currentPage = 1
      this.loadingTableData()
    },
    // 改变每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.currentPage = 1
      this.loadingTableData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(`当前页: ${this.currentPage}`)
      this.currentPage = val
      this.loadingTableData()
    },
    // 添加根节点
    addRootDict() {
      this.isRootDict = true
      this.mode = 'add'
      this.form = {
        dictName: '',
        dictCode: '',
        parentName: '',
        parentCode: 0
      }
      this.dialogFormVisible = true
    },
    // 添加子节点
    addChildDict(row) {
      console.log(row)
      this.isRootDict = false
      this.mode = 'add'
      this.form = {
        dictName: '',
        dictCode: '',
        parentName: row.dictName,
        parentCode: row.dictCode
      }
      this.dialogFormVisible = true
    },
    // 编辑字典信息
    editDict(row) {
      if (row.parentCode === '0') {
        this.isRootDict = true
      } else {
        this.isRootDict = false
      }
      this.mode = 'edit'
      this.form = row
      this.dialogFormVisible = true
    },
    // 删除字段信息
    deleteDict(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        delDict({ dictCode: row.dictCode }).then(response => {
          console.log(this.tableData.length)
          if (this.tableData.length === 1) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1
            }
          }
          this.loadingTableData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    loadingTableData() {
      dictList().then(res => {
        this.dictList = res.data
      })
      pageDictList({
        pageNow: this.currentPage,
        pageSize: this.pageSize,
        dictCode: this.searchType,
        keyword: this.searchKey }).then(res => {
        this.dictList = res.data
        this.tableData = res.data
        this.totalNumber = res.total
      })
    },
    closeDialog() {
      this.dialogFormVisible = false
    },
    // 提交表单
    submitForm(formName) {
      console.log(this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.mode === 'add') {
            addDict(this.form).then(response => {
              // 刷新表格
              this.loadingTableData()
              this.closeDialog()
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            })
          } else {
            updateDict(this.form).then(response => {
              // 刷新表格
              this.loadingTableData()
              this.closeDialog()
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
// .grid-content{
//   margin: 30px;
// }
.el-table{
  margin-top: 18px;
}
.el-pagination{
  text-align: right;
}
.el-input {
  width: 180px;
}
.el-dialog__body {
  height: auto;
}
.avatar-uploader{
  img{
    height: 100px;
  }
}
</style>
