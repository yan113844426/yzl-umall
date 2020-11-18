//用来处理根级别下的逻辑

export default {
    changeUser(context,obj){
        context.commit("changeUserInfo",obj)
    }
}