//14.封装弹框方法
import Vue from "vue"
// 在函数里this没有指向,在组件的this指的是Vue实例,这里没有this,就可以指向vue实例
let vm=new Vue()
//成功弹框
export const successAlert = (msg) => {
    vm.$message({
        message: msg,
        type: "success"
    });
}
//失败弹框
export const errorAlert = (msg) => {
    vm.$message({
        message: msg,
        type: "warning"
    });
}