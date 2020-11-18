//在goods中要请求列表的数据，又要根据请求回来的总数进行分页，所以我们需要导入
import {
  reqgoodsList,
  reqgoodsCount
} from "../../utils/http"
//定义状态
const state = {
  //首先会用到请求回来的数据
  list: [],
  //总数
  total: 0,
  size: 2,
  //当前是第几页，根据elementui中的changePage,来观察
  page: 1,
}
//修改state的中的值
const mutations = {
  //修改list
  changeList(state, arr) {
    state.list = arr;
    console.log(state.list);
  },
  changeTotal(state, num) {
    state.total = num;
  },
  changePage(state, page) {
    state.page = page;
  }
}
//处理逻辑
const actions = {
  reqList(context) {
    //发请求，成功之后，修改list
    reqgoodsList({
      page: context.state.page,
      size: context.state.size
    }).then(res => {
      let list = res.data.list ? res.data.list : []
    //保证请求回来的数据最起码是个数组
    //如果当前页的数据被删完，且当前页不是第一页，那我们就让他去请求上一页的数据数据
      if (list.length == 0 && context.state.page > 1) {
          //修改了page
        context.commit("changePage", context.state.page - 1)
        //重新请求
        context.dispatch("reqList");
        return;
      }
      //赋值列表数据
      context.commit("changeList", list)
    })
  },
  //请总数
  reqCount(context) {
    reqgoodsCount().then(res => {
      context.commit("changeTotal", res.data.list[0].total)
    })
  },
  //修改页码
  changePage(context, page) {
    //修改页码
    //根据elementui中的页码，去重新修改页码
    context.commit("changePage", page)
    //从新请求数据
    context.dispatch("reqList")
  }
}
//导出状态
const getters = {
  list(state) {
    return state.list
  },
  total(state) {
    return state.total
  },
  size(state) {
    return state.size
  },

}
export default {
  state,
  mutations,
  getters,
  actions,
  namespaced: true
}
