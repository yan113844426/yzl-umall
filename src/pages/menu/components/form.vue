<template>
  <div>
    <!-- 5.绑定info.isshow到模板 -->
    <!-- @closed -->
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <!-- 把那一条数据赋值给Form,就可以展示在表单上 -->
      <el-form :model="form">
        <el-form-item label="菜单名称" label-width="120px">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" label-width="120px">
          <!-- 在里是pid,目录,上层 -->
          <!-- 如果我们选了顶级菜单0,目录只能是1 -->
          <el-select v-model="form.pid" placeholder="请选择" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 23 list遍历 -->
            <!-- 菜单,展示了菜单名称,后台要的value是id -->
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" label-width="120px">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <!-- 15.目录只需要显示图标图标，菜单有地址 -->
        <el-form-item label="菜单图标" v-if="form.type===1" label-width="120px">
          <el-select v-model="form.icon" placeholder="请选择">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" v-else label-width="120px">
          <el-select v-model="form.url" placeholder="请选择">
            <!-- 10.遍历routes -->
            <el-option
              v-for="item in routes"
              :key="item.path"
              :label="item.name+'--/'+item.path"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!-- 点击添加按钮就显示添加菜单,点击表格里的编辑按钮就出现编辑菜单 -->
        <el-button type="primary" @click="add" v-if="info.title==='添加菜单'">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { routes } from "../../../router";
import { reqMenuAdd, reqMenuDetail, reqMenuUpdate } from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  // 4.接受info
  //   22.接收list
  props: ["info", "list"],
  data() {
    return {
      //icon集合
      icons: [
        "el-icon-s-tools",
        "el-icon-user-solid",
        "el-icon-s-help",
        "el-icon-s-operation",
      ],
      //9.定义routes
      routes: routes,
      //11.初始化form,并通过v-model绑定数据到模板
      form: {
        pid: "",
        title: "",
        icon: "",
        type: "",
        url: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //6.点击了取消
    cancel() {
      this.info.isshow = false;
    },
    //27.上级菜单发生了修改
    //顶级菜单是0 ,那么用户只能选择目录1
    changePid() {
      // 如果上级菜单是 顶级菜单，那么 form.type=1;否则是2
      if (this.form.pid === 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    // 13.form置空
    empty() {
      this.form = {
        pid: "",
        title: "",
        icon: "",
        type: "",
        url: "",
        status: 1,
      };
    },
    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.form.title === "") {
          errorAlert("菜单名称不能为空");
          return;
        }
        if (this.form.pid === "") {
          errorAlert("上级菜单不能为空");
          return;
        }
        if (this.form.type === "") {
          errorAlert("菜单类型为空");
          return;
        }

        resolve();
      });
    },

    //12.点击了添加按钮
    add() {
      this.check().then(() => {
        //发起添加的请求
        reqMenuAdd(this.form).then((res) => {
          if (res.data.code === 200) {
            //成功
            //弹个成功
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //form置空
            this.empty();
            //24.通知menu刷新列表数据
            //添加完成以后需要刷新一下table的数据
            this.$emit("init");
          } else {
            errorAlert(res.data.msg);
          }
        });
      });
    },
    //36.获取一条数据
    getOne(id) {
      reqMenuDetail(id).then((res) => {
        //此时form上是没有id的
        //就应该把现在的数据赋值给this.form
        this.form = res.data.list;
        //但是回来的数据没有id,需要补一个,
        //这个id就是点编辑按钮传过来的
        //这个补的id就是用来给  reqMenuUpdate
        this.form.id = id;
      });
    },
    //37 点了修改
    update() {
      this.check().then(() => {
        // 把你修改的东西给后端
        reqMenuUpdate(this.form).then((res) => {
          if (res.data.code === 200) {
            //成功弹框
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //form重置
            this.empty();
            //列表刷新
            this.$emit("init");
          } else {
            errorAlert(res.data.msg);
          }
        });
      });
    },
    //38.弹框消失
    // 在这个表单动画消失的情况下会触发一个事件
    closed() {
      // 如果是添加出现，点击了取消，此时，什么都不做
      // 如果是编辑出现，点击了取消，此时，form置空
      if (this.info.title === "编辑菜单") {
        this.empty();
      }
    },
  },
  mounted() {
    console.log(123);
    // 这个时候子组件挂载完成会一上来执行一次，这个时候list还没有渲染上
    console.log(this.list);
    console.log(this.$props);
  },
  beforeUpdate() {
    console.log(456);
    console.log(this.list);
  },
};
</script>
<style scoped>
</style>