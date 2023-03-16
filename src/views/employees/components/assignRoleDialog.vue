<template>
  <div>
    <!-- 渲染角色列表 -->
    <!-- label 会跟 v-model 配对 -->
    <el-checkbox-group v-model="roleIdList">
      <el-checkbox v-for="val in allRoleList " :key="val.id" :label="val.id">
        <span>{{ val.name }}</span>
      </el-checkbox>
    </el-checkbox-group>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="addRoleFn">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    },
    allRoleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleIdList: [] // 保存当前选中的权限列表
    }
  },
  methods: {
    addRoleFn() {
      this.$emit('addRoleList', this.roleIdList)
      this.$emit('close_roledialog', false)
    },
    // 取消弹框
    cancleDialog() {
      this.$emit('close_roledialog', false)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .footer {
    margin-top: 30px;
  }
  </style>
