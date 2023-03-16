<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info :tree-data="treeData" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserPhotoAPI, getDepartmentsListAPI } from '@/api'
import LoginSetting from './detail/login-setting.vue'
import JobInfo from './detail/job-info.vue'
import UserInfo from './detail/user-info.vue'
import { transTree } from '@/utils'
export default {
  components: {
    LoginSetting,
    JobInfo,
    UserInfo
  },
  data() {
    return {
      treeData: [] // 存储部门列表(树结构)
    }
  },
  created() {
    this.getUserPhotoFn()
  },
  methods: {
    async getDepartmentsListFn() {
      const { data: { depts }} = await getDepartmentsListAPI()
      // console.log(depts)
      this.treeData = transTree(depts, '')
    },
    async  getUserPhotoFn() {
      const res = await getUserPhotoAPI(this.$route.query.id).catch(err => err)
      console.log(res)
      // this.userInfo.username = res.data.username
      // this.userInfo.password = res.data.password
      this.userInfo = res.data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

