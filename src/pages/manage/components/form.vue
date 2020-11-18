<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="所属角色" label-width="120px">
          <el-select v-model="user.roleid" placeholder="请选择">
            <!-- 根据请求回来的角色列表来渲染 -->
            <!-- 选中的值一个item.id,展示的应该是rolename -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加管理员'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqRoleList,
  reqUserAdd,
  reqUserDetail,
  reqUserUpdate,
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      //用来渲染下拉列表框中请选择角色
      //角色列表
      roleList: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    cancel() {
      this.info.isshow = false;
    },
    add() {
      //点击了添加按钮以后提交数据给后天
      reqUserAdd(this.user).then((res) => {
        //添加成功以后
        if (res.data.code == 200) {
          //弹出一个弹窗告诉用户添加成功
          //弹成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //刷新tabel表格
          this.$emit("init");
        }
      });
    },
    getOne(uid) {
      //根据这个uid获取回来的这一条数据，赋值给表单
      reqUserDetail(uid).then((res) => {
        //此刻user没有id,有uid,而修改要的就是uid
        this.user = res.data.list;
        //处理密码
        this.user.password = "";
        //这样当前要编辑的这条记录就会写在表单里面了
      });
    },
    update() {
      reqUserUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          //弹成功
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //刷新list
          this.$emit("init");
        }
      });
    },
    //处理弹框消失的时候
    closed() {
      if (this.info.title === "编辑管理员") {
        this.empty();
      }
    },
    ...mapActions({}),
  },
  mounted() {
    //页面一加载的时候就去请求角色列表，来渲染请选择角色
    reqRoleList().then((res) => {
      if (res.data.code == 200) {
        this.roleList = res.data.list;
      }
    });
  },
};
</script>
<style>
</style>