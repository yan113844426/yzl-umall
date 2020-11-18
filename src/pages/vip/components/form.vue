<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { reqvipDetail, reqvipUpdate } from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        uid: "",
        status: 1,
        nickname: "",
        phone: "",
        password: "",
      },
      oldpass: "",
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqvipList: "vip/reqList",
    }),
    empty() {},
    cancel() {
      this.info.isshow = false;
    },
    closed() {
      this.empty();
    },
    getOne(uid) {
      reqvipDetail(uid).then((res) => {
        this.user = res.data.list;
        this.oldpass = this.user.password;
        this.user.password = "";
      });
    },
    update() {
      if (this.user.password == "") {
        this.p = { ...this.user };
        this.p.password = this.oldpass;
        this.oldpass = "";
      }
      if (this.user.password === "") {
        reqvipUpdate(this.p).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新list
            this.reqvipList();
          }
        });
      } else {
        //如果password修改了，就用this.user
        reqvipUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新list
            this.reqvipList();
          }
        });
      }
    },
  },
  mounted() {},
};
</script>
<style>
</style>