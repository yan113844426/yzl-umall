<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="规格名称" label-width="120px">
          <el-input v-model="user.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格属性" label-width="120px" v-for="(item,index) in attrArr" :key="index">
          <div class="line">
            <el-input v-model="item.value" autocomplete="off"></el-input>
            <!-- 除了第一条是新增的 -->
            <!-- 点击规格属性我们去新增 -->
            <el-button type="primary" v-if="index==0" @click="addAttr">添加规格属性</el-button>
            <!-- 剩下都是删除的 -->
            <el-button type="danger" v-else @click="delAttr(index)">删除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加规格'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqspecsAdd,
  reqspecsDetail,
  reqspecsUpdate,
  reqspecsDel,
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        attrs: "[]",
        status: "1",
        specsname: "",
      },
      //属性
      attrArr: [
        //第一个属性
        {
          value: "",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqCount: "specs/reqCount",
    }),
    empty() {
      this.user = {
        status: "1",
        specsname: "",
        attrs: "",
      };
      //属性值
      this.attrArr = [{ value: "" }];
    },
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.specsname === "") {
          errorAlert("规格名称不能为空");
          return;
        }
        if (this.attrArr.length <= 1) {
          errorAlert("规格属性不能为空");
          return;
        }

        resolve();
      });
    },
    add() {
      this.check().then(() => {
        // console.log(this.user)
        //这个时候这个数组里有我们的规格属性
        //[{ value: "s" }，{value："m"}]
        //转成[s,m]
        // console.log(this.attrArr)
        this.user.attrs = JSON.stringify(
          this.attrArr.map((item) => item.value)
        );
        reqspecsAdd(this.user).then((res) => {
          if (res.data.code === 200) {
            successAlert("添加成功");
            this.cancel();
            this.empty();
            //刷新list
            this.reqList();
            this.reqCount();
          }
        });
      });
    },
    //新增规格属性
    addAttr() {
      this.attrArr.push({ value: "" });
    },
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    cancel() {
      this.info.isshow = false;
    },
    getOne(id) {
      reqspecsDetail(id).then((res) => {
        this.user = res.data.list[0];
        //  '["s","M"]'-->[{value:"s"},{value:"M"}]
        this.attrArr = JSON.parse(this.user.attrs).map((item) => ({
          value: item,
        }));
      });
    },
    update() {
      this.check().then(() => {
        this.user.attrs = JSON.stringify(
          this.attrArr.map((item) => item.value)
        );
        reqspecsUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.cancel();
            this.empty();
            this.reqList();
          }
        });
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
<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}
.line .el-button {
  width: auto;
}
</style>