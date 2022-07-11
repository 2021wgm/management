<template>
    <el-container>
      <el-header>
        <div class='header-logo'>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span> 
        </div>      
        <el-button type="info" @click='quit'>退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="flagToggle?'60px': '200px'">
          <div class="flexible" @click = 'foldUp'>
            <div class="three-lines"></div>
            <div class="three-lines"></div>
            <div class="three-lines"></div>
          </div>
          <div class="nav-menu">           
            <el-menu  
              :unique-opened = 'true'
              background-color = "#333744"
              active-text-color = "#3300ff"
              text-color = '#FFFFFF'
              :collapse = 'flagToggle'
              :collapse-transition = 'false'
              :router = 'true'
              :default-active = '$route.path'
            >
              <el-submenu :index="index + ''" v-for='(item,index) in menulist'>
                <template slot="title">
                  <i :class="iconList[index]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/' + subItem.path" v-for='(subItem, subIndex) in item.children'>
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </el-menu-item>

              </el-submenu>
             </el-menu>

          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconList: ['iconfont icon-yonghuguanli',
                 'iconfont icon-quanxianguanli',
                 'iconfont icon-shangpinguanli',
                 'iconfont icon-dingdanguanli',
                 'iconfont icon-shujutongji'
                ],
      sideWidth: '200px',
      flagToggle: false,
      index: null
    }
  },
  methods: {
    quit() {
      sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMenusData() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data;
    },
    foldUp() {
      this.flagToggle = !this.flagToggle;
    },
  },
  created() {
    this.getMenusData();
  },

}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
  .el-header {
    padding-left: 0px;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-logo {
      height: 100%;
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
        font-size: 20px;
        font-weight: bold;
        color: white;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    overflow: hidden;
    .flexible {
      height: 30px;
      background-color: #837878;
      display: flex;
      justify-content: center;
      align-items: center;
      .three-lines {
        height: 20px;
        width: 2px;
        background-color: white;
        margin: 0 0.5px;
      }
    }
    .el-menu {
      border: none;
      i {
        margin-right: 17px;
      }
    }
  }
  .el-main {
    
  }
}
</style>