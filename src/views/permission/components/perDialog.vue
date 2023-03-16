<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="isEdit?'编辑权限点':'新增权限点'" :visible="showDialog" @close="closedialogfn">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnsubmit">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 是否显示弹层
    isEdit: {
      type: Boolean,
      default: false
    },
    fpermissionlist: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validName = (rule, value, callback) => {
      // 添加时的校验： 名字不能取子元素的名字
      let nameList = this.fpermissionlist.filter(item => item.pid === this.formData.pid)
      // 编辑时的校验： 名字不能取兄弟（排除自己）的名字
      // 找兄弟，排除自己
      if (this.isEdit) {
        nameList = this.fpermissionlist.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id)
      }
      nameList.map(item => item.name).includes(value) ? callback(new Error(`权限点${value}名字已经存在,将不会呈现`)) : callback()
    }
    const validCode = (rule, value, callback) => {
      const codeList = this.fpermissionlist.map(item => item.code)
      codeList.includes(value) ? callback(new Error(`权限标识${value}已经存在,将不会呈现`)) : callback()
    }
    return {
      showDialog: false,
      permissionList: [], // 权限管理列表数据
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型吖
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击确定增加权限
    btnsubmit() {
      this.$refs.perForm.validate(async valid => {
        if (valid) {
          console.log('点击确定增加权限this.formData', this.formData)
          // 做拷贝 防止发送数据时 导致axios 发送空数据
          this.$emit('addper', { ...this.formData })
        }
      })
      this.showDialog = false
    },
    // 点击取消
    btnCancel() {
      this.showDialog = false
      // this.formData = this.$options.data().formData
    },
    // 点击新增权限
    closedialogfn() {
      this.$refs.perForm.resetFields()
      // 清楚表单中的数据
      this.formData = this.$options.data().formData
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

