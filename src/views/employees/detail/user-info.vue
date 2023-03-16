<template>
  <div class="use-info">
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- ????实现树形列表 -->
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" @focus="departmentNameFocus" />
            <div class="tree-box">
              <!-- label 指定节点标签为节点对象的某个属性值 里面的name是因为数据里有name这个属性 -->
              <!-- node-click 是其内部提供的事件 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 -->
              <el-tree
                v-show="showTree"
                :data="treeLIstDate"
                default-expand-all
                :props="{ label: 'name' }"
                @node-click="treeClick"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in Employees.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img ref="UploadImg" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import { getUserPhotoAPI, saveUserDetailByIdAPI, getDepartmentsListAPI } from '@/api'
import Employees from '@/api/constant/employees'
import UploadImg from '../../../components/UploadImg'
import { transTree } from '@/utils'
export default {
  name: 'UserInfo',
  components: {
    UploadImg
  },
  props: {
    treeData: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      Employees, // 员工枚举数据
      userInfo: {},
      showTree: false,
      // 存储列表的树形结构
      treeLIstDate: []
    }
  },
  // watch: {
  //   '$route'() {
  //     if (this.$route.name === 'LoginSetting') {
  //       console.log('666')
  //       this.getUserPhotoFn()
  //     }
  //   }
  // },
  created() {
    this.getUserPhotoFn()
    this.getDepartmentsListFn()
  },
  methods: {
    departmentNameFocus() {
      this.showTree = true
    },
    async getDepartmentsListFn() {
      const { data: { depts }} = await getDepartmentsListAPI()
      console.log(depts)
      this.treeLIstDate = transTree(depts, '')
    },
    treeClick(data) {
      // 判断是否有孩子，有就折叠
      if (data && data.children) return
      // 将点击的那个部门传给
      this.userInfo.departmentName = data.name
      // this.clickDepartName = data.name
      this.showTree = false
    },
    // 数据回显
    // 根据id 获取数据
    async  getUserPhotoFn() {
      const res = await getUserPhotoAPI(this.$route.query.id).catch(err => err)
      console.log(res)
      // this.userInfo.username = res.data.username
      // this.userInfo.password = res.data.password
      this.userInfo = res.data
      this.$refs.UploadImg.imageUrl = res.data.staffPhoto
      // 处理聘用形式的问题
      // this.userInfo.formOfEmployment = Number(this.$route.query.formOfEmployment)
      // $set('数组/对象','属性','值')
      this.$set(this.userInfo, 'formOfEmployment', Number(this.$route.query.formOfEmployment))
    },
    // 保存更新
    async saveUser() {
      this.userInfo.staffPhoto = this.$refs.UploadImg.imageUrl
      const res = await saveUserDetailByIdAPI(this.userInfo).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getUserPhotoFn()
      this.$router.back()
      // 这行函数解决了 图片问题
      setTimeout(() => {
        this.$router.go(0)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

