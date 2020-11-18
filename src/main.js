// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//用来配置路由
import router from './router'

Vue.config.productionTip = false
//1.引入重置样式
import "./assets/css/reset.css"
//2.引入全局组件,因为叫了index.js就可以省略了
import "./components"
//3.引入过滤器
import "./filters"
//4.pages
//5/数据交互 utils/https
//6.仓库引入后记得注册
import store from "./store"
//7.这里该可能会用到的UI框架,用之前先去下载
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
