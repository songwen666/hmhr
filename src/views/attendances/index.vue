<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共{{ total }}条数据</span>
        </template>
        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>
    </div>
    <el-card style="margin-top: 10px;">
      <el-table border :data="attendancesList" style="width: 100%" stripe>
        <el-table-column fixed label="序号" type="index" width="120px" />
        <el-table-column label="姓名" prop="username" width="120px" />
        <el-table-column label="工号" prop="workNumber" width="150px" sortable :sort-method="workNumberSortFn" />
        <el-table-column label="部门" prop="departmentName" width="150px" />
        <el-table-column label="手机号" prop="mobile" width="150px" />
        <template v-for="(item,i) in day">
          <el-table-column :key="i" :prop="item.id" :label="(item.day).substring('5', '6')+'/'+(item.day).substring('6')" />
        </template>
      </el-table>
    </el-card>
    <!-- 分页组件 (item.adtStatu)=== 2 ? 'sc' : 'dc'-->
    <el-row type="flex" justify="center" align="middle" style="height: 60px">
      <!-- 分页区域 -->
      <el-pagination
        :current-page="query.page"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <!--  -->
  </div>
</template>

<script>
import { getAttendanceListAPI } from '@/api'
import PageTools from '@/components/PageTools'
export default {
  components: {
    PageTools
  },
  data() {
    return {
      attendancesList: [],
      attendanceRecord: [],
      day: [],
      query: {
        page: 1, // 页码
        pagesize: 10 // 每页条数
      },
      total: 0
    }
  },
  created() {
    this.getAttendanceListFn()
  },
  methods: {
    // 处理排序
    workNumberSortFn(a, b) {
      // console.log(a)
      return Number(a.workNumber) - Number(b.workNumber)
    },
    async getAttendanceListFn() {
      const res = await getAttendanceListAPI(this.query)
      this.attendancesList = res.data.data.rows
      this.total = res.data.data.total
      this.attendancesList.forEach(item => {
        this.day = item.attendanceRecord
        console.log('?', this.day)
      })
      this.day.forEach(item => {
        this.statu = (item.adtStatu) === 2 ? 'sc' : 'dc'
        console.log('this.statu?', this.statu)
      })
      // console.log('?day', this.day)
      if (!res.success) return this.$message.error(res.message)
      console.log('getAttendanceListFn', res)
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getAttendanceListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getAttendanceListFn()
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
