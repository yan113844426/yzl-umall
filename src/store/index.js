//创建仓库用来导出最终的东西
import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
//引入仓库中根级别的actions,也就是不属于模块的
import actions from "./actions"
//引入仓库中根级别的state,mutations,getters
import {state,mutations,getters} from "./mutations"
import cate from "./modules/cate"
import specs from "./modules/specs"
import vip from "./modules/vip"
import goods from "./modules/goods"
//导出仓库
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        cate,
        specs,
        vip,
        goods,
    }
})
