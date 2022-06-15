<template>
  <div class="login-container">
    <div class="outer-container">
      <div class="logo-container">
        <div class="logo-box">
          <img src="../assets/logo.png" alt="">
        </div>
      </div>

      <div class="form-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item   prop="name">
            <el-input v-model="ruleForm.username"  prefix-icon="iconfont icon-yonghu"></el-input>
          </el-form-item>

          <el-form-item   prop="password">
            <el-input prefix-icon='iconfont icon-mima' v-model="ruleForm.password" type='password'></el-input>
          </el-form-item>

          <el-form-item class='btns'>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click='login()'>登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    // var passwordRule = (rule, value, callBack) => {
    //   if(!value)
    //   return callback(new Error('请输⼊密码'));
    // }
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],      
      }
    }
  },
  methods: {
    login() {
      this.$refs['ruleForm'].validate(async valid => {
        if(!valid) return;
        // try{
        //   let result = await this.$axios.post('login', this.ruleForm);
        //   console.log(result);
        //   if(result.meta.status !== 200) return alert('登录失败');         
        // }catch(error) {
        //   console.log(error);
        // }
        // sessionStorage.setItem('token', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE2NTM2NjQ1NzcsImV4cCI6MTY1Mzc1MDk3N30.JaG6Z3MZkG7moiaIXQYClTRHH9EZkgbr-jsDaWe-4s8");
        // this.$message({
        //   message: '恭喜你,登录成功',
        //   type: 'success'
        // }); 
        // this.$router.push('/home') 
        const { data: res}= await this.$http.post('login', this.ruleForm) ;
        console.log('登录了吗', res)  
        sessionStorage.setItem('token', res.data.token);
        this.$message({
          message: '恭喜你,登录成功',
          type: 'success'
        }); 
        this.$router.push('/home')
    
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang='less' scoped>
.login-container{
  height: 100%;
  background-color: #87CEFA;
  position: relative;
  .outer-container{
    width: 30%;
    height: 300px;
    background: white;
    box-shadow: 1px 1px 10px 1px grey;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 2px;
    transform: translate(-50%,-50%);
    .logo-container{
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      background-color: white;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      box-shadow: 1px 1px 10px 1px grey;
      .logo-box{
        width: 80px;
        height: 80px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 50%;
        background-color: #F0F8FF;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .form-box{
      position: absolute;
      bottom: 15px;
      width: 100%;
      .el-form{
        padding: 0 15px;
        .btns .el-button {
          float:right;
        }
        .btns .el-button:nth-child(1) {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>