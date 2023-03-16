<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :rules="rules"
      :model="userInfo"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" show-password placeholder="请输入" />
      </el-form-item>

      <el-row>
        <el-form-item class="left">
          <el-button type="primary" @click="updateUser">更新</el-button>
          <el-button @click="backpage">返回</el-button>
        </el-form-item>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import { getUserPhotoAPI, saveUserDetailByIdAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空并且大于6位', triggler: 'blur' }]
      }
    }
  },
  created() {
    this.getUserPhotoFn()
  },
  methods: {
    backpage() {
      this.$router.back()
      setTimeout(() => {
        this.$router.go(0)
      }, 1000)
    },
    async  getUserPhotoFn() {
      const res = await getUserPhotoAPI(this.$route.query.id).catch(err => err)
      console.log(res)
      // this.userInfo.username = res.data.username
      // this.userInfo.password = res.data.password
      this.userInfo = res.data
    },
    updateUser() {
      this.$refs.userForm.validate(async valid => {
        if (!valid) return this.$message.error('检查用户名和密码')
        const res = await saveUserDetailByIdAPI(this.userInfo)
        this.getUserPhotoFn()
        if (!res.success) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.$router.back()
        setTimeout(() => {
          this.$router.go(0)
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.left{
    position: relative;
    top:10px;
    left: 150px;
}
</style>
