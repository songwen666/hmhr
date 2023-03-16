<template>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="upload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <el-progress v-show="showProgress" type="circle" :percentage="percentage" class="progress" :color="colors" />
  </el-upload>
</template>

<script>

// 导入 cos 模块
const COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKID1sWI0UjrvvjMtBD0Zz4wZzA8sVxFKLK6',
  SecretKey: 'gAg3GF0iNoCWdqulOo0xrgU7VigdWFkC'
})

export default {
  name: 'UploadImg',
  data() {
    return {
      imageUrl: '',
      showProgress: false,
      percentage: 85,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // createObjectURL 会把文件数据临时转化成前端地址
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      this.showProgress = true
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 15MB!')
      }
      return isJPG && isLt2M
    },
    upload(res) {
      if (res.file) {
        this.showProgress = true
        cos.putObject({
          Bucket: 'songwen666-1314615025', // 存储桶的名称，必须
          Region: 'ap-chengdu', // 存储桶所在地域，必须字段
          Key: res.file.name, // 文件名，必须
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          // 上传进度条
          onProgress: function(progressData) {
            // console.log(progressData)
            this.percentage = parseInt(progressData.percent * 100)
            // console.log(parseInt(progressData.percent * 100))
          }
        }, (err, data) => {
          // console.log('err', err) 错误信息
          // console.log('data', data) 数据基本信息
          if (err === null && data.statusCode === 200) {
            this.imageUrl = `https:${data.Location}`
          }
          setTimeout(() => {
            this.showProgress = false
          }, 1000)
        })
      }
    }

  }
}
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}

</style>
