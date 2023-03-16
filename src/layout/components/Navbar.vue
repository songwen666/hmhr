<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <div class="app-breadcrumb">
      四川传智播客教育科技股份有限公司
      <span class="breadBtn">正式版</span>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img src="@/assets/common/2.gif" class="user-avatar"> -->
          <ImagHolder :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <!-- :src="avatar+'?imageView2/1/w/80/h/80' -->
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" @click="personpage">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </a>
          <el-dropdown-item divided class="el-dropdown-item" @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ImagHolder from '../.././components/ImageHolder'
export default {
  components: {
    Hamburger,
    ImagHolder
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    personpage() {
      this.$router.push('/employees/detail')
    },
    // ...mapActions('user', ['logOutActions']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('你确定要离开吗?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 使用 dispath 调用退出登录的方法
        // 其实action无论有么有async, 返回的都是一个Promise对象(vuex内部设置)
        // await等待退出流程代码走完
        await this.$store.dispatch('user/logOutActions')

        // 跳转到登录页面
        this.$router.replace(`/login?redirect=${this.$route.fullPath}`)
        // $route.path: 只有路径的信息
        // $route.fullPath：路径+查询参数的信息
        // 在退出时 实现登录未遂 就是保存离开时页面的路径信息 保证下一次登陆的过程中 直接到上次的页面
        // 退出成功后的提示
        this.$message.success('退出成功!')
      }).catch(() => {
        // 取消退出提示
        this.$message.info('已取消退出')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  // .breadcrumb-container {
  //   float: left;
  // }
    .el-dropdown-item{
      line-height:26px;
    }
    .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;

    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 40px;
      margin-left: 15px;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50px;
          vertical-align: middle;
          margin-right: 15px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left:5px;
        }

        .user-dropdown {
          color: #fff;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
