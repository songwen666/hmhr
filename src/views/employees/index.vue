<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共{{ total }}条数据</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button v-power="'import'" type="danger" size="small" @click="uploadBtnFn()">导入excel</el-button>
          <el-button v-power="'export'" type="success" size="small" @click="downloadExcel()">导出excel</el-button>
          <el-button type="primary" size="small" @click="closedialog">新增员工</el-button>
        </template>
      </page-tools>
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList" stripe>
          <el-table-column label="序号" type="index" width="120px" />
          <el-table-column label="姓名" prop="username" width="120px" />
          <el-table-column label="头像" prop="staffPhoto" width="120px">
            <template v-slot="{ row }">
              <ImagHolder :src="row.staffPhoto+'?imageView2/1/w/300/h/300'" class="staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" width="150px" />
          <el-table-column label="工号" prop="workNumber" width="150px" sortable :sort-method="workNumberSortFn" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatter" width="150px" />
          <el-table-column label="部门" prop="departmentName" width="150px" />
          <el-table-column label="入职时间" prop="timeOfEntry" :formatter="timeFormatter" />
          <el-table-column label="操作" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="lookDailFn(row.id,row.formOfEmployment)">查看</el-button>
              <el-button type="text" size="small" @click="RoleDialog(row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmp(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <!-- 请注意 第一个才是dialog 中间的是封装的表单组件 -->
      <el-dialog
        title="新增"
        :visible.sync="showDialog"
        width="50%"
        @close="dialogCloseFn"
      >
        <emp-dialog
          ref="addEmpDialog"
          :tree-data="treeData"
          @close_empdialog="close"
          @update_from="addEmployeeFn"
        />
      </el-dialog>
      <!-- 员工-分配角色权限 - 弹窗 -->
      <!-- cancleDialogFn 清空回显 -->
      <el-dialog title="分配角色" :visible="showRoleDialog" @close="cancleDialogFn">
        <!-- 设置角色组件 -->
        <assign-role-dialog
          ref="assignRoleDialog"
          :all-role-list="allRoleList"
          @close_roledialog="closeroledialog"
          @addRoleList="addRoleFn"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeListAPI, getDepartmentsListAPI, addEmployeeAPI, delEmployeeAPI, getRolesAPI, getUserPhotoAPI, assignRolesAPI } from '@/api'
import PageTools from '@/components/PageTools'
import empDialog from './components/empDialog.vue'
import ImagHolder from '../.././components/ImageHolder'
import Employees from '@/api/constant/employees'
import AssignRoleDialog from './components/assignRoleDialog.vue'
import { transTree, parseTime } from '@/utils'
import dayjs from 'dayjs'
export default {
  name: 'Employees',
  components: {
    PageTools,
    empDialog,
    ImagHolder,
    AssignRoleDialog
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false,
      showRoleDialog: false,
      treeData: [], // 存储部门列表(树结构),
      // 获取到所有权限的列表
      allRoleList: [],
      // 存储点击的角色权限
      Role_powerList: [],
      // 收集点击时的id
      click_RoleID: ''
    }
  },
  created() {
    this.getEmployeeList()
    this.getDepartmentsListFn()
    this.getRolesFn()
  },
  methods: {
    // 重点！！！！！！！！！！！！！！！！！！！！！
    // 通过点击时 把点击查看的id 通过query参数的方式传给 下一个组件
    lookDailFn(empid, empformOfEmployment) {
      this.$router.push(`/employees/detail?id=${empid}&formOfEmployment=${empformOfEmployment}`)
    },
    parseTime,
    async getEmployeeList() {
      // 调用获取员工列表的 API
      const res = await getEmployeeListAPI(this.query)
      // console.log(res)
      // 根据返回的状态码给用户提示
      if (!res.success) return this.$message.error(res.message)
      // 将返回的结果赋值 data 中的数据
      this.employeesList = res.data.rows
      this.total = res.data.total
      // console.log(this.employeesList)
    },
    // 跟新页面
    async getDepartmentsListFn() {
      const { data: { depts }} = await getDepartmentsListAPI()
      // console.log(depts)
      this.treeData = transTree(depts, '')
    },
    // 获取角色列表
    async getRolesFn() {
      const res = await getRolesAPI({
        page: 1,
        pageSize: 10
      })
      const allres = await getRolesAPI({
        page: 1,
        pageSize: res.data.total
      })
      this.allRoleList = allres.data.rows
    },
    // 增加员工
    async addEmployeeFn(FormData) {
      const res = await addEmployeeAPI(FormData)
      if (!res.success) this.$message.error(res.message)
      this.$message.success(res.message)
      // console.log(res)
      this.getEmployeeList()
    },
    // 删除员工信息
    async delEmp(id) {
      const del_res = await this.$confirm('此操作将永久删除该员工信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (del_res === 'cancel') return this.$message.info('你取消了删除')
      const res = await delEmployeeAPI(id)
      if (!res.success) this.$message.error(res.message)
      this.$message.success(res.message)
      // 判断是不是最后一条数据
      if (this.employeesList.length === 1) {
        this.query.page--
        if (this.query.page <= 0) {
          this.query.page = 1
        }
      }
      this.getEmployeeList()
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeeList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeeList()
    },
    // 处理排序
    workNumberSortFn(a, b) {
      // console.log(a)
      return Number(a.workNumber) - Number(b.workNumber)
    },
    // 控制聘用形式
    formatter(row, column, cellValue, index) {
      // 用数组的 find 方法找到 id = 1 的元素，再取出它的 value
    // cellvalue：字段值。
    // row：行记录数据。
    // index: 行索引。
    // Number(cellValue)是因为在后台给的数据转化成了字符串
      const obj = Employees.hireType.find((item) => item.id === Number(cellValue))
      return obj ? obj.value : '未知'
    },
    // 格式化时间
    timeFormatter(row) {
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },
    closedialog() {
      this.showDialog = true
    },
    // 点击分配角色时 根据id 查询 获取基本信息
    // 实现数据的回显
    async RoleDialog(obj) {
      this.click_RoleID = obj
      this.showRoleDialog = true
      // 这个api 可以获取基本信息
      const res = await getUserPhotoAPI(obj)
      // console.log(res)
      // 获取角色的id 然后获取信息 然后 用refs 获取v-model 获取 角色列表
      // 这里使用是因为担心 Dom 还没有跟新完就去获取 会获取不到 于是用这个
      this.$nextTick(() => {
        // console.log(this.$ref.assignRoleDialog.roleIdList)
        this.$refs.assignRoleDialog.roleIdList = res.data.roleIds
      })
    },
    // 给角色分配权限
    async addRoleFn(val) {
      // 接收点击角色的权限 从子组件 通过$emit
      this.Role_powerList = val
      // console.log('???', val)
      const res = await assignRolesAPI({
        id: this.click_RoleID,
        roleIds: this.Role_powerList
      })
      // console.log(res)
      if (!res.success) return this.$message.error(res.message)

      // 员工分配成功，给用户提示
      this.$message.success(res.message)
      // 关闭弹框
      this.showRoleDialog = false
      // 重新获取当前当前列表数据
      // this.getEmployeeList()
    },
    // sync 不能用 用这个代替一下
    close() {
      this.showDialog = false
    },
    closeroledialog() {
      this.showRoleDialog = false
    },
    // 清除回显
    dialogCloseFn() {
      // 通过上面的dialog 获取到下面的ref 也就是dom 而addEmpDialog 里面的dom 就是 empDialog 里面的dom
      this.$refs.addEmpDialog.$refs.dialogForm.resetFields()
      // <el-dialog
      //   title="新增"
      //   :visible.sync="showDialog"
      //   width="50%"
      //   @close="dialogCloseFn"
      // >
      //   <emp-dialog
      //     ref="addEmpDialog"
      //     :tree-data="treeData"
      //     @close_empdialog="close"
      //     @update_from="addEmployeeFn"
      //   />
      // </el-dialog>
    },
    // 清空回显
    cancleDialogFn() {
      // this.$refs.addEmpDialog.$refs.dialogForm.resetFields()
      this.showRoleDialog = false
    },
    // 导入excel
    uploadBtnFn() {
      this.$router.push('/excel')
    },
    transData(rows) {
      // 4.0 准备一个列表头中文数组 (8个)
      const headerArr = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
      // 4.1 数据key的映射关系(思路: 遍历上边数组里按照顺序, 取出中文的名字, 但是对应数组值的数组, 要从英文key对象中取出value值, 我要用中文key换到英文key然后去取到值)
      const myObj = {
        // 序号可以等遍历的时候直接用索引值, 而不是来自于英文对象里
        '姓名': 'username',
        '头像': 'staffPhoto',
        '手机号': 'mobile',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName',
        '入职时间': 'timeOfEntry'
      }
      // 4.2 按照顺序
      // rows是用api请求的数据 很多对象那个
      const resultArr = rows.map((English_val_obj, index) => {
        const trans_date_Arr = []
        headerArr.forEach(chinese_value => {
          if (chinese_value === '序号') {
            trans_date_Arr.push(index + 1)
          } else {
            // 把传入对象的 含英文键名的 值取到 依次放入 对象大概为
            // {'username'：'xxx',
            // 'staffPhoto': 'xxx'
            // }
            // trans_date_Arr.push(English_val_obj[myObj[chinese_value]])
            const English_key = myObj[chinese_value]
            const obj_value = English_val_obj[English_key]
            if (English_key === 'formOfEmployment') {
              const obj = Employees.hireType.find(item => item.id === Number(obj_value))
              trans_date_Arr.push(obj ? obj.value : '未知')
            } else {
              trans_date_Arr.push(obj_value)
            }
          }
        })
        return trans_date_Arr
      })
      // 形成表格数据
      return { header: headerArr, data: resultArr }
    },
    // 导出excel
    async downloadExcel() {
      const res = await getEmployeeListAPI()
      const res2 = await getEmployeeListAPI({
        page: 1,
        size: res.data.total
      })
      const excelObj = this.transData(res2.data.rows)
      import('@/vendor/Export2Excel').then(excel => {
      // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: excelObj.header, // 表头 必填
          data: excelObj.data, // 具体数据 必填
          filename: '员工列表', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index{
  height: 100px;
  width: 200px;
}
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
