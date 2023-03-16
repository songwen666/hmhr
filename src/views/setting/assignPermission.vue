<template>
  <div>
    <el-tree
      ref="tree"
      :data="permissionList"
      :props="{ label: 'name' }"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
    />
    <!-- show-checkbox default-expand-all  check-strictly 三个控件 -->
    <!-- node-key="id" node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。-->
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPermissionListAPI, assignPermAPI } from '@/api'
import { transTree } from '@/utils'
export default {
  name: 'AssignPermission',
  props: {
    rolepermIds: {
      type: Array,
      default: _ => []
    },
    setrolesid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 转化的树装数组
      permissionList: []
    }
  },
  watch: {
    // 监听这个发生变化时 给tree 组件添加id 动态生成
    rolepermIds() {
      // console.log(this.rolepermIds)
      this.$refs.tree.setCheckedKeys(this.rolepermIds)
    }
  },
  created() {
    // console.log(this.roleId)
    this.getPermissionListFn()
  },
  methods: {
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res.data, '0')
    },
    // 取消按钮
    cancelButton() {
      this.$emit('close', false)
    },

    // 设置权限按钮
    async setRolesBtn() {
      const permIds = this.$refs.tree.getCheckedKeys()
      // console.log('setRolesID ,permIds ', this.setrolesid, permIds)
      const res = await assignPermAPI({
        id: this.setrolesid,
        permIds: permIds
      })
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$emit('close', false)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .footer {
    margin-top: 30px;
  }
  </style>
