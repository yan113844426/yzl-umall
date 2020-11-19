<template>
  <div>
    <!-- 第三步过来弄表单的弹框，去elementui中复制一个 -->
    <!-- 
        :visible.sync:是这个表单是否显示
        :model是这个表单通过那个数据来渲染
        title是弹框左侧显示的标题名字
        label就是输入框左侧显示的文字，例如名字：输入框
    -->
    <!-- 9.把这个弹框的visible.sync改成info -->
    <el-dialog title="添加角色" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 4.这里是个树形，我们要去找个树形控件，一开始复制的时候记得把他的数据给复制过来-->
        <!--       node-key="id",根据key来决定 -->
        <!-- 20。将menuList绑上去，配置props -->
        <el-form-item label="角色权限" label-width="120px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children: 'children',label: 'title'}"
          >
            <!-- 我们要展示的词语是title -->
          </el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 12.当我们点击取消按钮，就把info的isshow给显示为false,设置了这个以后点击x号也会随着这个值一样-->
        <el-button @click="cancel">取 消</el-button>
        <!-- 10.如果info的title标题是添加角色，那么这里显示的就应该是添加按钮，否则修改按钮 -->
        <!-- 16.一旦我们点了这个添加按钮就该做添加请求 -->
        <el-button type="primary" v-if="info.title=='添加角色'" @click="add">添加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
//15.reqRoleAdd要用到请求接口
import {
  reqMenuList,
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../utils/http";
export default {
  //8.接收info
  props: ["info"],
  // 注意上面用到的变量要到这里来定义
  data() {
    return {
      //13.添加取消按钮逻辑都做完了，就改做添加按钮的工作了，添加按钮的时候，我们需要获取到表单的值传给父元素，所以看一下后台接口需要什么
      user: {
        //角色名字，字符串
        rolename: "",
        //角色权限，要个"[]"",字符串数组
        menus: "",
        //角色状态，需要number
        status: 1,
      },
      //18.角色权限要的数据是菜单管理的表格里面的数据,
      //这个数组是请求得到的，所以一进来我们就需要渲染上去
      menuList: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    cancel() {
      this.info.isshow = false;
    },
    empty() {
      //22.清空数据
      this.user = {
        rolename: "",
        menus: "",
        status: 1,
      };
      //把选中的清空
      this.$refs.tree.setCheckedKeys([]);
    },
    //
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.rolename === "") {
          errorAlert("角色名称不能为空");
          return;
        }
        //验证
        if (this.$refs.tree.getCheckedKeys().length === 0) {
          errorAlert("角色权限不能为空");
          return;
        }
        resolve();
      });
    },
    add() {
      this.check().then(() => {
        //17.添加按钮的操作
        //我们就可以做添加请求了，添加之前应该把选中的key赋值给menus
        //21.将树形空间的数据取出，变成字符串数组，赋值给user.menu
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleAdd(this.user).then((res) => {
          //弹个成功
          successAlert("恭喜添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //28.刷新列表list，通过父组件该刷新列表了
          this.$emit("init");
        });
      });
    },
    //这个id是点击编辑按钮获取的id
    getOne(id) {
      reqRoleDetail(id).then((res) => {
        console.log(res);
        //此刻user没有id
        this.user = res.data.list;
        //处理树形控件的数据
        //注意树和menus是没有关联的
        this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));

        // 补id
        this.user.id = id;
      });
    },
    update() {
      this.check().then(() => {
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleUpdate(this.user).then((res) => {
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
      });
    },
    //41.处理消失
    closed() {
      if (this.info.title === "编辑角色") {
        this.empty();
      }
    },
  },
  mounted() {
    //19.一进来我们就需要获取菜单列表的数据去渲染页面
    reqMenuList().then((res) => {
      if (res.data.code == 200) {
        //用这个去渲染页面
        console.log(res);
        this.menuList = res.data.list;
      }
    });
  },
};
</script>
<style>
</style>