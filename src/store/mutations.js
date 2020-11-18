//用来处理根级别下的数据
// 用户信息不属于任何模块
export const state={
  //再刷新的时候给userInfo也赋个值
  //和本地存储同步，刷新的时候看本地存储有值没有，
  //本地存储有值的话，就给他一份，因为vux一刷新就没了
  userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export const mutations={
  changeUserInfo(state,obj){
      //顺便给本地存储存一份，同步了   // vuex和本地存储同步
        state.userInfo=obj
        if(obj.token){
            sessionStorage.setItem("userInfo",JSON.stringify(obj))
        }else{
            sessionStorage.removeItem("userInfo")
        }

  }
}
export const getters={
   //导出
   userInfo(state){
       return state.userInfo
   } 
} 