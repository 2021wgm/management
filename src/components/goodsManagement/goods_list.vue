<template>
  <div class="goods_list">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push({ path: '/goods/addGoods'})">添加商品</el-button>
        </el-col>
      </el-row>
    
     <el-table
     :data="tableData"
     stripe
     border
     style="width: 100%">
       <el-table-column
         type="index"
         label="#"
       >
       </el-table-column>
       <el-table-column
         prop="goods_name"
         label="商品名称"
         >
       </el-table-column>
       <el-table-column
         prop="goods_price"
         label="商品价格(元)"
         width="70"
         >
       </el-table-column>
       <el-table-column
         prop="goods_weight"
         width="70"
         label="商品重量">
       </el-table-column>
      <el-table-column
         prop="add_time"
         label="创建时间"
         width="160">
         <template slot-scope="scope">
           <div>
             {{scope.row.add_time | time}}
           </div>
         </template>
       </el-table-column>
       <el-table-column
        label="操作"
        width="130">
        <template >
          <div>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </div>
        </template>
       </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import time from  "../../utils/time"
export default {
  name: 'goods_list',
  data(){
    return {
      input3: null,
      listInfo: {
        query: null,
        pagenum: 1,
        pagesize: 10
      },
      tableData: []
    }
  },
  methods: {
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods', {
        params: this.listInfo
      })
      this.tableData = res.data.goods
    }
  },
  created() {
    this.getGoodsList()
  },
  filters: {
    time
  }
}
</script>

<style lang="less" scoped>

</style>


