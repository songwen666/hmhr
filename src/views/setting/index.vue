<template>
  <div class="dashboard-container">
    <div class="setting-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">

            <!-- 新增按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
              >新增角色</el-button>
            </el-row>

            <!-- 表单 -->
            <el-table :data="rolesList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- 作用域插槽 传值 -->
                <template slot-scope="scope">
                  <el-button type="success" size="small" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 数字标签页 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>

          <!-- 分页 -->
          <el-tab-pane label="公司信息" class="tab-pane">
            <!-- 警示学习 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 输入框 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyObj.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyObj.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyObj.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyObj.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹窗 dialog -->
      <el-dialog
        :title="isEdit ? '编辑角色' : '新增角色'"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="50%"
        @close="dialogCloseFn"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" style="width:80%" placeholder="1-50个字符" />
          </el-form-item>

          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" style="width:80%" placeholder="1-50个字符" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 弹窗 dialog 结束 -->

      <!-- 分配权限弹框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogVisible"
        width="50%"
        @close="perDialogcloseFn"
      >
        <assign-permission
          :roleperm-ids="rolepermIds"
          :setrolesid="setRolesID"
          @close="closedialog"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AssignPermission from './assignPermission.vue'
import { getRolesAPI, getCompanyInfoAPI, addRoleAPI, getRoleIdAPI, getUserProfileAPI, updateRoleAPI, deleteRoleAPI } from '@/api'
export default {
  components: {
    AssignPermission
  },
  data() {
    return {
      // 点击角色时的ID
      setRolesID: '',
      // 点击时角色的权限
      rolepermIds: [],
      dialogVisible: false,
      isEdit: false,
      activeName: 'first',
      // 显示下面分页
      query: {
        page: 1, // 当前页面
        pagesize: 5 // 页面显示的条数
      },
      total: 0, // 角色数据总条数
      roleForm: { // 添加角色 编辑角色 呈现的表单
        name: '',
        description: ''
      },
      rolesList: [], // 角色列表
      companyObj: {}, // 通过API访问的数据对象 用于接收公司的相关信息
      // dialogVisible: false,
      showDialog: false, // 控制dilog展开
      roleRules: { // 控制表单验证
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
    this.getCompanyInfoFn()
  },
  methods: {
    closedialog() {
      this.dialogVisible = false
    },
    // 获取角色信息 展示角色信息
    async getRolesList() {
      const res = await getRolesAPI(this.query)
      // console.log('description', res)
      if (!res.success) return this.$message.error(res.message)
      // 将返回的数据进行赋值
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司信息 展示公司名称等信息
    async getCompanyInfoFn() {
      const { data: { companyId }} = await getUserProfileAPI()
      // console.log(companyId)
      const res = await getCompanyInfoAPI(companyId)
      // console.log(res)
      this.companyObj = res.data
    },
    // 点击新增按钮控制
    addRoleBtnFn() {
      this.showDialog = true
      this.isEdit = false
    },
    // 控制dialog点击取消按钮
    cancleRoles() {
      this.showDialog = false
    },
    // 控制dialog 实现点击确认
    // 新增逻辑：点击确认进行兜底验证 响应接口 刷新页面 传送的内容在
    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (!this.isEdit) {
            // 调用新增角色的 API
            const res = await addRoleAPI(this.roleForm)
            // 根据状态码判断请求成功与否
            if (!res.success) return this.$message.error(res.message)
            // 添加成功，给用户进行提示
            this.$message.success(res.message)
          } else {
            console.log('这是编辑')
            // 调用新增角色的 API
            // 我们点击确认过后也要跟新数据 调接口 发数据到后台进行跟新，传数据的方法是根据scope.row的作用域插槽来的
            // 这里我们要传的内容就是 我们改了的 表单的内容
            const res = await updateRoleAPI(this.roleForm)
            if (!res.success) return this.$message.error(res.message)
            // 添加成功，给用户进行提示
            this.$message.success(res.message)
          }
          // 重新获取权限列表数据 刷新页面
          this.getRolesList()
          this.showDialog = false
        }
      })
    },
    // 去除回显
    dialogCloseFn() {
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    perDialogcloseFn() {
      this.rolepermIds = []
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getRolesList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRolesList()
    },

    // 设置角色
    async setRoles(obj) {
      this.dialogVisible = true
      // 根据id查询角色有哪些权限
      const res = await getRoleIdAPI(obj.id)
      this.setRolesID = obj.id
      this.rolepermIds = res.data.permIds
      // console.log('this.rolepermIds', this.rolepermIds)
    },

    // 编辑角色
    async editRoles(dataObj_row) {
      // if()
      this.isEdit = true
      const res = await getRoleIdAPI(dataObj_row.id)
      if (!res.success) return this.$message.error(res.message)
      this.roleForm = res.data
      this.showDialog = true
    },

    // 删除角色
    async delRoles(dataObj_row) {
      const delRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户点击了取消，给用户进行提示
      if (delRes === 'cancel') return this.$message.info('您取消了删除')
      const res = await deleteRoleAPI(dataObj_row.id)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 解决bug 最后一页 最后一行 删除的bug
      if (this.rolesList.length === 1) {
        this.query.page--
        if (this.query.page === 0) this.query.page = 1
      }
      this.getRolesList()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
