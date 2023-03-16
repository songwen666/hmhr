<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共{{ NotTree_permissionList.length }}条数据</span>
        </template>
        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- label 表头 prop 表单数据 -->
      <!-- 如果要图表支持树形结构要设置 row-key  -->
      <el-card class="card">
        <el-table border :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type===1" type="text" @click="addPermission(2, row.id)">添加</el-button>
              <el-button type="text" @click="editFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 弹窗 -->
      <per-dialog ref="perDialog" :is-edit="isEdit" :fpermissionlist="NotTree_permissionList" @addper="confirmFn" />
    </div>
  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
import perDialog from './components/perDialog.vue'
import { getPermissionListAPI, addPermissionAPI, getPermissionDetailAPI, updatePermissionAPI, delPermissionAPI } from '@/api/index.js'
import { transTree } from '@/utils'
export default {
  components: {
    PageTools,
    perDialog
  },
  data() {
    return {
      // 非树形列表
      NotTree_permissionList: [],
      // 转化成树形列表
      permissionList: [],
      isEdit: false,
      // 查询当前行权限数据
      PermissionDetail: []
    }
  },
  created() {
    this.getPermissionListFn()
  },
  methods: {
    // 刷新页面
    async getPermissionListFn() {
      const res = await getPermissionListAPI().catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      // this.$message.success('刷新成功')
      this.NotTree_permissionList = res.data.map(({ id, pid, name, code }) => ({ id, pid, name: name.trim(), code }))
      this.permissionList = transTree(res.data, '0')
      // console.log(this.permissionList)
    },
    // 区分添加 1 添加 大的权限 2 小的权限
    addPermission(type, pid) {
      this.isEdit = false
      this.$refs.perDialog.showDialog = true
      this.$refs.perDialog.formData.type = type
      this.$refs.perDialog.formData.pid = pid
    },
    // 把弹窗中的数据发到后端
    async confirmFn(formDataList) {
      if (this.isEdit) {
        // 更新
        // 调用接口，传入参数，发起请求
        // console.log('formDataList', formDataList)
        const res = await updatePermissionAPI(formDataList).catch(err => err)
        // console.log('更新', res)
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
      } else {
        // 新增
        // 调用接口，传入参数，发起请求
        const res = await addPermissionAPI(formDataList).catch(err => err)
        // console.log('ggg', res)
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
      }
      this.getPermissionListFn()
      // this.$refs.perDialog.$refs.perForm.resetFields()
    },
    async editFn(dataID) {
      this.isEdit = true
      this.$refs.perDialog.showDialog = true
      const res = await getPermissionDetailAPI(dataID)
      console.log(' getPermissionDetailAPI', res.data)
      this.$refs.perDialog.formData = res.data
    },
    async delFn(dataID) {
      // 确认消息
      const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmRes === 'cancel') return this.$message.info('您取消了删除')

      // 调用接口，并传入 ID
      const res = await delPermissionAPI(dataID)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getPermissionListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.card{
  margin-top: 10px;
}
</style>
