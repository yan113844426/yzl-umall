<template>
<div>
    <!-- 该渲染表格了 -->
      <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
    <!-- prop每列的单元格显示的内容 -->
      <el-table-column prop="id" label="用户编号" sortable></el-table-column>
      <el-table-column prop="username" label="用户名称" sortable></el-table-column>
      <el-table-column prop="rolename" label="所属角色" sortable></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <!-- 32.绑定confirm事件 -->
          <del-btn @confirm="del(scope.row.uid)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
import { reqUserDel } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["list"],
computed: {
...mapGetters({})
},
methods: {
  del(uid){ 
       //删除的请求
      reqUserDel(uid).then(res => {
        if (res.data.code == 200) {
          //成功的弹框
          successAlert(res.data.msg);
          //28.通知父组件刷新list
          this.$emit("init");
        }
      }); 
  },
  edit(uid){
    //点击编辑按钮以后要把uid传给父组件
      this.$emit("edit", uid);
  },
 ...mapActions({
}),
 },
mounted() {}
}
</script>
<style>
</style>