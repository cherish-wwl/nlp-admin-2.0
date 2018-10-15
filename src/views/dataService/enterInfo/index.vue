<template>
  <div>
    <el-row>
      <el-form
        ref="ruleForm"
        :model="enterInfo"
        :rules="rules"
        label-width="140px"
        label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="接入方式：" prop="accessWay">
              <el-radio-group v-model="enterInfo.accessWay" @change="changeAccessWay">
                <el-radio v-for="item in dictList" v-if="item.parentCode =='002'" :key="item.dictCode" :label="item.dictCode" >
                  {{ item.dictName }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接入状态：" prop="accessState">
              <el-select v-model="enterInfo.accessState" placeholder="请选择">
                <el-option
                  v-for="item in dictList"
                  v-if="item.parentCode =='003'"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开发模式：" prop="accessModel">
              <el-select v-model="enterInfo.accessModel" placeholder="请选择">
                <el-option
                  v-for="item in dictList"
                  v-if="item.parentCode =='008'"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="服务器信息：" prop="serverId" >
              <el-table
                ref="singleTable"
                :data="tableData"
                :highlight-current-row="tableDataDisable?false:true"
                border
                height="calc(25vh)"
                style="width: 100%"
                @current-change="handleCurrentChange">
                <el-table-column prop="id" label="" width="50">
                  <template slot-scope="scope">
                    <el-radio v-model="enterInfo.serverId" :disabled="tableDataDisable" :label="scope.row.id">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="innerIP" label="innerIP" width="180"/>
                <el-table-column prop="innerPort" label="innerPort" width="180"/>
                <el-table-column prop="limitTime" label="limitTime" width="180"/>
                <el-table-column prop="natAccount" label="natAccount" width="180"/>
                <el-table-column prop="outerIP" label="outerIP" width="180"/>
                <el-table-column prop="outerPort" label="outerPort" width="180"/>
                <el-table-column prop="strategyNo" label="strategyNo" width="180"/>
                <el-table-column prop="reverse" label="reverse" width="180"/>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署目录：" prop="deployPath">
              <el-input
                v-model="enterInfo.deployPath"
                :disabled="!(enterInfo.accessWay =='002002')"
                placeholder="请输入部署目录"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问地址：" prop="visitURL">
              <el-input
                v-model="enterInfo.visitURL"
                :disabled="enterInfo.accessWay =='002002'"
                placeholder="请输入访问地址"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人：" prop="contactPerson">
              <el-input v-model="enterInfo.contactPerson" placeholder="请选择联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话：" prop="contactTel">
              <el-input v-model="enterInfo.contactTel" placeholder="请输入联系人电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="泰岳对接人：" prop="accessPerson">
              <el-input v-model="enterInfo.accessPerson" placeholder="请输入泰岳对接人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="text_center">
          <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { getServerList } from '@/api/server.js'
import { addServiceEntryInfo, getServiceEntryInfo, updateServiceEntryInfo } from '@/api/dataService.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    var checkServerId = (rule, value, callback) => {
      if (this.enterInfo.serverId === null || this.enterInfo.serverId === '') {
        callback(new Error('请选择服务器'))
      } else {
        callback()
      }
    }
    return {
      serviceId: '',
      enterInfo: {
        accessWay: '002001', // 接入类型
        accessState: '',
        accessModel: '',
        deployPath: '',
        visitURL: '',
        contactPerson: '',
        contactTel: '',
        accessPerson: '',
        accessId: this.serviceId, // 服务id
        serverId: '' // 服务器id
      },
      currentRow: null,
      defauleTableData: [],
      tableData: [],
      rules: this.urlRules,
      defaultRules: {
        accessWay: [
          { required: true, message: '请选择接入方式', trigger: 'change' }
        ],
        accessState: [
          { required: true, message: '请选择接入状态', trigger: 'change' }
        ],
        serverId: [
          { required: true, validator: checkServerId, trigger: 'change' }
        ],
        accessModel: [
          { required: true, message: '请选择开发模式', trigger: 'change' }
        ],
        deployPath: [
          { required: true, message: '请输入部署目录', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '请选择联系人', trigger: 'blur' }
        ],
        contactTel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        accessPerson: [
          { required: true, message: '请输入泰岳对接人', trigger: 'blur' }
        ]
      },
      urlRules: {
        accessWay: [
          { required: true, message: '请选择接入方式', trigger: 'change' }
        ],
        accessState: [
          { required: true, message: '请选择接入状态', trigger: 'change' }
        ],
        accessModel: [
          { required: true, message: '请选择开发模式', trigger: 'change' }
        ],
        visitURL: [
          { required: true, message: '请输入访问地址', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '请选择联系人', trigger: 'change' }
        ],
        contactTel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        accessPerson: [
          { required: true, message: '请输入泰岳对接人', trigger: 'blur' }
        ]
      },
      isEditMode: false,
      tableDataDisable: false
    }
  },
  computed: {
    ...mapGetters([
      'dictList'
    ])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 加载 服务器列表数据
      getServerList().then(response => {
        this.tableData = response.data
      })
      getServiceEntryInfo({ serviceId: this.$route.query.id }).then(response => {
        if (response.data === null) {
          // 为添加状态
          this.isEditMode = false
          // 默认选中 第一个 接入方式
          this.dictList.forEach(element => {
            if (element.parentCode === '002') {
              this.enterInfo.accessWay = element.dictCode
              return
            }
          })
          // 根据接入方式 选择 表单验证规则
          this.changeAccessWay(this.enterInfo.accessWay)
          // 表单清空验证
          setTimeout(() => {
            this.$refs['ruleForm'].clearValidate()
          }, 100)
        } else {
          // 为编辑状态
          this.isEditMode = true
          // 获取服务接入信息 进行 初始化赋值
          this.enterInfo = response.data
          this.changeAccessWay(this.enterInfo.accessWay)
        }
      })
    },
    // 改变接入方式
    changeAccessWay(val) {
      if (val === '002002') {
        // 需要部署服务
        this.rules = this.defaultRules
        this.tableDataDisable = false
        this.enterInfo.visitURL = ''
      } else {
        this.rules = this.urlRules
        this.tableDataDisable = true
        this.enterInfo.serverId = ''
        this.enterInfo.deployPath = ''
      }
      this.enterInfo.accessWay = val
      // 表单清空验证
      setTimeout(() => {
        this.$refs['ruleForm'].clearValidate()
      }, 100)
    },
    // 服务器表格选中事件
    handleCurrentChange(val) {
      // // 当前选中表格的行数据
      // console.log("+++++++++++++++++++当前选中表格的行数据+++++++++++++++++++++++")
      // console.log(val)
      this.enterInfo.serverId = val.id
      this.$refs['ruleForm'].validate((valid) => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.enterInfo.accessId = this.$route.query.id || ''
          if (this.isEditMode) {
            // alert("update");
            updateServiceEntryInfo(this.enterInfo).then(response => {
              this.$message({
                message: '保存接入信息成功！',
                type: 'success'
              })
            })
          } else {
            // alert("add")
            addServiceEntryInfo(this.enterInfo).then(response => {
              this.$message({
                message: '保存接入信息成功！',
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
<style scoped>

</style>
