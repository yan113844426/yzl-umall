import {reqcateList} from "../../utils/http"
const state = {
  list: [],
}

const mutations = {
  changeList(state, arr) {
    state.list = arr;
  }
}

const actions = {
  //发起请求
  reqList(context) {
    //发请求，成功之后，修改list
    reqcateList({
      istree: true
      //请求所有的，所以需要传个true
    }).then(res => {
        //成功后修改数据
      context.commit("changeList", res.data.list)
    })
  }
}

const getters = {
  list(state) {
    //导出
    return state.list
  }
}

export default {
  state,
  mutations,
  getters,
  actions,
  namespaced: true
}
