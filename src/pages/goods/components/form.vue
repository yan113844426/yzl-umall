<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed" @opened="opened">
      <!-- 在验证规则的时候，要记得给form绑定一个rules属性-->
      <el-form :model="user" :rules="rules">
        <!-- 4.绑定一级分类列表数据，需要先请求回来 -->
        <!-- 在验证的规则还得给每一项el-form-item绑定一个prop -->
        <el-form-item label="一级分类" label-width="120px" prop="first_cateid">
          <el-select placeholder="请选择一级分类" v-model="user.first_cateid" @change="changeFirst">
            <!-- 6.遍历一级分类 -->

            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px" prop="second_cateid">
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="120px" prop="goodsname">
          <el-input v-model="user.goodsname" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="120px" prop="price">
          <el-input v-model="user.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="120px" prop="market_price">
          <el-input v-model="user.market_price" placeholder="请输入市场价格"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <!-- 上传文件 -->
          <div class="myupload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt />

            <input v-if="info.isshow" type="file" class="ipt" @change="changeFile" />
          </div>
        </el-form-item>
        <el-form-item label="商品规格" label-width="120px" prop="specsid">
          <!-- 11.遍历 -->
          <el-select placeholder="请选择商品规格" v-model="user.specsid" @change="changeSpecsId">
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 规格属性又是基于商品规格的变化，就好像一级和二级分类 -->
        <!-- 17.商品规格属性是根据商品规格来的 -->
        <el-form-item label="规格属性" label-width="120px" prop="specsattr">
          <el-select placeholder="请选择二级分类" v-model="user.specsattr" multiple>
            <el-option v-for="item in attrsList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="120px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="120px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <!--富文本编辑器，第一步需要建立一个r容器，一会在它上面建立富文本编辑器
          -->
          <div v-if="info.isshow" id="edit"></div>
          <!-- 给它绑定isshow是希望它不要建立多个，始终有一个 -->
          <div id="edit" v-if="info.isshow"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加商品'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqcateList,
  reqgoodsAdd,
  reqgoodsDetail,
  reqgoodsUpdate,
  reqspecsDel,
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
//引入富文本编辑器
import E from "wangeditor";
export default {
  props: ["info"],
  data() {
    return {
      //这里的规则只是提示一下用户，为了美观，并不起实际作用
      rules: {
        first_cateid: [
          { required: true, message: "请输入一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请输入二级分类", trigger: "change" },
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        market_price: [
          { required: true, message: "请输入商品市场价格", trigger: "blur" },
        ],
        specsid: [
          { required: true, message: "请输入商品规格", trigger: "change" },
        ],
        specsattr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个规格属性",
            trigger: "change",
          },
        ],
      },
      user: {
        //选中哪个获取哪个的id
        first_cateid: "",
        //当一级发生修改的时候，二级分类应该根据一级分类的改变
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //此时是数组，后端要的是 "[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //二级分类的list
      secondCateList: [],
      //9.定义存放图片的临时地址
      imgUrl: "",
      //16.商品规格属性[白色，蓝色，黄色]
      attrsList: [],
    };
  },
  computed: {
    ...mapGetters({
      //2.获取一级分类数据
      cateList: "cate/list",
      //14.定义规格的数据
      specsList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      //2.请求一级分类list
      reqCateList: "cate/reqList",
      //11.请求商品规格的数据，一进来请求一次
      reqSpecsList: "specs/reqList",
      //  //商品list和总数
      reqGoodsList: "goods/reqList",
      reqGoodsCount: "goods/reqCount",
    }),
    //6.根据一级分类发生改变来请求二级分类的数据
    changeFirst() {
      //二级分类的id重置，因为每次选择的一级分类都不一样，所以二级分类需要在改变一开始变为空
      this.user.second_cateid = "";
      this.getSecondList();
    },
    getSecondList() {
      //7.获取二级分类list，需要传一个pid过去，来获取当前选中的二级分类，注意这里的reqcateList用的是引入进来的http.js中没用仓库中的，因为仓库中是一下子都请求完毕
      reqcateList({ pid: this.user.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    //10.处理图片
    changeFile(e) {
      let file = e.target.files[0];
      this.imgUrl = URL.createObjectURL(file);
      this.user.img = file;
    },
    //15.修改商品规格的时候，商品属性就得重新获取
    //获取关于此规格的属性
    changeSpecsId() {
      //肯定得先讲商品属性置空，万一还停留在上一次
      this.user.specsattr = [];
      //再去请求商品属性
      this.getAttrs();
    },
    //16.获取规格属性
    getAttrs() {
      //因为规格属性是在规格中的数据中包含的所以需要取出来
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的,specsid是选中的商品规格
      let obj = this.specsList.find((item) => item.id === this.user.specsid);
      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj.attrs;
      console.log(this.attrsList);
    },
    //清空
    empty() {
      this.user = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //此时是数组，后端要的是 "[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      //二级分类的list
      this.secondCateList = [];
      //图片临时地址
      this.imgUrl = "";
      //规格属性list
      this.attrsList = [];
    },
    //我们这里在提交之前需要验证数据
    check() {
      //注意return是结束当前所在的函数，这是结束check，并没有结束add,
      //这里的return结果是promise对象，promise对象只有都符合，才会走到resolve,
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
          //如果这个满足了，就没有机会找到resolve
        }
        if (this.user.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.user.goodsname === "") {
          errorAlert("商品名称为空");
          return;
        }
        if (this.user.price === "") {
          errorAlert("商品价格为空");
          return;
        }
        if (this.user.market_price === "") {
          errorAlert("商品市场价格为空");
          return;
        }
        if (!this.user.img) {
          errorAlert("请选择图片");
          return;
        }
        if (this.user.specsid === "") {
          errorAlert("请选择商品规格");
          return;
        }
        if (this.user.specsattr.length === 0) {
          errorAlert("请选择商品属性");
          return;
        }
        if (this.editor.txt.html() === "") {
          errorAlert("请输入商品描述");
          return;
        }
        resolve();
      });
    },
    add() {
      this.check().then(() => {
        // 17.实现添加按钮的功能
        //我们需要单独处理一下富文本编辑器的内容
        //将编辑器的内容取出来给user.description
        //this.editor.txt.html() 取值
        this.user.description = this.editor.txt.html();
        //该实现添加按钮了，我们需要先复制一份出来
        let d = { ...this.user };
        //因为提交的时候要的规格属性是字符串数组，如果直接在user上改的话，就会引起数据驱动，双向数据绑定，导致选择哪里也成了字符串数组
        d.specsattr = JSON.stringify(d.specsattr);
        //发起请求
        reqgoodsAdd(d).then((res) => {
          if (res.data.code === 200) {
            successAlert("添加成功");
            this.cancel();
            this.empty();
            //刷新list
            this.reqGoodsList();
            //添加也会引起分页的变化
            this.reqGoodsCount();
          }
        });
      });
    },
    cancel() {
      this.info.isshow = false;
    },
    update() {
      this.user.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqspecsUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.cancel();
          this.empty();
          this.reqList();
        }
      });
    },
    //弹框打开的时候，动画结束了，我们建立一个富文本编辑器，如果是写在添加或者编辑两个事件中，就会多创立，多写几次
    opened() {
      this.editor = new E("#edit");
      this.editor.create();
      this.editor.txt.html(this.user.description);
    },
    closed() {
      if (this.info.title === "编辑商品") {
        this.empty();
      }
    },
    //20.该选中一条信息编辑它了
    getOne(id) {
      reqgoodsDetail(id).then((res) => {
        this.user = res.data.list;
        console.log(this.user);
        this.user.id = id;
        //为啥要重新请求二级list，因为点击修改的时候这里是没有东西的只有选中的，所以我们需要重新渲染咧白哦李的东西
        this.getSecondList();
        //图片
        this.imgUrl = this.$imgPre + this.user.img;
        //属性,取回来的属性得重新请求
        console.log(typeof this.user.specsattr); //字符串
        this.user.specsattr = JSON.parse(this.user.specsattr);
        //计算规格属性的list，因为规格属性的下拉列表也得渲染
        this.getAttrs();
        //给编辑器赋值,因为这里是不确定有没有编辑器的，因为编辑器和ajax不知道是哪个先完成，为了保险起见我们在这里写了，在动画结束的时候也得赋值，谁先弄完就先用哪个
        if (this.editor) {
          this.editor.txt.html(this.user.description);
        }
      });
    },
    //21.该修改了,修改的时候我们还是得把其中的规格属性转换为字符串
    update() {
      this.check().then(() => {
        this.user.description = this.editor.txt.html();
        let d = { ...this.user };
        d.specsattr = JSON.stringify(d.specsattr);
        reqgoodsUpdate(d).then((res) => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.cancel();
            this.empty();
            this.reqGoodsList();
          }
        });
      });
    },
  },
  mounted() {
    //4.一进来请求一级分类列表
    this.reqCateList();
    // 13.一进来就请求规格list,参数true，是为了取到所有的规格
    this.reqSpecsList(true);
  },
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
.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}
.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}
.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>