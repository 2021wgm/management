<template>
  <div class='userInfo-container'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query.query" class="input-with-select" :clearable='true' @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='3'>
          <el-button type="primary" @click='addUserdialogVisible = true'>添加用户</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
       <el-table
         :data="tableData"
         style="width: 100%"
         border
       >
         <el-table-column
          type="index"
          width="50"
          label='#'>
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>

        <el-table-column
          prop="mobile"
          label="电话"
          >
        </el-table-column>

        <el-table-column
          prop="role_name"
          label="角色"
        >
        </el-table-column>

        <el-table-column
          label="状态">
        <template slot-scope='scope'>
          <div>
            <el-switch
              v-model="scope.row.mg_state"
              active-color='#0000FF'
              @change='editUserState($event, scope.row)'
            >
            </el-switch>
          </div>
        </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="185">
          <template slot-scope='scope'>
            <div>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" :enterable='false'>
                <el-button type="primary" icon="el-icon-edit" size="small" @click='editDialogOpened(scope.row)'></el-button>
              </el-tooltip>
             <el-tooltip class="item" effect="dark" content="删除" placement="top-start" :enterable='false'>
               <el-button type="danger" icon="el-icon-delete" size="small"  @click='deleteUserData(scope.row)' ></el-button>
             </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" size="small" @click='showAllotRightsDialog(scope)'></el-button>
            </el-tooltip>  
            </div>
          </template>
      </el-table-column>

    </el-table>
    <!--标签页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    </el-card>

    <!--分配权限对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="allotRightsDialogVisible"
      width="35%"
      v-if='currentAllotRightRole'
    >
      <div>
        <span class='allotRightDialogLabel'>当前的用户:</span>
        <span>{{currentAllotRightRole.username}}</span>
      </div>
      <div>
        <span class='allotRightDialogLabel'>当前的角色:</span>
        <span>{{currentAllotRightRole.role_name}}</span>
      </div>
      <div>
        <span class='allotRightDialogLabel'>分配新角色:</span>
        <span>
          <el-select v-model="roleSelectedId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAllotRightsHandler">取 消</el-button>
        <el-button type="primary" @click="sureAllotRightsHandler">确 定</el-button>
      </span>
    </el-dialog>

  <!--添加用户对话框-->
  <el-dialog
  title="添加用户"
  :visible.sync="addUserdialogVisible"
  width="50%"
  :before-close="addUserHandleClose">
  
  <el-form  :model="addUserform" label-width="80px" :rules="addUserRules" ref='formName'>
    <el-form-item label="用户名" prop='username'>
      <el-input v-model="addUserform.username" :clearable="true"></el-input>
    </el-form-item>

    <el-form-item label="密码" prop='password'>
      <el-input v-model="addUserform.password" :clearable="true"></el-input>
    </el-form-item>

    <el-form-item label="邮箱" prop='email'>
      <el-input v-model="addUserform.email" :clearable="true"></el-input>
    </el-form-item>

    <el-form-item label="手机" prop='mobile'>
      <el-input v-model="addUserform.mobile" :clearable="true"></el-input>
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="removeFormHandler">取 消</el-button>
    <el-button type="primary" @click="sureFormHandler">确 定</el-button>
  </span>
</el-dialog>

<!--编辑用户信息对话框-->
  <el-dialog
  title="修改用户信息"
  :visible.sync="editUserdialogVisible"
  width="50%"
  :before-close="editUserhandleClose">
  
  <el-form  :model="editUserform" label-width="80px" :rules="editUserRules" ref='editFormRef'>
    <el-form-item label="用户名" prop='username'>
      <el-input v-model="editUserform.username" :clearable="true" :disabled='true'></el-input>
    </el-form-item>

    <el-form-item label="邮箱" prop='email'>
      <el-input v-model="editUserform.email" :clearable="true"></el-input>
    </el-form-item>

    <el-form-item label="手机" prop='mobile'>
      <el-input v-model="editUserform.mobile" :clearable="true"></el-input>
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="cancalEditUserFormHandler">取 消</el-button>
    <el-button type="primary" @click="sureEditUserFormHandler">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  name: 'userInfo',
  data() {
    let emailRule = (rule, value, callBack)=> {
      var  rule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if(rule.test(value)){
        callBack();
      }else {
        callBack(new Error('请输入合法的邮箱'))
      }
    }

    let mobileRule = (rule, value, callBack) => {
      var rule = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      if(rule.test(value)){
        callBack()
      }else {
        callBack(new Error('请输入正确的号码格式'))
      }
    }
    return {
      searchValue: '',
      tableData: [],
      query: {
        pagenum: 1,
        pagesize: 1,
        query: ''
      },
      total: 2,
      currentPage: 1,
      addUserdialogVisible: false,
      addUserform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          // { validator: userNameRule, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailRule, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {validator: mobileRule, trigger: 'blur' }
        ],
      },
      editUserdialogVisible: false,
      editUserform: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailRule, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: mobileRule, trigger: 'blur' }
        ],
      },
      allotRightsDialogVisible:false,
      currentAllotRightRole: null,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      roleSelectedId: '',
      roleList: []

    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      // const { data: res } = await this.$http.get(`users?pagenum=${this.query.pagenum}&pagesize=${this.query.pagesize}`);
      const { data: res } = await this.$http.get(`users`, {
        params: this.query
      });
      this.tableData = res.data.users;
      this.total = res.data.total;
      this.currentPage = res.data.pagenum; 
    },

    handleSizeChange(e) {
      this.query.pagesize = e;
      this.getUserList();
    },

    handleCurrentChange(e) {
      this.query.pagenum = e;
      this.getUserList();
    },
    // 修改用户状态
    async editUserState(e,scopeRow) {
      try {
        const {data: res} = await this.$http.put(`users/${scopeRow.id}/state/${e}`);
        this.$message({
          message: '更新用户状态成功',
          type: 'success'
        });
      }catch(err) {
        scopeRow.mg_state = !scopeRow.mg_state
        this.$message({
          message: '更新用户状态失败',
          type: 'success'
        });
      }
    },
    async searchHandler() {
      try{
      const { data: res} = await this.$http.get(`users/${id}`);
      this.tableData = res.data;
      }catch(err){
        console.log(err);
      }
    },
    addUserHandleClose(done) {
      this.addUserdialogVisible = false;
      this.$refs.formName.resetFields();
    },
    removeFormHandler() {
      this.addUserdialogVisible = false;
      this.$refs.formName.resetFields();
    },
    sureFormHandler(){
      this.$refs.formName.validate(async (valid) => {
        if(valid) {
          this.addUserdialogVisible = false;
          const { data: res} = await this.$http.post('users', this.addUserform)
          if(res.meta.status === 201) { 
            this.$message.success('添加用户成功')
            this.getUserList();
          }
          else {
            this.$message.warning('添加用户失败')
          }
          this.$refs.formName.resetFields();
        }
      });
    },
    editDialogOpened(currentData){
      this.editUserform.username = currentData.username;
      this.editUserform.email = currentData.email;      
      this.editUserform.mobile = currentData.mobile;
      this.editUserform.id = currentData.id
      this.editUserdialogVisible = true;
    },
    editUserhandleClose() {
      this.editUserdialogVisible = false;
    },
    cancalEditUserFormHandler(){
      this.editUserdialogVisible = false;
    },
    sureEditUserFormHandler(){
      this.$refs.editFormRef.validate(async valid=> {
        if(valid){
          const {data: res} = await this.$http.put(`users/${this.editUserform.id}`,{
              email: this.editUserform.email,
              mobile: this.editUserform.mobile
          });
          this.editUserdialogVisible = false;
          if(res.meta.status !== 200) {this.$message.error('修改数据失败'); return}
          this.$message.success('更新数据成功');
          this.getUserList();
        }
      })
    },
    deleteUserData(row){
      this.$confirm('确定删除该条数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(async () => {
        console.log(row.id)
        const { data: res} = await this.$http.delete(`roles/${row.id}`);
        console.log(res);
        if(res.meta.status != 200) return this.$message.info('删除失败');
        this.$message.success('删除成功')
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    cancelAllotRightsHandler() {
      this.allotRightsDialogVisible = false;
    },
    async sureAllotRightsHandler() {
      this.allotRightsDialogVisible = false;
      console.log(this.currentAllotRightRole.id, this.roleSelectedId);
      // const { data: res} = await this.$http.put(`users/${this.currentAllotRightRole.id}/role`, {
      //   rids: this.roleSelectedId
      // })
      // if(res.meta.status!=200) return this.$message.warning('更新失败');
      // this.$message.success('更新成功')
      // this.roleSelectedId = ""
    },
    async showAllotRightsDialog(scope) {
      const { data: res} = await this.$http.get('roles');
      if(res.meta.status!==200) return this.$message.error('获取信息失败');
      console.log(res.data);
      this.roleList = res.data;

      this.allotRightsDialogVisible = true;
      this.currentAllotRightRole = scope.row;
    }
    
  }
}
</script>

<style lang='less' scoped>
.userInfo-container {
  height: 100%;
  .el-breadcrumb {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
  }
  .el-table {
    margin-top: 20px;
    .item {
      margin: 4px;
    }
  }
  .el-pagination {
    margin: 0px;
    margin-top: 20px;
  }
  .allotRightDialogLabel {
    margin-right: 15px;
    line-height: 27px;
  }
}
</style>