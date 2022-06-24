<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table
        :data="roleDataList"
        style="width: 100%" border stripe> 
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <div class='pdDistance'>
              <el-row v-for='(item,index) in scope.row.children'>
                <el-col :span="6" >
                  <el-tag
                    closable
                    @close='closeTagHandler(scope, item.id)'
                  >
                    {{item.authName}}
                  </el-tag>
                  <i class='el-icon-caret-right'></i>

                </el-col>
                <el-col :span="18">
                  <el-row v-for='(item2,index2) in item.children' class='rowborderTopClean'>

                    <el-col :span='6'>
                      <el-tag closable type='success' @close='closeTagHandler(scope, item2.id)'
>
                        {{item2.authName}}
                      </el-tag>
                      <i class='el-icon-caret-right'></i>
                    </el-col>

                    <el-col :span='18'>
                      <el-tag v-for='(item3,index3) in item2.children' closable type='warning' 
                      @close='closeTagHandler(scope, item3.id)'
                    >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type='index'
          label='#'
        >
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc">
        </el-table-column>
        <el-table-column
          label="操作"
        >
        <template slot-scope='scope'>
          <el-button type="primary" size='small' icon="el-icon-edit">编辑</el-button>
          <el-button type="danger"  size='small'  icon="el-icon-delete">删除</el-button>
          <el-button type="warning" size='small'  icon="el-icon-s-tools" @click='assignButtonClick(scope)'>分配权限</el-button>
        </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="35%"
    >
    <el-tree
    ref='elRightsTree'
    
      :data="currentAssignData"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[...rightsIdCollection]"
      :props="defaultProps">
    </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="removeAssignDialogHandler()">取 消</el-button>
        <el-button type="primary" @click="sureAssignDialogHandler()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      roleDataList: [],
      assignDialogVisible: false,
      currentAssignData: null,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightsIdCollection: [],
      currentRoleId: null
    }
  },
  created(){
    this.getRoleDataList();
  },
  methods: {
    async getRoleDataList() {
      const { data: res} = await this.$http.get('roles');
      if(res.meta.status!==200) return this.$message.error('获取信息失败');
      this.roleDataList = res.data;
    },
    closeTagHandler(scope,subId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
          const { data: res } = await  this.$http.delete(`roles/${scope.row.id}/rights/${subId}`);
          if(res.meta.status!=200) return this.$message.warning('删除失败');
          this.$message.success('删除成功');
          scope.row.children = res.data;
         // this.getRoleDataList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    removeAssignDialogHandler() {
      this.assignDialogVisible = false;
    },  
    async  assignButtonClick(scope) {
      this.currentRoleId = scope.row.id;
      const { data: res } = await this.$http.get(`rights/tree`);
      this.assignDialogVisible = true;
      this.currentAssignData = res.data;
      let that = this;
      function getRightsIdCollection(obj) {
        obj.forEach(item=>{
          if(item.id) { 
            that.rightsIdCollection.push(item.id);}
          if(item.children) {
             getRightsIdCollection(item.children)
          }
        })
      }
      this.rightsIdCollection = [];
      getRightsIdCollection(scope.row.children);
      // this.$nextTick(()=> {
      //   console.log(this.$refs.elRightsTree.defaultCheckedKeys)
      // })

      // console.log(this.$refs.elRightsTree.defaultCheckedKeys)
      // this.$http.post(`roles/${scope.row.id}/rights`, {

      // })
    },
    async sureAssignDialogHandler() {
      this.assignDialogVisible = false;

      const { data: res}= await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids:[...this.$refs.elRightsTree.getHalfCheckedKeys(),...this.$refs.elRightsTree.getCheckedKeys()].join(",")
      })
      if(res.meta.status !== 200) return this.$message.warning('分配失败');
      this.$message.success('分配角色成功')
      this.getRoleDataList();
      
    }
  }
}
</script>

<style lang='less' scoped>
  .el-breadcrumb {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
  }
  .el-card {
    .el-table {
      margin-top: 20px;
    }
    .el-col>.el-tag {
      margin: 10px;
    }
    .el-table .el-row {
      display: flex;
      align-items: center;
      border-top: 1px solid #EBEEF5;
    }
    .rowborderTopClean:nth-child(1) {
      border-top: none!important;
    }
    .pdDistance {
      padding: 0px 50px;
    }
  }
</style>