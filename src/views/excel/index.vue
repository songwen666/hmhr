<template>
  <div class="app-container">
    <!-- 封装的组件 -->
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <!-- 列表渲染 -->
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importEmployeeAPI } from '@/api'
import { formatExcelDate, parseTime } from '../../utils/index'
export default {
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    transExcel(results) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      return results.map(item => {
        // 定义新对象
        const newobj = {}
        // console.log(item)
        // 拿到所有的key 名
        const arr_contentKeys = Object.keys(item)
        // console.log(arr_contentKeys)
        arr_contentKeys.forEach(chinese_userRelations => {
          // 获取英文字符串key
          const English_userRelations = userRelations[chinese_userRelations]
          if (English_userRelations === 'timeOfEntry' || English_userRelations === 'correctionTime') {
            // 以下都是利用 utils 里的方法
            // 表格的天数->转成日期对象
            const transDate = formatExcelDate(item[chinese_userRelations])
            // 再把日期对象转成->'年-月-日'保存到对象属性里给后台
            newobj[English_userRelations] = parseTime(transDate, '{yyyy}-{mm}-{dd}')
          } else {
            newobj[English_userRelations] = item[chinese_userRelations]
          }
        })
        return newobj
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传大于1M以上的文件.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      // 记录头部数据
      // 记录表格体数据
      this.tableData = results
      this.tableHeader = header
      const arr = this.transExcel(results)
      const res = await importEmployeeAPI(arr).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.$router.back()
      this.$message.success(res.message)
      console.log('转换之后的格式是', arr)
    }
  }
}
</script>
