<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-tree
        ref="tree"
        :data="classData"
        :props="treeProps"
        :expand-on-click-node="false"
        :render-content="renderContent"
        node-key="id"
        default-expand-all />
    </el-col>
    <el-col :span="16">
      <detail :is-disabled="isDisabled" :p-class-id="pClassId" :class-id="classId" :status="status" @changeTreeData="changeTreeData"/>
    </el-col>
  </el-row>
</template>
<script>
import Detail from './components/Detail'
import { getServiceClassTreeList } from '@/api/dataService'
import { delRowData } from '@/api/serviceClass'
export default {
  components: {
    Detail
  },
  data() {
    return {
      classData: [],
      treeProps: {
        label: 'name',
        id: 'id'
      },
      isDisabled: true,
      classId: '',
      pClassId: '',
      status: '1'
    }
  },
  created() {
    // 获取树结构列表
    getServiceClassTreeList().then(res => {
      this.classData = JSON.parse(JSON.stringify(res.data))
    })
  },
  methods: {
    // 添加分类
    append(data) {
      this.pClassId = data.id
      this.classId = ''
      this.isDisabled = false
      this.status = '2' + (Math.floor(Math.random() * 900) + 100)
    },
    // 删除分类
    remove(node) {
      if (node.data.children) {
        // 当前节点下 有子节点
        this.$message({
          type: 'info',
          message: '请先删除子节点！'
        })
        return
      }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRowData({ id: node.data.id }).then(response => {
          this.$refs.tree.remove(node)
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
    // 点击分类事件： 展示服务分类详情信息
    clickNode(data) {
      console.log(data)
      this.classId = data.id
      this.pClassId = ''
      this.isDisabled = true
      this.status = '1' + (Math.floor(Math.random() * 900) + 100)
    },
    // 编辑服务分类信息
    editNode(node, data) {
      // console.log(node)
      // data.name = "123123"
      this.classId = data.id
      this.pClassId = ''
      this.isDisabled = false
      this.status = '3' + (Math.floor(Math.random() * 900) + 100)
    },
    // 改变树结构信息
    changeTreeData(info) {
      const statusNum = this.status.substring(0, 1)
      if (statusNum === '2') {
        // 添加
        const nodeValue = this.$refs.tree.getNode(info.p_id)
        this.$refs.tree.append({ id: info.id, name: info.name }, nodeValue)
      }
      if (statusNum === '3') {
        // 编辑
        this.$refs.tree.getNode(info.id).data.name = info.name
      }
    },
    // 选中tree 后缀标签
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <label>
            <input name='treeNode' type='radio' />
            &nbsp;&nbsp;
            <span class='font14' on-click={ () => this.clickNode(data) }>{ node.label }</span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <el-button size='mini' type='text' on-click={ () => this.append(data) }>添加子节点</el-button>
              <el-button size='mini' type='text' on-click={ () => this.editNode(node, data) }>编辑</el-button>
              <el-button size='mini' type='text' on-click={ () => this.remove(node) }>删除</el-button>
            </span>
          </label>
        </span>)
    }
  }
}
</script>
<style>
  .custom-tree-node{
    width: 100%;
  }
  .custom-tree-node label{
    font-weight: normal;
  }
</style>
