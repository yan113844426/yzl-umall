<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-form :info="info" ref="form"></v-form>
    <v-list @edit="edit"></v-list>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "添加分类",
      },
    };
  },
  components: {
    vForm,
    vList,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //点击添加按钮以后要让表单显示
    willAdd(){
      this.info={
        isshow:true,
        title:"添加分类"
      }
    },
    edit(id){
        this.info = {
        isshow: true,
        title: "编辑分类"
      };
      this.$refs.form.getOne(id);
    }
  },
  mounted() {},
};
</script>
<style>
</style>