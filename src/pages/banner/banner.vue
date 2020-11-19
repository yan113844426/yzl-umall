<template>
  <div>
    <!-- 3.把组件添加到页面中 -->
    <el-button type="primary" @click="willAdd()">添加</el-button>
    <v-list @edit="edit"></v-list>
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//1.引入组件
import vList from "./components/list";
import vForm from "./components/form";
export default {
  //4.初始化属性用于控制form表单
  data() {
    return {
      info: {
        isShow: false,
        title: "轮播图添加",
      },
    };
  },
  //2.去注册组件
  components: {
    vList,
    vForm,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //5.子组件发射了编辑事件，这里要记得接受
    edit(id) {
      this.info = {
        isShow: true,
        title: "轮播图编辑",
      };
      this.$refs.form.getOne(id);
    },
    //6.点击添加
    willAdd() {
      this.info = {
        isShow: true,
        title: "轮播图添加",
      };
    },
  },
  mounted() {},
};
</script>
<style>
</style>