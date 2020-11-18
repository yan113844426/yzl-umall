<template>
  <div>
    <!-- 1.复制一个表格过来，这里的:data是要渲染的数据
       一开始需要个变量，我们没有变量就弄一个空的数组
        :data="[]" //为了有个数据，我们需要弄个:data[{}]
    -->
    <!-- 27.list展示在页面 -->
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <!-- 第二步去修改表头的名字 label="角色编号" -->
      <!-- prop是具体的单远哥值 -->
      <el-table-column prop="id" label="角色编号" sortable></el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable></el-table-column>
      <el-table-column label="状态">
        <!--这里并不是原样输出，需要template -->
        <!-- 想用到这里面的数据，需要加个slot-scoped="scoped" -->
        <!-- 用到每一条数据是scope.row.status-->
        <template slot-scope="scope">
          <div>
            <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
            <el-button type="info" v-else>禁用</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div>
            <!-- 看看编辑按钮,点击编辑按钮,弹窗出来,要修改父组件的值 -->
            <!-- 34.该编辑按钮的时候，我们需要的逻辑去父组件里，因为涉及到form表单 -->
            <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <!-- 点击按钮决定是否删除 -->
            <!-- 点哪条删除哪条 -->
            <!-- 29.就该实现删除按钮了 -->
            <!-- 这里用的是公共组件 -->
            <del-btn @confirm="del(scope.row.id)"></del-btn>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { reqRoleDel } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";

export default {
  //26.子组件接受list
  props: ["list"],
  computed: {
    ...mapGetters({}),
  },
  methods: {
    del(id){
       //删除的请求
      reqRoleDel(id).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //28.通知父组件刷新list
          this.$emit("init");
        }
      })
    },
      edit(id){
      this.$emit("edit",id)
    },
    ...mapActions({}),
  
  },
  mounted() {},
};
</script>
<style>
</style>