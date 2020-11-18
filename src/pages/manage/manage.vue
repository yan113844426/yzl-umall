<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-list :list="list" @init="newInit" @edit="edit"></v-list>
    <!-- 现在弄分页，总条数total,pager页码，page-size每一页显示的数量 -->
    <!-- 我们现在需要知道数据库总共有多少条，就能算出来有几页 -->
    <el-pagination
      background
      @current-change="changePage"
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
    ></el-pagination>
    <v-form :info="info" @init="newInit" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqUserList, reqUserCount } from "../../utils/http";
export default {
  data() {
    return {
      //1.初始值弹框
      info: {
        isshow: false,
        title: "添加管理员",
      },
      //初始化表格的数据
      list: [],
      //初始化页码的数据
      total: 0, //总数
      size: 2, //一页显示2个
      page: 1,
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
    init() {
      //用来请求table表格中显示的数据
      //点第一页请求第一页2条
      //点第几页请几条,我们要想知道当前是第几页，看看elementui的页码
      reqUserList({ page: this.page, size: this.size }).then((res) => {
        if (res.data.code == 200) {
          //保证是个数组，因为这边的tabel表格要求是个数组，要不给个null会报错
          let list = res.data.list ? res.data.list : [];
          // 56.如果取到的list是[],并且page>1,page自减，请列表
          //比如说第二页被我们删完了，我们就应该去请求第一页的东西了
          if (list.length === 0 && this.page > 1) {
            this.page--;
            this.init();
            return;
          }

          this.list = list;
        }
      });
    },
    //获取表格的总数
    getCount() {
      reqUserCount().then((res) => {
        if (res.data.code == 200) {
          this.total = res.data.list[0].total;
        }
      });
    },
    //page是回调函数自带的参数
    changePage(page) {
      this.page = page;
      //该第2页了重新请求
      this.init();
    },
    //2.点击了添加按钮
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加管理员",
      };
    },
    edit(uid) {
      //父组件收到uid以后，因为点击编辑按钮,所以肯定要修改显示弹框的值
      this.info = {
        isshow: true,
        title: "编辑管理员",
      };
      //去获取编辑的这一条数据
      this.$refs.form.getOne(uid);
    },
    newInit() {
      //删除以后需要重新请求数据重新获取总数
      //还有添加以后需要重新获取，重新获取总数
      this.init();
      this.getCount();
    },
    ...mapActions({}),
  },
  mounted() {
    //一加载页面，就请求回来数据
    this.init();
    //一进来页面我们就需要获取总数的请求
    this.getCount();
  },
};
</script>
<style>
</style>
