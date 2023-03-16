<template>
  <div>
    <el-dialog
      :title="isEdit?'编辑部门':'添加子部门'"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="dialogCloseFn"
    >
      <!-- close-on-click-modal: 是否可以通过点击 modal 关闭 Dialog
      close-on-press-escape	是否可以通过按下 ESC 关闭 Dialog
      show-close	是否显示关闭按钮 -->
      <!-- 总结：我们首先在index.vue 上实现引入 并赋给它初值 初始值决定了叶面加载时样子 -->
      <!-- 通过子页面将 dialogVisible 传递给index.vue 但我们必须遵守 vue底层机制 不能直接传 于是通过 两个方法传递-->
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>

        <el-form-item label="部门编码" prop="code" style="width:80%" placeholder="1-50个字符">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>

        <el-form-item label="部门负责人" prop="manager" style="width:80%" placeholder="请选择">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <el-option v-for="item in employeesList" :key="item.id" :value="item.username" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="enterFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // props将父组件方法（数据）传递给子组件。
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    employeesList: {
      type: Array,
      default: () => []
    },
    originList: {
      type: Array,
      default: () => []
    },
    parentId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 校验部门名字是否重复 思路是在点击 添加子部门时 根据子部门的pid都一样 去排除 也就是用户输入的不能是这几给相同pid 的名字
    const validName = (rule, value, callback) => {
      let existNameList = this.originList.filter(item => item.pid === this.parentId).map(item => item.name)
      // 如果是编辑的情况
      if (this.isEdit) {
        // 找到部门的当前对象
        const dept = this.originList.find(item => item.id === this.parentId)
        console.log(dept)
        // 取出父级的 id (当前对象的pid)
        const pid = dept.pid
        // 过滤，筛选出同一级别的数据, 但是id不包含当前编辑部门的id, 映射返回name名字数组
        existNameList = this.originList
          .filter(item => item.pid === pid && item.id !== this.parentId)
          .map(item => item.name)
      }
      existNameList.includes(value) ? callback(new Error('这个部门下这个名字' + value + '已经被占用了')) : callback()
    }
    // 获取点击的id
    // 定义自定义规则 // 校验部门编码是否重复
    const validCode = (rule, value, callback) => {
      // 判断是否能否找到对应的部门，如果找到了则返回该对象
      let existCodeList = this.originList.map(item => item.code)
      // 如果是编辑状态，则将需要编辑的这一项排除在外
      if (this.isEdit) {
        existCodeList = this.originList.filter(item => item.id !== this.parentId).map(item => item.code)
      }
      // 如果存在该对象，则说明编码已经存在，抛出错误
      existCodeList.includes(value) ? callback(new Error(`这个部门编码${value}已经被使用了`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 取消-点击事件
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    // 确定-点击事件
    enterFn() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          // 将数据发送到父组件
          this.$emit('addDepartEV', { ...this.form })
          // 控制dialog 界面更新和增加
          this.$emit('update:dialogVisible', false)
        }
      })
      // console.log(this.form)
    },
    // 关闭后触发的回调
    dialogCloseFn() {
      // 对该表单项进行重置，将其值重置为初始值并移除校验结果
      // this.$refs.deptForm.resetFields()
      // console.log('fff', this.$refs.deptForm)
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
