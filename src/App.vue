<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
html, body, #app{
  height: 100%;
  padding: 0;
  margin: 0;
  min-width: 1366px;
}

.el-card {
  margin-top: 20px;
}

.el-table,.zk-table {
  margin-top: 20px;
}

.el-pagination {
  margin: 0px;
  margin-top: 20px;
}

.el-cascader-menu {
  height: 300px;
  width: 100%;
}

.el-table__expanded-cell {
  padding-left: 45px!important;
  .el-tag {
    margin-right: 10px;
  }
}


</style>
