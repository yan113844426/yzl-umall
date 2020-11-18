<template>
  <div>
    <v-list @edit="edit"></v-list>
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//引入
import vList from "./components/list";
import vForm from "./components/form";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "会员修改",
      },
    };
  },
  components: {
    vList,
    vForm,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    edit(uid) {
      this.info = {
        isshow: true,
        title: "会员修改",
      };
      //去获取一条数据
        this.$refs.form.getOne(uid);
    },
  },
  mounted() {},
};
</script>
<style>
</style>