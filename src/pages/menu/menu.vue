<template>
  <div>
    <!--menu菜单管理里面分为两个小组件表单和表格  -->
    <!-- 添加按钮 -->
    <!--第二步我们要去给这个添加按钮增加事件，让弹框显示-->
    <el-button type="primary" @click="willAdd" :list="list">添加</el-button>
     <!-- 19.将list传递给list.vue 组件 -->
  <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
  <!-- 自定义事件参数用$event或者无参接受 -->
  <!-- $event用来获取传过来的值 -->
    <!-- 弹框 -->
    <!-- 3.将info传递给form  -->
    <!-- 21.将list传递给form  -->
    <!-- 25.绑定自定义数据 -->
       <v-form :info="info" :list="list" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//导入两个插件
import vList from "./components/list.vue";
import vForm from "./components/form.vue";
import { reqMenuList } from "../../utils/http";
export default {
  data() {
    return {
      //1.弹框的状态
      info: {
        isshow: false,
        title:"添加菜单"
      },
      //16.列表数据
      list: []
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //2.点了添加按钮
    willAdd() {
      this.info.isshow = true;
    },
    //26 处理
    init() {
      reqMenuList().then(res => {
        this.list = res.data.list;
      });
    },
    //33.父组件应该处理编辑按钮,让弹框出现
    edit(id){
      //弹框出现
      this.info.isshow=true
      //34.给info补了一个字段,用来判断是添加按钮按的还是编辑打开的弹框
      this.info.title="编辑菜单"
      //当我点了编辑按钮以后,关于这条信息的默认值应该展示到跳出来的弹框里面
      //就得和菜单获取一套数据
      //父组件想要调用子组件的方法用ref
       //37.父组件调用子组件 form.vue 的getOne()
      this.$refs.form.getOne(id)
    }
  },
  mounted() {
    //17.一进来就要请求数据
      this.init()
  },
  components: {
    vList,
    vForm
  }
};
</script>
<style>
</style>