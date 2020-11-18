<template>
  <div>
    <el-table :data="vipList" border style="width: 100%">
      <el-table-column prop="id" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert } from "../../../utils/alert";
export default {
  computed: {
    ...mapGetters({
       vipList:"vip/list"
    }),
  },
  methods: {
    ...mapActions({
       "reqvipList":"vip/reqList"
    }),
    //点击编辑按钮要告诉父元素，自己点了编辑
    edit(uid){
     this.$emit("edit", uid);
    },
  },
  mounted() {
    //一上来就发请求
    this.reqvipList()
  },
};
</script>
<style>
</style>