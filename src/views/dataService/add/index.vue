<template>
  <el-col :xl="15" :md="15" :xs="20">
    <el-form ref="ruleForm" :model="serviceInfo" :rules="rules" label-width="150px" class="demo-ruleForm">
      <el-form-item label="服务名称：" prop="serviceName">
        <el-input v-model="serviceInfo.serviceName" placeholder="请输入服务名称" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属类型：" prop="class_id_array">
            <el-cascader
              :show-all-levels="false"
              v-model="serviceInfo.class_id_array"
              :props="serviceClassProps"
              :options="serviceClassTreeData"
              expand-trigger="hover"
              placeholder="请选择服务分类"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所有者：" prop="professorIdArray">
            <el-cascader
              :show-all-levels="false"
              v-model="serviceInfo.professorIdArray"
              :props="professorProps"
              :options="possessorTreeData"
              expand-trigger="hover"
              placeholder="请选择所有者"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="服务描述：" prop="serviceDescr">
        <el-input v-model="serviceInfo.serviceDescr" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="请输入服务描述"/>
      </el-form-item>
      <el-form-item label="输入参数：" prop="in_arg">
        <el-input v-model="serviceInfo.in_arg" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="请输入输入参数"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="服务调用方式：" prop="methodType">
            <el-select v-model="serviceInfo.methodType" placeholder="请选择">
              <el-option
                v-for="item in dictList"
                v-if="item.parentCode =='001'"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务状态：" prop="serviceState">
            <el-select v-model="serviceInfo.serviceState" placeholder="请选择">
              <el-option
                v-for="item in dictList"
                v-if="item.parentCode =='003'&& item.dictCode != '003000'"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="12">
          <el-form-item label="服务调用路径：" prop="url">
            <el-input v-model="serviceInfo.url" :autosize="{ minRows: 1, maxRows: 4}" type="textarea" placeholder="请输入服务调用路径"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="banner路径：">
            <el-input v-model="serviceInfo.banner" :autosize="{ minRows: 1, maxRows: 4}" type="textarea" placeholder="请输入banner路径"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="跳转方式：" prop="forwardType">
            <el-select v-model="serviceInfo.forwardType" placeholder="请选择">
              <el-option
                v-for="item in dictList"
                v-if="item.parentCode =='014'"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务跳转路径：" prop="innerUrl">
            <el-input v-model="serviceInfo.innerUrl" :disabled="serviceInfo.forwardType == '014001'?true:false" :autosize="{ minRows: 1, maxRows: 4}" type="textarea" placeholder="请输入服务调用路径"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图片：">
            <image-dispaly-panel :init-select="serviceInfo.serviceIcon" img-type-id="013005" @setSelectValue="setServiceIconValue"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否免费：" prop="isCharge">
            <el-select v-model="serviceInfo.isCharge" placeholder="请选择">
              <el-option
                v-for="item in dictList"
                v-if="item.parentCode =='012'"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col>
          <div class="line-style">自定义模块</div>
        </el-col>
      </el-row>
      <el-row v-for="(relate, index) in serviceInfo.relates" :key="index" class="bg_colorA customPanel">
        <a v-if="index != 0" class="closeBtn" @click="removeRelate(relate)">
          <i class="el-icon-close font20"/>
        </a>
        <el-col>
          <el-form-item label="类别：" >
            <el-select v-model="relate.relateType" class="normalSelect" placeholder="请选择">
              <el-option
                v-for="item in dictList"
                v-if="item.parentCode =='006'"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-col :span="12">
            <el-form-item label="名称：" >
              <el-input v-model="relate.title" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标：">
              <image-dispaly-panel :init-select="relate.banner" :select-index="index" img-type-id="013006" @setSelectValue="setRelateIconValue"/>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col>
          <el-form-item label="描述：">
            <el-input v-model="relate.content" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="请输入描述" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="bg_colorA text_center addRelatePanel">
        <el-button size="mini" class="font16" round @click="addRelate" >添加+</el-button>
      </el-row>
      <br>
      <el-row class="text_center">
        <el-button :disabled="sucessSubmit" type="primary" @click="submitForm('ruleForm')">{{ $route.name =="editService"? "保存编辑":"立即创建" }}</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-row>
    </el-form>
  </el-col>
</template>
<script>
import { getServiceClassTreeList, getServiceInfo, addServiceInfo, updataServiceInfo } from '@/api/dataService'
import ImageDispalyPanel from '@/components/ImageDispalyPanel'
import { possessorTreeList } from '@/api/common'
import { mapGetters } from 'vuex'
export default {
  components: {
    ImageDispalyPanel
  },
  data() {
    var validateForwordType = (rule, value, callback) => {
      if (value === '014001') {
        this.serviceInfo.innerUrl = 'default'
      } else {
        if (this.serviceInfo.innerUrl === 'default') {
          this.serviceInfo.innerUrl = ''
        }
      }
      callback()
    }
    return {
      sucessSubmit: false,
      serviceClassTreeData: [],
      serviceClassProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      serviceInfo: {
        serviceName: '',
        class_id: '',
        class_id_array: [],
        serviceDescr: '',
        in_arg: '',
        methodType: '',
        isCharge: '',
        url: '',
        forwardType: '',
        innerUrl: '',
        banner: '',
        serviceIcon: '',
        serviceState: '',
        academyId: '',
        groupId: '',
        professorId: '',
        professorIdArray: [],
        relates: [{
          relateType: '',
          title: '',
          banner: '',
          content: ''
        }]
      },
      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        class_id_array: [
          { required: true, message: '请选择所属类型', trigger: 'change' }
        ],
        methodType: [
          { required: true, message: '请选择服务调用方式', trigger: 'change' }
        ],
        isCharge: [
          { required: true, message: '请选择是否免费', trigger: 'change' }
        ],
        url: [
          { required: true, message: '请输入服务调用路径', trigger: 'change' }
        ],
        in_arg: [
          { required: true, message: '请输入输入参数', trigger: 'blur' }
        ],
        serviceState: [
          { required: true, message: '请选择服务状态', trigger: 'change' }
        ],
        professorIdArray: [
          { required: true, message: '请选择所有者', trigger: 'change' }
        ],
        forwardType: [
          { required: true, message: '请选择跳转方式', trigger: 'change' },
          { required: true, validator: validateForwordType, trigger: 'change' }
        ],
        innerUrl: [
          { required: true, message: '请输入服务跳转路径', trigger: 'blur' }
        ]
      },
      professorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      possessorTreeData: []
    }
  },
  computed: {
    ...mapGetters([
      'dictList'
    ])
  },
  mounted() {
    // 获取所属类型列表
    getServiceClassTreeList().then(res => {
      this.serviceClassTreeData = res.data
    })
    // 获取大学-机构-教授 树结构
    possessorTreeList().then(response => {
      this.possessorTreeData = response.data
    })
    // 判断是否为编辑页面
    const routeInfo = this.$route
    if (routeInfo.name === 'editService') {
      this.initEditMode(routeInfo)
    }
  },
  methods: {
    // 编辑模式下 初始化
    initEditMode(routeInfo) {
      if (routeInfo.query.id) {
        getServiceInfo({ serviceId: routeInfo.query.id }).then(res => {
          if (res.data != null) {
            this.serviceInfo = res.data
            this.serviceInfo.class_id_array = [res.data.class_id.substring(0, 3), res.data.class_id.substring(0, 6), res.data.class_id]
            this.serviceInfo.professorIdArray = [res.data.academyId, res.data.groupId, res.data.professorId]
            this.serviceInfo.id = routeInfo.query.id
          }
        })
      } else {
        this.$message({
          message: '未知错误！',
          type: 'error'
        })
        this.$router.push({ name: 'dataService' })
      }
    },
    // 设置自定义模块的 图标 字段
    setRelateIconValue(val, index) {
      // console.log("++++++++++++++++++++")
      // console.log(val)
      // console.log(index)
      this.serviceInfo.relates[index].banner = val
    },
    // 设置服务 图标 字段值
    setServiceIconValue(val) {
      this.serviceInfo.serviceIcon = val
    },
    // 删除自定义模板
    removeRelate(item) {
      var index = this.serviceInfo.relates.indexOf(item)
      if (index !== -1) {
        this.serviceInfo.relates.splice(index, 1)
      }
    },
    // 添加自定义模板
    addRelate() {
      this.serviceInfo.relates.push({
        relateType: '',
        title: '',
        banner: '',
        content: ''
      })
    },
    // 添加服务
    addService(resultData) {
      // 提交数据
      addServiceInfo(resultData).then(res => {
        this.sucessSubmit = true
        this.$confirm('服务创建成功！, 是否离开此页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'dataService' })
        }).catch(() => {

        })
      })
    },
    // 编辑服务
    editService(resultData) {
      // 提交数据
      updataServiceInfo(resultData).then(res => {
        this.sucessSubmit = true
        this.$confirm('保存服务成功！, 是否离开此页面?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'dataService' })
        }).catch(() => {

        })
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 整理数据
          const resultData = this.serviceInfo
          resultData.academyId = this.serviceInfo.professorIdArray[0]
          resultData.groupId = this.serviceInfo.professorIdArray[1]
          resultData.professorId = this.serviceInfo.professorIdArray[2]
          resultData.class_id = this.serviceInfo.class_id_array[ (this.serviceInfo.class_id_array.length - 1) ]
          delete resultData.class_id_array
          delete resultData.professorIdArray
          // 添加服务
          if (this.$route.name === 'addService') {
            this.addService(resultData)
          }
          if (this.$route.name === 'editService') {
            this.editService(resultData)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
  .el-select:not(.normalSelect) {
    width: 100%;
  }
  .customPanel{
    padding: 12px;
    margin: 20px -12px 0 0;
  }
  .addRelatePanel{
    padding: 0 0 12px 0;
    margin: 0 -12px 0 0;
  }
  .customPanel a.closeBtn {
    position: absolute;
    right: 12px;
    z-index: 2000;
  }
  .customPanel:first-child > .closeBtn{
    display: none;
  }
  .line-style{
    padding-left: 96px;
    position: relative;
    color: #295ed9;
    font-size: 18px;
    font-weight: 500;
  }
  .line-style:before {
    content: "";
    position: absolute;
    width: 85px;
    top: 50%;
    left: 0;
    border-bottom: 1px solid #ddd;
  }
  .line-style:after {
    content: "";
    width: 100%;
    position: absolute;
    top: 50%;
    left: 200px;
    border-bottom: 1px solid #ddd;
  }
</style>
