//啥时候用到，啥时候引入
//这里是用来实现axios数据交互的，用之前需要下载axios模块，并且设置跨域qs模块是为了post传数据给后端，出错的情况
import axios from "axios"
import qs from "qs"
import {
  errorAlert
} from "./alert"
//导入本地存储
import store from "../store/index"
//用到了路由跳转
import router from "../router"
import Vue from "vue"
//定义一个需要一个用的时候都可以用
Vue.prototype.$imgPre = "http://localhost:3000"

//定义基础路径,开发环境
let baseUrl = "/aa"
//生产环境，打包使用
//let baseUrl = ""
//请求拦截，除了登录的时候，我们都需要携带token，因为刚登陆上去是没有token的，
axios.interceptors.request.use(req => {
  //需要判断除了登陆页面
  if (req.url != baseUrl + "/api/login") {
    //写在token,当时请求回来以后我们把token写在vuex和本地存储中
    req.headers.authorization = store.state.userInfo.token
  }
  //记得return
  return req
})
//1.响应拦截，每次回来的数据都希望打印一下
axios.interceptors.response.use(res => {
  console.log("本次请求的地址是:" + res.config.url)
  console.log(res)
  //相应拦截统一处理失败，组件内只需要处理成功逻辑
  if (res.data.code !== 200) {
    errorAlert(res.data.msg)
  }
  if (res.data.msg === "登录已过期或访问权限受限") { //掉线了
    //首先前端要把session本地存储当中的信息给置空了，因为session和vuex是互通的，所以我们这里可以尝试用vuex
    store.dispatch("changeUser", {})
    //跳转到登录页
    router.push("/login")
  }

  return res
})
//点击添加按钮向数据库发起请求添加
export const reqMenuAdd = (form) => {
  return axios({
    url: baseUrl + "/api/menuadd",
    method: "post",
    // qs.stringify是为了解决传给后端可能没数据
    data: qs.stringify(form)
  })
}
//18.请求列表的数据
export const reqMenuList = () => {
  return axios({
    url: baseUrl + "/api/menulist",
    method: "get",
    params: {
      istree: true
    }
  })
}
//29.删除菜单
export const reqMenuDel = (id) => {
  return axios({
    url: baseUrl + "/api/menudelete",
    method: "post",
    data: qs.stringify({
      id: id
    })
  })
}
// 35.获取一条数据,点击编辑按钮以后,取完以后肯定是json
//最后要赋值给表单上
export const reqMenuDetail = (id) => {
  return axios({
    url: baseUrl + "/api/menuinfo",
    method: "get",
    params: {
      id: id
    }
  })
}
//38.修改
export const reqMenuUpdate = (form) => {
  return axios({
    url: baseUrl + "/api/menuedit",
    method: "post",
    data: qs.stringify(form)
  })
}
//-------------------角色管理--------
//14.角色添加的时候提交数据给后台
export const reqRoleAdd = (user) => {
  return axios({
    url: baseUrl + "/api/roleadd",
    method: "post",
    // qs.stringify是为了解决传给后端可能没数据
    data: qs.stringify(user)
  })
}
//22.获取列表中的数据给表格进行渲染
export const reqRoleList = () => {
  return axios({
    url: baseUrl + "/api/rolelist",
    method: "get"
  })
}
//30.删除
export const reqRoleDel = (id) => {
  return axios({
    url: baseUrl + "/api/roledelete",
    method: "post",
    data: qs.stringify({
      id: id
    })
  })
}
// 33.该编辑按钮
export const reqRoleDetail = id => {
  return axios({
    url: baseUrl + "/api/roleinfo",
    method: "get",
    params: {
      id: id
    }
  })
}

//点编辑按钮的时候，需要请请求回来你要编辑的这条数据
// 38.修改
export const reqRoleUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/roleedit",
    method: "post",
    data: qs.stringify(user)
  })
}
//----------------管理员管理-----
//管理员添加
// 1.添加
export const reqUserAdd = (user) => {
  return axios({
    url: baseUrl + "/api/useradd",
    method: "post",
    data: qs.stringify(user)
  })
}
//2.管理员请求列表数据
//18.列表 p={page:1,size:10}
export const reqUserList = (p) => {
  return axios({
    url: baseUrl + "/api/userlist",
    method: "get",
    params: p
  })
}
//26.删除
export const reqUserDel = (uid) => {
  return axios({
    url: baseUrl + "/api/userdelete",
    method: "post",
    data: qs.stringify({
      uid: uid
    })
  })
}
// 33.详情
export const reqUserDetail = uid => {
  return axios({
    url: baseUrl + "/api/userinfo",
    method: "get",
    params: {
      uid: uid
    }
  })
}
// 38.修改
export const reqUserUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/useredit",
    method: "post",
    data: qs.stringify(user)
  })
}
// 52 总数
export const reqUserCount = () => {
  return axios({
    url: baseUrl + "/api/usercount",
    method: "get",

  })
}
//-----------------登录接口------------
//登录
export const reqLogin = (user) => {
  return axios({
    url: baseUrl + "/api/userlogin",
    method: "post",
    data: qs.stringify(user)
  })
}
//----------------商品分类的接口------
//1.添加文件,设计到文件了，所以我们就不能用qs.stringify了，得用formData
export const reqcateAdd = (catcatee) => {
  //首先cate是个对象cate={name:12,img:File,age:20}
  let d = new FormData();
  for (let i in cate) {
    // d.append("img",file)
    d.append(i, cate[i])
  }
  return axios({
    url: baseUrl + "/api/cateadd",
    method: "post",
    data: d
  })
}
//2.商品分类列表
//p={istree:true}  p={pid:1}
export const reqcateList = (p) => {
  return axios({
    url: baseUrl + "/api/catelist",
    method: "get",
    params: p
  })
}
//3.删除，删除的时候要记得传id进来
export const reqcateDel = (id) => {
  return axios({
    url: baseUrl + "/api/catedelete",
    method: "post",
    data: qs.stringify({
      id: id
    })
  })
}
//4.用来点击编辑的时候，请求某一条数据的时候用到的
export const reqcateDetail = id => {
  return axios({
    url: baseUrl + "/api/cateinfo",
    method: "get",
    params: {
      id: id
    }
  })
}
//5.用来修改的时候
export const reqcateUpdate = (cate) => {
  let d = new FormData()
  for (let i in cate) {
    d.append(i, cate[i])
  }
  return axios({
    url: baseUrl + "/api/cateedit",
    method: "post",
    data: d
  })
}
//----------规格属性-------
export const reqspecsAdd = (user) => {
  return axios({
    url: baseUrl + "/api/specsadd",
    method: "post",
    data: qs.stringify(user)
  })
}
export const reqspecsList = (p) => {
  return axios({
    url: baseUrl + "/api/specslist",
    method: "get",
    params: p
  })
}
export const reqspecsDel = (id) => {
  return axios({
    url: baseUrl + "/api/specsdelete",
    method: "post",
    data: qs.stringify({
      id: id
    })
  })
}
export const reqspecsDetail = id => {
  return axios({
    url: baseUrl + "/api/specsinfo",
    method: "get",
    params: {
      id: id
    }
  })
}



// 38.修改 文件
export const reqspecsUpdate = (user) => {

  return axios({
    url: baseUrl + "/api/specsedit",
    method: "post",
    data: qs.stringify(user)
  })
}

export const reqspecsCount = () => {
  return axios({
    url: baseUrl + "/api/specscount",
    method: "get",
  })
}
//--------------------会员管理接口部分-----
export const reqvipList = () => {
  return axios({
    url: baseUrl + "/api/memberlist",
    method: "get",
  })
}
//会员管理接口的获取一条
export const reqvipDetail = uid => {
  return axios({
    url: baseUrl + "/api/memberinfo",
    method: "get",
    params: {
      uid: uid
    }
  })
}
//会员修改
export const reqvipUpdate = (d) => {

  return axios({
    url: baseUrl + "/api/memberedit",
    method: "post",
    data: d
  })
}
//-----------------商品规格接口
//商品添加
export const reqgoodsAdd = (user) => {
  let d = new FormData()
  for (let i in user) {
    d.append(i, user[i])
  }
  return axios({
    url: baseUrl + "/api/goodsadd",
    method: "post",
    data: d
  })
}

//18.列表 p={page:1,size:10}
//请求列表数据，用于分页和渲染
export const reqgoodsList = (p) => {
  return axios({
    url: baseUrl + "/api/goodslist",
    method: "get",
    params: p
  })
}

//删除某一条数据
export const reqgoodsDel = (id) => {
  return axios({
    url: baseUrl + "/api/goodsdelete",
    method: "post",
    data: qs.stringify({
      id: id
    })
  })
}

//获得其中一条数据去编辑
export const reqgoodsDetail = id => {
  return axios({
    url: baseUrl + "/api/goodsinfo",
    method: "get",
    params: {
      id: id
    }
  })
}
//更新数据
export const reqgoodsUpdate = (user) => {
  let d = new FormData()
  for (let i in user) {
    d.append(i, user[i])
  }
  return axios({
    url: baseUrl + "/api/goodsedit",
    method: "post",
    data: d
  })
}
//统计页码
export const reqgoodsCount = () => {
  return axios({
    url: baseUrl + "/api/goodscount",
    method: "get",
  })
}
//---------------轮播图部分------------
//1.轮播图添加部分，因为需要添加文件，所以需要fordata
export const reqBannerAdd = (banner) => {
  let d = new FormData();
  for (let key in banner) {
    d.append(key, banner[key])
  }
  return axios({
    method: "post",
    url: baseUrl + "/api/banneradd",
    data: d
  })
}
//2.轮播图删除部分
export const reqBannerDel = (id) => {
  return axios({
    method: "post",
    url: baseUrl + "/api/bannerdelete",
    data: qs.stringify({
      id
    })
  })
}
//3.轮播图列表部分
export const reqBannerList = () => { //轮播图列表
  return axios({
    method: "get",
    url: baseUrl + "/api/bannerlist"
  })
}
//4.轮播图获取一条数据
export const reqBannerDetail = (id) => {
  return axios({
    method: "get",
    url: baseUrl + "/api/bannerinfo",
    params: {
      id
    }
  })
}
//5.轮播图更改
export const reqBannerUpdate = (banner) => { //轮播图修改
  let d = new FormData();
  for (let key in banner) {
    d.append(key, banner[key])
  }
  return axios({
    method: "post",
    url: baseUrl + "/api/banneredit",
    data: d
  })
}
//---------------限时秒杀部分--------------
//1.限时秒杀列表
export const reqSecksList = (p) => { 
  return axios({
    method: "get",
    url: baseUrl + "/api/secklist",
    params: p,

  })
}
//2.限时秒杀获取一条数据赋值给秒杀
export const reqSecksDetail = (id) => { 
  return axios({
    method: "get",
    url: baseUrl + "/api/seckinfo",
    params: {
      id
    }
  })
}
//3.删除其中一条数据
export const reqSecksDel = (id) => {
  return axios({
    method: "post",
    url: baseUrl + "/api/seckdelete",
    data: qs.stringify({
      id
    })
  })
}
//4.限时秒杀的修改部分
export const reqSecksUpdate = (secks) => { 
  console.log(secks);
  return axios({
    method: "post",
    url: baseUrl + "/api/seckedit",
    data: qs.stringify(secks)
  })
}
//5.秒杀添加
export const reqSecksAdd = (secks) => { 
  console.log(secks);
  return axios({
    method: "post",
    url: baseUrl + "/api/seckadd",
    data: qs.stringify(secks)
  })
}
