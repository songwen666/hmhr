<template>
  <!-- 表单 -->
  <el-form ref="dialogForm" label-width="120px" :rules="rules" :model="formData">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:70%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:70%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:70%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:70%" placeholder="请选择" value="">
        <el-option
          v-for="item in hireType"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:70%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:70%" placeholder="请选择部门" @focus="departmentNameFocus" />
      <div class="tree-box">
        <!-- label 指定节点标签为节点对象的某个属性值 里面的name是因为数据里有name这个属性 -->
        <!-- node-click 是其内部提供的事件 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 -->
        <el-tree
          v-show="showTree"
          :data="treeData"
          default-expand-all
          :props="{ label: 'name' }"
          @node-click="treeClick"
        />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:70%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item class="left">
      <el-button @click="addCancel">取消</el-button>
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import employees from '@/api/constant/employees'
export default {
  name: 'EmpDialog',
  props: {
    treeData: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      showTree: false, // 是否显示树形组件
      hireType: employees.hireType,
      clickDepartName: '', // 点击的部门名字
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 事件监听 监听formData.departmentName的属性变化如果被改变就用点击时的名字 已形成禁用效果
    // this.clickDepartName 点击时的名字
    'formData.departmentName'(newVal) {
      //  如果是 清楚回显 会监听一次 排除这一次情况
      if (newVal.length === 0) return
      if (newVal !== this.clickDepartName) {
        this.formData.departmentName = this.clickDepartName
      }
    }
  },
  methods: {
    addCancel() {
    //   console.log('eee')
    //   this.$emit('upadate:sDialog', false)
      this.$emit('close_empdialog', false)
    },
    addSubmit() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.$emit('update_from', { ...this.formData })
          this.$emit('close_empdialog', false)
        } else {
          this.$message.error('有错误')
        }
      })
      //   this.$emit('upadate:sDialog', false)
    },
    departmentNameFocus() {
      this.showTree = true
    },
    treeClick(data) {
      // 判断是否有孩子，有就折叠
      if (data && data.children) return
      this.formData.departmentName = data.name
      this.clickDepartName = data.name
      this.showTree = false
    }
  }

}
</script>

<style lang="scss" scoped>
.left{
    position: relative;
    top:30px;
    left: 300px;
}
</style>

