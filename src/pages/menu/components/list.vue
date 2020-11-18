<template>
  <div>
    <!-- :data是数据 -->
    <!-- 21展示list -->
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <!-- 树型结构,用children判断该菜单有没有下一层菜单 -->
      <el-table-column prop="id" label="菜单编号" sortable></el-table-column>
      <el-table-column prop="title" label="菜单名称" sortable></el-table-column>
      <el-table-column prop="icon" label="菜单图标">
           <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单地址"></el-table-column>
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
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <!-- 点击按钮决定是否删除 -->
            <!-- 点哪条删除哪条 -->
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {reqMenuDel} from "../../../utils/http"
import {successAlert,errorAlert} from "../../../utils/alert"
export default {
  // 展示的是list
  /* 
   编号id
  */
  props: ["list"],
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
     // 28.删除
    // 看看删除的是那个数据
    del(id) {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除的请求,告诉后端删除这个数据 
          reqMenuDel(id).then(res=>{
            if(res.data.code==200){
              //成功的弹框
              successAlert(res.data.msg)
              //29.通知父组件刷新list 
              this.$emit("init")
            }else{
              errorAlert(res.data.msg)
            }
          })
        })
        .catch(() => {
          console.log(" 你点了取消");
        });
    },
    //31.点击编辑按钮
    edit(id){
     //通知父组件我要修改你里面的数据
      //通知父组件，要编辑了,需要给父组件绑定自定义事件
      this.$emit("edit",id)
      //标题换成编辑菜单
    }
  },
  mounted() {
    
  },
};
</script>
<style>
</style>