<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click='addCateDialogVisible = true'>添加分类</el-button>
       
      <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="goodsCategoriesList"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
       :index-text="props.indexText"
      :selection-type="props.selectionType">
      <!-- <template slot="$expand" scope="scope">
        {{ `My name is ${scope.row.name},
           this rowIndex is ${scope.rowIndex}.`
         }}
      </template> -->
      <template slot="cat_deleted" scope="scope">
        <span class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></span>
        <span v-else class="el-icon-error" style='color: red'></span>
      </template>
      <template slot="cat_level" scope="scope">
        <el-tag v-if='scope.row.cat_level === 0' size="mini">一级</el-tag>
        <el-tag  v-if='scope.row.cat_level === 1' type='success' size="mini">二级</el-tag>
        <el-tag  v-if='scope.row.cat_level === 2' type='warning' size="mini">三级</el-tag>
      </template>
      <template slot="operate" scope="scope">
        <el-button type="primary" size='small' icon="el-icon-edit">编辑</el-button>
        <el-button type="danger"  size='small'  icon="el-icon-delete">删除</el-button>
      </template>
    </zk-table>
  
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="cateListInfo.pagenum"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="3"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="45%"
      @close="handleClose"

    >
    <el-form ref="addCateDialogRef" :model="addCateQueryInfo" label-width="80px" :rules="addCateRules">
      <el-form-item label="分类名称" prop='cat_name' v-if='addCateQueryInfo!=null'>
        <el-input v-model="addCateQueryInfo.cat_name" ></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <el-cascader v-model="cateCheckedData" :options="goodsParentList"  @change="handleChange"
         :props="{label:'cat_name',children: 'children',value: 'cat_id',expandTrigger: 'hover',checkStrictly: true}"
         :clearable="true" 
        ></el-cascader> 
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCateDialogHandler">取 消</el-button>
        <el-button type="primary" @click="sureCateDialogHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data() {
    return {
      cateCheckedData:[],
      goodsCategoriesList: [],
      cateListInfo: {
        type: 3,
        pagenum: 6,
        pagesize: 3
      },
      total: null,
      props: {
        stripe: false,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
        indexText: '#'
        },
        columns: [
          // {
          //   label: '#',
          //   type: ''
          // },
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            minWidth: '50px',
            type: 'template',
            template: 'cat_deleted'
          },
          {
            label: '排序',
            prop: 'cat_level',
            type: 'template',
            template: 'cat_level'
          },
          {
            label: '操作',
            prop: 'operate',
            minWidth: '100px',
            type: 'template',
            template: 'operate'
          },
        ],
        addCateDialogVisible: false,
        addCateRules: {
          cat_name: [ 
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        addCateQueryInfo: {
          cat_pid: 0,
          cat_name: "",
          cat_level: 0
        },
        goodsParentList: []
    }
  },
  created() {
    this.getGoodsCategoriesList();
    this.getGoodsParentList()
  },
  computed: {
    propList() {
      return Object.keys(this.props).map(item => ({
        name: item,
      }));
    },
  },
  methods: {
    async getGoodsCategoriesList() {
      const { data: res} =  await this.$http.get('categories', {
        params: this.cateListInfo
      });
      if(res.meta.status!=200) return this.$message.warning('获取数据失败');
      this.goodsCategoriesList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(e) {
      this.cateListInfo.pagesize = e;
      this.getGoodsCategoriesList();
    },
    handleCurrentChange(e) {
      this.cateListInfo.pagenum = e;
      this.getGoodsCategoriesList();
    },
    cancelCateDialogHandler() {
      this.addCateDialogVisible = false;
    },
    sureCateDialogHandler() {
      this.$refs.addCateDialogRef.validate(async (valid) => {
        if (valid) {
          console.log('submit')
          const res = await this.$http.post(`categories`, this.addCateQueryInfo)
          console.log(res);
          this.getGoodsCategoriesList();
        } else {
          console.log('error submit!!');
          return false;
        }
      this.addCateDialogVisible = false;
      });
    },
    async getGoodsCateData() {
      const { data: res} = await this.$http.post('categories', 
          this.addCateQueryInfo
      )
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取数据失败');
      this.goodsCateData = res.data;
    },
    async handleChange(value) { 
      console.log(value)     
      this.addCateQueryInfo.cat_level = value.length;
      this.addCateQueryInfo.cat_pid = value[value.length - 1];
    },
    async getGoodsParentList() {
      const { data: res} =  await this.$http.get('categories', {
        params: {type: 2}
      });
      if(res.meta.status!=200) return this.$message.warning('获取分类父级数据失败');
      this.goodsParentList = res.data;
      console.log(this.goodsParentList)
    },
    handleClose() {
      this.addCateQueryInfo.cat_pid = 0;
      this.addCateQueryInfo.cat_name = "";
      this.addCateQueryInfo.cat_level = 0;
      this.cateCheckedData = [];
    }
  }

}
</script>

<style lang='less' scoped>
.switch-list {
  margin: 20px 0;
  list-style: none;
  overflow: hidden;
}
.switch-item {
  margin: 20px;
  float: left;
}

</style>