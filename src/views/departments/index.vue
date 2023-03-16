<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织架构" name="first">
            组织架构
            <el-row type="flex" justify="space-between" align="middle" class="department-header">
              <el-col :span="20">
                <i class="el-icon-s-home" />
                <span class="company">四川省播客教育科技股份有限公司</span>
              </el-col>
              <el-col :span="4">
                <!-- 在容器范围里, 一行再分2列 -->
                <el-row type="flex" justify="end">
                  <!-- 一行分两列 -->
                  <el-col> 负责人</el-col>
                  <el-col>
                    <!-- 添加下拉 -->
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="add(data)">添加部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 加了冒号的是表达式 不加的是字符串 -->
            <el-tree
              class="departments-tree"
              :data="treeData"
              :props="defaultProps"
              :expand-on-click-node="false"
              default-expand-all
              node-key="id"
            >
              <!-- 这里是其实隐藏了插槽 template里 这里 v-slot="变量名" v-slot 可以简化成# #default="{data}" 写全为-->
              <!-- v-slot:default="{data}"  v-slot简写为#-->
              <!-- 使用插槽定义每一行的内容 -->
              <!-- data是作用域插槽 -->
              <template #default="{ data }">
                <el-row
                  type="flex"
                  justify="space-between"
                  align="middle"
                  style="height: 40px; width: 100%;"
                >
                  <!-- 部门名字 -->
                  <el-col :span="20">
                    <span>{{ data.name }}</span>
                  </el-col>
                  <el-col :span="4">
                    <!-- 添加列 -->
                    <el-row type="flex" justify="end">
                      <!-- 负责人名字 -->
                      <el-col>{{ data.manager }}</el-col>
                      <!-- 添加下拉 -->
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                          <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                          <!-- 作判断是否有 data ，没有存在 data 就判断是否存在 data.children 属性，如果有，就不能显示删除部门 -->
                          <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 在这里添加 弹窗 -->
      <depart-dialog
        ref="departDialog"
        title="提示"
        :dialog-visible.sync="showDepartDialog"
        :employees-list="employeesList"
        :origin-list="originList"
        :click-depart-id="parentId"
        :is-edit="isEdit"
        @addDepartEV="addDepartmentsFn"
      />
      <!-- 父向子传递值 :employees-list="employeesList" -->
      <!-- 子向父接受 @addDepartEV="addDepartmentsFn" -->
    </div>
  </div>
</template>

<script>
import { getDepartmentsListAPI, addDepartmentsAPI, getEmployeeSimpleAPI, getDepartDetailAPI, updateDepartmentsAPI, delDepartmentAPI } from '@/api'
import { transTree } from '@/utils/index'
import DepartDialog from './components/departDialog.vue'

export default {
  components: {
    DepartDialog
  },
  // 做的假数据
  data() {
    return {
      activeName: 'first',
      // 控制dirlog 出现的
      showDepartDialog: false,
      // 表格是否是编辑状态
      isEdit: false,
      // 接收员工的信息表
      employeesList: [],
      // 用于中转 将pid 接收到addDepartmentsFn 中去
      clickDepartId: '',
      originList: [], // 用于弹窗内-校验部门code和name是否重复数据数组
      // 树形控件数据
      treeData: [
        {
          departName: '总裁办',
          name: '李国瑞'
        },
        {
          departName: '行政部',
          name: '张三'
        },
        {
          departName: '人事部',
          name: '李四',
          children: [
            {
              departName: '财务核算部'
            }
          ]
        },
        {
          departName: '财务部',
          name: '苏埃蒂',
          children: [
            {
              departName: '财务核算部'
            },
            {
              departName: '税务管理部'
            },
            {
              departName: '薪资管理部'
            }
          ]
        },
        {
          departName: '技术部',
          name: '王松',
          children: [
            {
              departName: '前端技术部'
            },
            {
              departName: '后端技术部'
            }
          ]
        },
        {
          departName: '运营部',
          name: '王五'
        },
        {
          departName: '市场部',
          name: '武高丽',
          children: [
            {
              departName: '市场部1'
            },
            {
              departName: '市场部2'
            }
          ]
        }
      ],
      // 定义结构显示
      defaultProps: {
        // label 是根节点
        // children 是孩子
        children: 'children',
        label: 'departName'
      }
    }
  },
  created() {
    // 页面刷新的时候
    this.getDepartmentsListFn()
    // 获取页面员工的简洁信息
    this.getEmployeeSimpleFn()
  },
  methods: {
    add(data) {
      this.isEdit = false
      if (data) {
        // 一级部门的id为空 二级就是data 作用域获取的data
        // 把点击的部门id存入
        this.clickDepartId = data.id
      } else {
        // 一级部门的id为空
        this.clickDepartId = ''
        // 我们可以看到一级部门的pid都是''
      }
      // 添加子部门 dialog ->弹窗 出现
      this.showDepartDialog = true
    },
    // 编辑状态时 显示数据
    async edit(data) {
      // 为表单表示为编辑状态
      this.isEdit = true
      // 把点击的部门id存入
      this.clickDepartId = data.id
      // 显示dialog
      this.showDepartDialog = true
      // 获取部门id
      const res = await getDepartDetailAPI(data.id)
      // console.log(this.$refs.departDialog)
      // 把你填入的数据显示在表格里以达到回显的木的
      this.$refs.departDialog.form = res.data
      // console.log(res)
    },
    async del(data) {
      const delRes = await this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (delRes === 'cancel') return this.$message('你取消了删除')

      const delDepartRes = await delDepartmentAPI(data.id)
      // 根据状态值, 查看是否删除成功
      if (!delDepartRes.success) return this.$message.error(delDepartRes.message)
      // 删除成功需要给用户进行提示
      this.$message.success(delDepartRes.message)

      // 删除后需要重新获取当前页面数据
      this.getDepartmentsListFn()
    },
    // 获取列表信息 这个api 时常有问题
    async getDepartmentsListFn() {
      // console.log('出发了')
      const { data: res } = await getDepartmentsListAPI()
      // console.log('出发了api')
      this.originList = res.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid // 下面使用
        }
      ))
      this.treeData = transTree(res.depts, '')
      // console.log('跟新了')
    },
    // 获取员工简洁信息
    async getEmployeeSimpleFn() {
      const { data: res } = await getEmployeeSimpleAPI()
      // console.log(res)
      this.employeesList = res
    },
    // $emit 接受到的数据自定义的函数  将新增的表单数据发送出去 用于更新和编辑表格
    async addDepartmentsFn(dataObj) {
      if (this.isEdit) { // 编辑状态
        dataObj.id = this.clickDepartId
        const res = await updateDepartmentsAPI(dataObj)
        console.log(res)
      } else {
        // 添加状态
        dataObj.pid = this.clickDepartId
        await addDepartmentsAPI(dataObj)
      }
      this.getDepartmentsListFn()
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .departments-tree {
  margin: 12px 0px;
}

</style>
