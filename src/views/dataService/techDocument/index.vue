<template>
  <el-form id="documentForm" ref="documentForm" :model="documentInfo" :rules="documentRules" label-width="140px" label-position="right" class="documentForm">
    <el-row>
      <h5 class="line-title">接口信息</h5>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属服务：" prop="serviceName">
            <el-input v-model="documentInfo.serviceName" placeholder="请输入服务名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属类型：" prop="class_id_array">
            <el-cascader
              :show-all-levels="false"
              v-model="documentInfo.class_id_array"
              :disabled="true"
              :props="serviceClassProps"
              :options="serviceClassTreeData"
              expand-trigger="hover"
              placeholder="请选择服务分类"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="接口描述：" prop="interfacetext">
          <el-input v-model="documentInfo.interfacetext" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="请输入接口描述" />
        </el-form-item>
      </el-row>
    </el-row>
    <el-row>
      <h5 class="line-title">请求说明</h5>
      <el-row>
        <el-col :span="12">
          <el-form-item label="请求方法：" prop="httpmethod">
            <el-select v-model="documentInfo.httpmethod" placeholder="请选择请求方法" >
              <el-option label="POST" value="POST"/>
              <el-option label="GET" value="GET"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求路径：" prop="globalurl">
            <el-input v-model="documentInfo.globalurl" :autosize="{ minRows: 1, maxRows: 4}" type="textarea" placeholder="请输入请求路径"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="请求参数：" prop="requestdata">
          <el-table
            v-loading="loading"
            ref="requestTable"
            :data="documentInfo.requestdata"
            border
            style="width: 100%"
            @select="checkedRequestLines">
            <!-- paraname（参数名）	type（参数类型）	value（值:用不上）	explain_（参数描述）needorno（是否必填）	linktype（请求参数/返回参数）	range_（取值范围） -->
            <el-table-column type="selection" width="35"/>
            <el-table-column prop="paraname" label="参数" min-width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.paraname"/>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择参数类型" >
                  <el-option v-for="(item,index) in typeArray" :key="index" :label="item" :value="item"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="explain_" label="描述" min-width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.explain_"/>
              </template>
            </el-table-column>
            <el-table-column prop="needorno" label="是否必填" min-width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.needorno" placeholder="请选择是否必填" >
                  <el-option label="是" value="是"/>
                  <el-option label="否" value="否"/>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <br >
          <el-row>
            <el-button type="text" @click="addData('request')"> 添加</el-button>
            <el-button type="text" @click="deleteData('request')"> 删除选中行</el-button>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="请求示例：" prop="bodyexample">
          <el-input v-model="documentInfo.bodyexample" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="请输入请求示例" />
        </el-form-item>
      </el-row>
    </el-row>
    <el-row>
      <h5 class="line-title"><span>返回说明</span></h5>
      <el-row>
        <el-form-item label="返回参数：" prop="backdata">
          <el-table
            v-loading="loading"
            ref="backTable"
            :data="documentInfo.backdata"
            border
            style="width: 100%"
            @select="checkedBackLines">
            <!-- paraname（参数名）	type（参数类型）	value（值:用不上）	explain_（参数描述）needorno（是否必填）	linktype（请求参数/返回参数）	range_（取值范围） -->
            <el-table-column type="selection" width="35"/>
            <el-table-column prop="paraname" label="参数" min-width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.paraname" placeholder="请输入参数名"/>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" min-width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择参数类型" >
                  <el-option v-for="(item,index) in typeArray" :key="index" :label="item" :value="item"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="explain_" label="描述" min-width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.explain_" placeholder="请输入参数描述"/>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-row>
            <el-button type="text" @click="addData('back')"> 添加</el-button>
            <el-button type="text" @click="deleteData('back')"> 删除选中行</el-button>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="返回示例：" prop="backexample">
          <el-input v-model="documentInfo.backexample" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="请输入请求示例" />
        </el-form-item>
      </el-row>
    </el-row>
    <el-row class="text_center">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button type="primary" @click="rebackMethods">返回</el-button>
    </el-row>
  </el-form>
</template>
<script>
import { getTechDocument, addTechDocument, updateTechDocument } from '@/api/document'
import { getServiceClassTreeList, getServiceInfo } from '@/api/dataService'
export default {
  data() {
    return {
      tableData: [],
      typeArray: ['Byte', 'Short', 'Char', 'Long', 'Int', 'Float', 'Double', 'String', 'Date'],
      loading: false,
      techDocumentExistence: false,
      deleteRequestList: [],
      deleteBackList: [],
      documentInfo: {
        serviceId: '',
        serviceName: '',
        requestdata: [],
        backdata: [],
        class_id_array: []
      },
      documentRules: {
        httpmethod: [
          { required: true, message: '请选择请求方法', trigger: 'change' }
        ],
        globalurl: [
          { required: true, message: '请输入请求方式', trigger: 'blur' }
        ]
      },
      serviceId: '',
      serviceClassTreeData: [],
      serviceClassProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化数据
    init() {
      if (this.$route.query.id) {
        this.loading = true
        this.serviceId = this.$route.query.id
        // 获取所属类型列表
        getServiceClassTreeList().then(res => {
          this.serviceClassTreeData = res.data
        })
        // 获取服务基础信息
        getServiceInfo({ serviceId: this.serviceId }).then(res => {
          this.documentInfo.class_id_array = [res.data.class_id.substring(0, 3), res.data.class_id.substring(0, 6), res.data.class_id]
          const serviceInfo = res.data
          if (serviceInfo.techDocumentExistence) {
            // 已存在文档
            getTechDocument({ serviceId: this.serviceId }).then(res => {
              this.loading = false
              this.addTableIndexMethod(res.data.requestdata)
              this.addTableIndexMethod(res.data.backdata)
              this.documentInfo = res.data
              this.documentInfo.serviceId = this.serviceId
              this.documentInfo.serviceName = serviceInfo.serviceName
              this.documentInfo.class_id_array = [serviceInfo.class_id.substring(0, 3), serviceInfo.class_id.substring(0, 6), serviceInfo.class_id]
            })
          } else {
            this.loading = false
          }
          this.documentInfo.serviceId = this.serviceId
          this.documentInfo.serviceName = serviceInfo.serviceName
          this.techDocumentExistence = serviceInfo.techDocumentExistence
        })
      } else {
        this.rebackMethods()
      }
    },
    // 添加一行请求参数/返回参数
    addData(type) {
      var appendData
      if (type === 'request') {
        appendData = {
          paraname: '',
          type: '',
          explain_: '',
          needorno: '',
          linktype: 'request'
        }
        this.documentInfo.requestdata.push(appendData)
        this.addTableIndexMethod(this.documentInfo.requestdata)
      }
      if (type === 'back') {
        appendData = {
          paraname: '',
          type: '',
          explain_: '',
          linktype: 'back'
        }
        this.documentInfo.backdata.push(appendData)
        this.addTableIndexMethod(this.documentInfo.backdata)
      }
    },
    // 添加一行请求参数/返回参数
    deleteData(type) {
      if (type === 'request') {
        this.deleteRequestList.forEach(element => {
          this.documentInfo.requestdata.forEach((element1, index) => {
            if (element.tableIndex === element1.tableIndex) {
              this.documentInfo.requestdata.splice(index--, 1)
            }
          })
        })
        // 清空选中效果
        this.deleteRequestList = []
        this.$refs.requestTable.clearSelection()
      }
      if (type === 'back') {
        this.deleteBackList.forEach(element => {
          this.documentInfo.backdata.forEach((element1, index) => {
            if (element.tableIndex === element1.tableIndex) {
              this.documentInfo.backdata.splice(index--, 1)
            }
          })
        })
        // 清空选中效果
        this.deleteBackList = []
        this.$refs.backTable.clearSelection()
      }
    },
    // 获取选中的返回参数的数据
    checkedBackLines(val) {
      // console.log("当前返回选中的有：")
      // console.log(val)
      this.deleteBackList = val
    },
    // 获取选中的请求参数的数据
    checkedRequestLines(val) {
      this.deleteRequestList = val
    },
    // 给请求参数表格和返回参数表格 数据 添加index 唯一标识  用于删除
    addTableIndexMethod(data) {
      // console.log("添加index")
      data.forEach((element, index) => {
        // console.log(element)
        element.tableIndex = index++
      })
    },
    // 保存技术文档
    submitForm() {
      this.$refs['documentForm'].validate((valid) => {
        if (valid) {
          // console.log(this.documentInfo)
          if (this.techDocumentExistence) {
            updateTechDocument(this.documentInfo).then(res => {
              this.$confirm('更新服务技术文档成功！, 是否离开此页面?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.rebackMethods()
              }).catch(() => {

              })
            })
          } else {
            addTechDocument(this.documentInfo).then(res => {
              this.$confirm('添加服务技术文档成功！, 是否离开此页面?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.rebackMethods()
              }).catch(() => {

              })
            })
          }
        }
      })
    },
    // 返回上一级
    rebackMethods() {
      this.$router.push({ name: 'dataService' })
    }
  }
}
</script>
<style  scoped rel="stylesheet/scss" lang="scss">
@import "@/styles/variables.scss";
.documentForm{
  padding: 0 20px;
  h5.line-title{
    position: relative;
    padding-left: 10%;
    font-weight: normal;
    color: $colorF;
    &:before{
      content: '';
      position: absolute;
      height: 1px;
      left: 0;
      right: 91%;
      top: 50%;
      background-color: $colorE;
    }
    &:after{
      content: '';
      position: absolute;
      height: 1px;
      left: 17%;
      right: 0;
      top: 50%;
      background-color:$colorE;
    }
  }
}
</style>
<style scoped>
.el-cascader {
  width: 100%;
  padding-right: 20px;
}
</style>
