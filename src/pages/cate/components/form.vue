<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="上级分类" label-width="120px">
          <el-select v-model="user.pid" placeholder="请选择">
            <el-option :value="0" label="顶级分类"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="user.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px" v-if="user.pid!==0">
          <!--上传图片这块 -->
          <!-- 改成#号上传必须失败，因为没有地方可以上传 -->
          <!-- 报错不用管404 -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile"
          >
            <!-- 要展示的图 -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加分类'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import path from "path";
import { successAlert, errorAlert } from "../../../utils/alert";
import { reqcateAdd, reqcateDetail, reqcateUpdate } from "../../../utils/http";

export default {
  props: ["info"],
  data() {
    return {
      user: {
        //后端需要上传的字段
        pid: "",
        catename: "",
        img: null,
        status: 1,
      },
      //用来上传文件的url,初始化图片路径
      imageUrl: "",
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
    }),
    //用来清空数据
    empty() {
      this.user = {
        pid: "",
        catename: "",
        img: null,
        status: 1,
      };
      this.imageUrl = null;
    },
    changeFile(e) {
      //就是关于选中的文件的数据
      let file = e.raw;
      //判断文件的大小，如果超过2m，不让上传
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
        return;
      }
      //判断文件类型
      let extname = path.extname(file.name); //'.jpg'
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的图片格式！");
        return;
      }
      //把文件转成对象
      this.imageUrl = URL.createObjectURL(file);
      this.user.img = file;
    },
    //验证规则
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.pid === "") {
          errorAlert("上级分类不能为空");
          return;
        }
        if (this.user.catename === "") {
          errorAlert("分类名称不能为空");
          return;
        }
        //因为顶级分类不需要上传图片，顶级分类的pid为0
        if (this.imgUrl == null && this.user.pid !== 0) {
          errorAlert("图片为空");
          return;
        }

        resolve();
      });
    },
    add() {
      this.check().then(() => {
        //点击了添加按钮以后
        reqcateAdd(this.user).then((res) => {
          //弹成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //24 刷新list
          this.reqList();
        });
      });
    },
    update() {
      this.check().then(() => {
        reqcateUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            //弹成功
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新list
            this.reqList();
          }
        });
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    //37 获取详情
    getOne(id) {
      reqcateDetail(id).then((res) => {
        //此刻user没有id
        this.user = res.data.list;
        this.imageUrl = this.$imgPre + this.user.img;
        //补id
        this.user.id = id;
      });
    },
    closed() {
      if (this.info.title === "编辑分类") {
        this.empty();
      }
    },
  },
  mounted() {},
};
</script>
<style scoped lang="stylus">
.add >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>