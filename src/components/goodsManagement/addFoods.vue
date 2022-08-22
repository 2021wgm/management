<template>
  <div class="addFoods">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

  <el-card>
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false">
    </el-alert>

    <el-steps  align-center :active="active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <el-form :model="ruleForm" :rules="rules"  label-width="100px" class="demo-ruleForm" label-position="top" ref="addGoodsRef"> 
      <el-tabs :tab-position="tabPosition"  @tab-click="tabClickHandler" :before-leave="beforeTabLeave">
        <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" >
              <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover',children: 'children', label: 'cat_name', value	: 'cat_id' }"
                @change="handleChange">
              </el-cascader>
            </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form-item :label="item.attr_name" v-for='(item, index) in paramsList' :key="item.attr_id">
            <el-checkbox-group  v-model="checkboxGroup1" size="small" @change="goodsColorHandler">
              <el-checkbox :label="itemT" border v-for='(itemT, indext) in item.attr_vals.split(",")'></el-checkbox>
            </el-checkbox-group>        
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form-item :label="item.attr_name"  v-for="(item, index) in GoodsFetures" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :file-list="fileList"
            :headers="requestHeaderToken"
            list-type="picture"
            :on-success="picSuccess"
            :on-preview="previewHandler"
            >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

          <el-dialog title="图片预览" :visible.sync="picPreVisible">
            <img :src="picPreUrl" alt="">
          </el-dialog>

        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor v-model="introduce" :options="editorOption"></quill-editor>
          <el-button type="primary" @click="addGoodsHandler">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'addFoods',
  data(){
    return {
      active: 0,
      tabPosition: 'left',
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        num: ""
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      value: [],
      options: [{}],
      checkboxGroup1: [],
      paramsList: [],
      isShow: "是",
      GoodsFetures: [],
      fileList: [],
      requestHeaderToken: {
        Authorization: sessionStorage.getItem('token')
      },
      upLoadPic: null,
      picLoadArr: [],
      picPreVisible: false,
      picPreUrl: null,
      introduce: "",
      editorOption: {
        innerHeight: "200px"
      }
    }
  },
  computed: {
    threeCateId(){
      return this.value[2];
    }
  },
  components: {
    quillEditor
  },
  created() {
    this.getCateList();
  },
  methods: {
    goodsColorHandler(e) {
      console.log(e, 333)
    },
    previewHandler(file) {
      console.log(file);
      this.picPreUrl = file.url;
      this.picPreVisible = true;
    },
    tabClickHandler(e) {
              console.log(this.GoodsFetures, 211)

      if(this.value.length!==3) {
        return this.$message.warning('请选择商品分类') 
      }
      this.active = parseInt(e.index);
      console.log(e.index)
      if(e.index === '1') {
        this.getParamsList()
      }else if(e.index === '2') {
        this.getGoodsFetures()
      }
    },
    handleChange(value) {
      console.log(value)
      if(this.value.length!==3) {
        this.value= []
      }
    },
    async getCateList() {
      const { data: res} = await this.$http.get(`categories`);
      this.options = res.data;
    },
    beforeTabLeave(activeName, oldActiveName) {
      if(activeName==0) {return true}
      if(activeName!==oldActiveName) {
        if(this.value.length!==3) {
          return false;
        }
      }
    },
    async getParamsList() {
      const { data: res} = await this.$http.get(`categories/${this.threeCateId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      this.paramsList = res.data;
    },
    async getGoodsFetures() {
      const { data: res} = await this.$http.get(`categories/${this.threeCateId}/attributes`, {
        params: {
          sel: 'only'
        }
      })
      this.GoodsFetures = res.data;
      console.log(this.GoodsFetures, 555)   
    },
    
    async handleRemove(file, fileList) {
      console.log(file, fileList);
      let indexDel;
      this.picLoadArr.forEach(function(item, index) {
        if(item.pic == file.response.data.tmp_path) {
          indexDel = index;
        }
      })
      this.picLoadArr.splice(indexDel, 1);
      const res = await this.$http.post('goods', {
        goods_name: this.ruleForm.goods_name,
        goods_cat: null,
        goods_price: this.ruleForm.goods_price,
        goods_number: this.ruleForm.goods_number,
        goods_weight: this.ruleForm.goods_weight,
        goods_introduce: this.introduce,
        pics: this.picLoadArr,
        attrs: null
      }
      )
    },
    handlePreview(file) {
    },
    async picSuccess(response, file, fileList) {
      this.upLoadPic = response.data.tmp_path
      const res = await this.$http.post('goods', {
        goods_name: this.ruleForm.goods_name,
        goods_cat: null,
        goods_price: this.ruleForm.goods_price,
        goods_number: this.ruleForm.goods_number,
        goods_weight: this.ruleForm.goods_weight,
        goods_introduce: this.introduce,
        pics: this.picLoadArr.push({"pic": this.upLoadPic}),
        attrs: null
      }
      )
    },
    addGoodsHandler() {
      this.$refs['addGoodsRef'].validate(async (valid) => {
      if(!valid) return this.$message.error("请输入表单项");
        const res = await this.$http.post('goods', {
          goods_name: this.ruleForm.goods_name,
          goods_cat: this.value.join(","),
          goods_price: this.ruleForm.goods_price,
          goods_number: this.ruleForm.goods_number,
          goods_weight: this.ruleForm.goods_weight,
          goods_introduce: this.introduce,
          pics: this.picLoadArr,
          attrs: null
      })
      })
    }  
  }
}
</script>

<style lang="less" scoped>
.el-tabs--left, .el-tabs--right {
  overflow:none;
}

.el-steps {
  margin: 15px 0;
}

.el-tab-pane{
  padding-left: 10px;
}

.el-dialog img {
  width: 100%;
}


.el-tab-pane .el-button {
  margin-top: 10px;
}
</style>