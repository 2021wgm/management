<template>
  <div class="good_params">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="notice_box">
        <span class='iconfont icon-gantanhao-yuankuang notice_img'> 注意只允许为第三季分类设置相关参数</span>
      </div>

      <div class="goods_choose">
        选择商品分类: 
        <el-cascader
          v-model="value"
          :options="goodsParentList"
          :props="{ expandTrigger: 'hover',value: 'cat_id' ,label: 'cat_name',children: 'children'}"
          @change="handleChange">
        </el-cascader>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane label="动态参数" name="first" :disabled="tabPlaneFlag">
          <el-button type="primary" size='mini'>添加参数</el-button>
          <el-table
            :data="manyTableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  v-for='(tagName,index) in props.row.attr_vals.split(",")'
                  :key="index"
                  closable
                  @close="tagCloseHandler(props.row,index)"
                >    
                {{tagName}}             
                </el-tag> 

                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              label="#">
            </el-table-column>

            <el-table-column prop="attr_name" label="名称">

            </el-table-column>

            <el-table-column label="操作">
              <template>
                <div>
                  <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

 

        <el-tab-pane label="静态参数" name="second" :disabled="tabPlaneFlag">
            <el-table
            :data="onlyTableData"
            style="width: 100%">

            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  v-for='(tagName,index) in (props.row.attr_vals?props.row.attr_vals.split(","):[])'
                  :key="index"
                  closable
                  @close="tagCloseHandler(props.row,index)"
                >    
                {{tagName}}             
                </el-tag> 

                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

              <el-table-column
                type="index"
                width="50"
                label="#">
              </el-table-column>

              <el-table-column prop="attr_name" label="属性名称">

              </el-table-column>

              <el-table-column label="操作">
                <template>
                  <div>
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </div>
                </template>
              </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods_params',
  data() {
    return {
      value: [],
      goodsParentList: [],
      activeName: 'first',
      sel: "many",
      manyTableData: [],
      onlyTableData: [],
      tabPlaneFlag: true,
      inputVisible: false,
      dynamicTags: ['标签一', '标签二', '标签三'],
    }
  },
  methods: {
    tagCloseHandler(currentRow,index){
      var newValue = currentRow.attr_vals.split(",");
      newValue.splice(index, 1);
      currentRow.attr_vals = newValue.toString();
      this.commitParamsHandler(currentRow)
    },
    handleInputConfirm(currentRow) {
        // if (inputValue) {
        //   this.manyTableData.push(inputValue);
        // }
        var newValue = currentRow.attr_vals?currentRow.attr_vals.split(","):[];
        newValue.push(currentRow.inputValue);
        currentRow.attr_vals = newValue.toString();
        this.commitParamsHandler(currentRow);
        currentRow.inputVisible = false;
        currentRow.inputValue = '';
    },
    async commitParamsHandler(currentRow) {
      const { data : res} = await this.$http.put(`categories/${this.value[2]}/attributes/${currentRow.attr_id}`, {
          attr_name: currentRow.attr_name,
          attr_sel: currentRow.attr_sel,
          attr_vals: currentRow.attr_vals
      })
    },
    handleChange(value) {
      if(value.length !== 3) {
        this.value = [];
        this.tabPlaneFlag = true;
        return;
      }
      this.tabPlaneFlag = false;
      this.getParamsList()
      
    },
    async getParamsList() {
      const {data: res} = await this.$http.get(`categories/${this.value[2]}/attributes`, {
        params: {
          sel: this.sel
        }
      })
      res.data.forEach(item => {
        item.inputValue = "";
        item.inputVisible = false
      })
      if(this.sel === "many") {
        this.manyTableData = res.data;
      }
      else {
        this.onlyTableData = res.data;
      }
    },

    async getGoodsParentList() {
      const { data: res} =  await this.$http.get('categories', {
        params: {type: 3}
      });
      if(res.meta.status!=200) return this.$message.warning('获取分类父级数据失败');
      this.goodsParentList = res.data;
    },
    handleClick(tab,event) {
      if(tab.index === "0") this.sel = "many";
      else this.sel = "only";
      this.getParamsList() 
    },
    showInput(currentRow) {
      currentRow.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  created(){
    this.getGoodsParentList()
  }
}
</script>

<style lang='less' scoped>
.notice_box {
  border: 3px solid  transparent;
  height: 35px;
  background-color: chartreuse;
  .notice_img {
    font-size: 16px;
    color: orange;
    line-height: 35px;
    margin-left: 60px;
  }
}
.goods_choose {
  margin-top: 20px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}



</style>
