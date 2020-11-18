<template>
  <div>
    <!-- 5.简单的静态页面已经搭配完毕，我们就可以写基本的逻辑，首先我们要这个弹框出现一下，所以需要给添加按钮绑定一个事件，由于子组件也想修改弹框的出现和消失，所以我们得传个对象过去 -->
      <el-button type="primary" @click="willAdd">添加</el-button>
      <!-- 25.传list给子组件，让子组件根据list去渲染 -->
      <!-- 30.绑定自定义数据 -->
      <!--  -->
     <v-list :list="list" @init="init" @edit="edit"></v-list>
      <!-- 7.传递info给form组件，因为form组件需要根据info的值进行出现和消失 -->
      <!-- 29.绑定子组件通知父组件的刷新列表 -->
      <v-form :info="info" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
//引入两个子组件
import vList from "./components/list";
import vForm from "./components/form";
import{reqRoleList} from "../../utils/http"
export default {
  components:{
      vList,
      vForm
  },
  data(){
    return{
      // 6.定义初始值
      info:{
        isshow:false,
        // 当我们点击添加按钮的时候跳出来的弹窗的标题是添加角色，当我们点击修改按钮跳出来的弹框应该是修改角色，所以这个值也得改变
        title:"添加角色"
      },
      //23.列表数据的值
      list:[]
    }
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 11当我们点击了添加按钮，让弹框出现
    willAdd(){
      this.info.isshow=true
    },
    init(){
      reqRoleList().then(res=>{
        if(res.data.code==200){
             console.log(res.data.list)
            this.list=res.data.list
        }
      })
    },
    // 36.list当中点击了编辑按钮，首先要调出弹窗
    edit(id){
      this.info={
        isshow:true,
        title:"编辑角色"
      }
      //这个时候父组件需要调用表单组件的方法，去获得这一套数据，所以需要通过refs
        this.$refs.form.getOne(id)
    }
  },
  mounted() {
    //24一进来我们就发请求
     this.init()
  },
};
</script>
<style>
</style>