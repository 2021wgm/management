<template>
  <div class='rightsContainer'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table
        :data="rightsTableList"
        style="width: 100%"
        border
        stripe>
        <el-table-column
          type='index'
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template slot-scope='scope'>
            <div>
              <el-tag v-if = 'scope.row.level == 0'>一级</el-tag>
              <el-tag v-if = 'scope.row.level == 1' type='success'>二级</el-tag>
              <el-tag v-if = 'scope.row.level == 2' type='warning'>三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>



</template>

<script>
export default {
  data() {
    return {
      rightsTableList: []
    }
  },
  created(){
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res} = await this.$http.get(`rights/list`);
      if(res.meta.status !== 200) return  this.$message.warning('获取权限列表数据失败');
      this.rightsTableList = res.data

      
    }
  }
}
</script>

<style lang='less' scoped>
.rightsContainer {
  height: 100%;
}
</style>