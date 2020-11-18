import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
import store from "../store"

// 第七步将路由导出去，因为我们的页面用到了这里面的地址
//每一个路径都应该有自己的判断，我要看store里面的请求回来的数据有没有包含/自己 没有去首页
function checkedEnter(path,next){
  if(store.state.userInfo.menus_url.includes(path)){
    next()
  }else{
    next("/")
  }
}
export let routes=[
  {
    path:"menu",
    component:()=>import("../pages/menu/menu"),
    name:"菜单管理",
    beforeEnter(to,from,next){
      checkedEnter("/menu",next)
    }
  },
  {
    path:"role",
    component:()=>import("../pages/role/role"),
    name:"角色管理",
    beforeEnter(to,from,next){
      checkedEnter("/role",next)
    }
  },
  {
    path:"manage",
    component:()=>import("../pages/manage/manage"),
    name:"管理员管理",
    beforeEnter(to,from,next){
      checkedEnter("/manage",next)
    }
  },
  {
    path:"cate",
    component:()=>import("../pages/cate/cate"),
    name:"商品分类",
    beforeEnter(to,from,next){
      checkedEnter("/cate",next)
    }
  },
  {
    path:"specs",
    component:()=>import("../pages/specs/specs"),
    name:"商品规格",
    beforeEnter(to,from,next){
      checkedEnter("/specs",next)
    }
  },{
    path:"goods",
    component:()=>import("../pages/goods/goods"),
    name:"商品管理",
    beforeEnter(to,from,next){
      checkedEnter("/goods",next)
    }
  },
  {
    path:"vip",
    component:()=>import("../pages/vip/vip"),
    name:"会员管理",
    beforeEnter(to,from,next){
      checkedEnter("/vip",next)
    }
  },
  {
    path:"banner",
    component:()=>import("../pages/banner/banner"),
    name:"轮播图管理",
    beforeEnter(to,from,next){
      checkedEnter("/banner",next)
    }
  },
  {
    path:"seckill",
    component:()=>import("../pages/seckill/seckill"),
    name:"秒杀活动",
    beforeEnter(to,from,next){
      checkedEnter("/seckill",next)
    }
  },
]


let router = new Router({
  routes: [
    // 除了首页这些原本展示的，其他都需要
    {
      path:"/login",
      component:()=>import("../pages/login/login")
    },
    {
      path:"/",
      component:()=>import("../pages/index/index"),
      children:[
        {
          path:"",
          component:()=>import("../pages/home/home")
        },
        //第八步拼接导出去的二级路由，因为原本是在这里的，用这个把他们展开
        ...routes
      ]
    },
  ]
})
  //登录拦截
router.beforeEach((to,from,next)=>{
  //前往"/login",next
  if(to.path=="/login"){
    next()
    return;
  }
  //前往的不是登录，查看是否登录
  if(store.state.userInfo.token){
    next()
    return;
  }
  next("/login")
})
export default router;