<template>
  <el-row class="text-center">
    <el-col :xl="18" :md="18" :sm="24">
      <el-form ref="ruleForm" :model="ruleForm" :disabled="isDisabled" :rules="rules" label-width="150px" class="demo-ruleForm">
        <h5>{{ statusNum == '1'?"查看服务分类详情":statusNum == '2'?"添加服务分类":statusNum == '3'?"编辑服务分类":'' }}</h5>
        <el-form-item label="服务名称：">
          <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入服务分类名称"/>
        </el-form-item>
        <el-form-item label="服务描述：">
          <el-input v-model="ruleForm.descr" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" auto-complete="off" placeholder="请输入服务分类描述"/>
        </el-form-item>
        <el-form-item label="服务图标：">
          <el-input v-model="ruleForm.icon" auto-complete="off" placeholder="请输入图标名"/>
        </el-form-item>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="服务是否推荐：">
            <el-select v-model="ruleForm.rec_num" placeholder="请选择">
              <el-option
                v-for="item in dictList"
                v-if="item.parentCode =='016'"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="服务推荐等级：">
            <el-select v-model="ruleForm.leaf" placeholder="请选择">
              <el-option
                v-for="item in recommendList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="24" :sm="24">
          <el-form-item label="服务banner图：">
            <image-dispaly-panel :init-select="ruleForm.img" img-type-id="013004" @setSelectValue="setIconValue"/>
          </el-form-item>
        </el-col>
        <el-col v-if="statusNum == '2' || statusNum == '3'" :span="24" class="text_center">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-col>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import ImageDispalyPanel from '@/components/ImageDispalyPanel'
import { getServiceClassInfoById, addRowData, editRowData } from '@/api/serviceClass'
export default {
  components: {
    ImageDispalyPanel
  },
  props: {
    isDisabled: {
      default: false,
      type: Boolean,
      required: true
    },
    classId: {
      required: true,
      type: String,
      default: ''
    },
    pClassId: {
      required: true,
      type: String,
      default: ''
    },
    status: {
      required: true,
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        descr: '',
        icon: '',
        img: '',
        rec_num: '',
        leaf: ''
      },
      rules: {
        name: { required: true, message: '请输入服务名称', trigger: 'blur' },
        descr: { required: true, message: '请输入服务描述', trigger: 'blur' },
        icon: { required: true, message: '请输入服务图标', trigger: 'blur' },
        img: { required: true, message: '请选择服务banner', trigger: 'change' },
        rec_num: { required: true, message: '请选择服务是否推荐：', trigger: 'change' },
        leaf: { required: true, message: '请选择服务推荐等级', trigger: 'change' }
      },
      recommendList: [
        { id: 0, name: '优先级0' },
        { id: 1, name: '优先级1' },
        { id: 2, name: '优先级2' },
        { id: 3, name: '优先级3' },
        { id: 4, name: '优先级4' },
        { id: 5, name: '最高级' }
      ],
      statusNum: ''
    }
  },
  computed: {
    ...mapGetters([
      'dictList'
    ])
  },
  watch: {
    status() {
      this.init()
      this.$refs['ruleForm'].resetFields()
    }
  },
  methods: {
    init() {
      this.statusNum = this.status.substring(0, 1)
      this.ruleForm.img = '' + (Math.floor(Math.random() * 900) + 100)
      if (this.statusNum === '2') {
        // 添加子节点
        console.log('添加子节点')
        console.log(this.ruleForm.img)
        setTimeout(() => {
          this.ruleForm = {
            name: '',
            descr: '',
            icon: '',
            img: '',
            rec_num: '',
            leaf: ''
          }
        }, 100)
        return
      }
      if (this.statusNum === '1' || this.statusNum === '3') {
        // 1:查看节点 3:编辑节点
        console.log('1:查看节点 3:编辑节点')
        getServiceClassInfoById({ id: this.classId }).then(res => {
          if (res.data !== null) {
            if (!res.data.img) {
              res.data.img = ''
            }
            this.ruleForm = res.data
          } else {
            this.isDisabled = true
            this.$message({
              type: 'info',
              message: '错误：未获取正确id!'
            })
            this.ruleForm = {
              name: '',
              descr: '',
              icon: '',
              img: '',
              rec_num: '',
              leaf: ''
            }
          }
        })
        return
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.statusNum === '2') {
            // 添加服务分类
            this.ruleForm.p_id = this.pClassId
            addRowData(this.ruleForm).then(response => {
              this.ruleForm.id = response.data
              this.$emit('changeTreeData', this.ruleForm)
              this.$message({
                type: 'success',
                message: '添加服务分类成功!'
              })
            })
          }
          if (this.statusNum === '3') {
            // 编辑服务分类
            this.ruleForm.id = this.classId
            editRowData(this.ruleForm).then(response => {
              this.$emit('changeTreeData', this.ruleForm)
              this.$message({
                type: 'success',
                message: '编辑服务分类成功!'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    setIconValue(val) {
      this.ruleForm.img = val
    }
  }
}
</script>
<style scoped>
.el-select{
  width: 100%;
}
</style>
