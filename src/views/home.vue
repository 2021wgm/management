<template>
  <div>
    主页
    <el-button type="info" @click='quit'>退出</el-button>
  </div>
  
</template>

<script>
export default {
  methods: {
    quit() {
      sessionStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style>

</style>