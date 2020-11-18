<template>
  <div class="login">
    <!-- 
        clearble清空
        show-password 小眼睛
    -->
    <div class="con">
      <h3>登录</h3>
      <div class="line">
        <!-- input框必须绑定v-model,否则不能输入内容 -->
        <el-input placeholder="请输入内容" v-model="user.username" clearable></el-input>
      </div>
      <div class="line">
        <el-input v-model="user.password" placeholder="请输入密码" clearable show-password></el-input>
      </div>
      <div class="last">
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../utils/alert";
// 做登录请求了
import { reqLogin } from "../../utils/http";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    login() {
      reqLogin(this.user).then((res) => {
        if (res.data.code == 200) {
          //登录成功要弹出一个
          successAlert("登录成功");
          //把数据存入vuex,刷新一下就没了，所以本地存储也得存一面
           //存入vuex
            this.changeUser(res.data.list)
          //还要跳转页面
          this.$router.push("/");
        }
      });
    },
    ...mapActions({
       "changeUser":"changeUser"
    }),
  },
  mounted() {},
};
</script>
<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(to right, #543444, #403A53, #303D5F);
}
.con {
  width: 400px;
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
h3 {
  line-height: 60px;
  font-size: 30px;
  text-align: center;
}
.line {
  margin-bottom: 20px;
}
.last {
  text-align: center;
}
</style>