import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// auth 认证  操作的是用户信息(token 令牌 认证信息)
// 之前用户信息存储位置是：sessionStorage ，特点是  关闭浏览器登录信息就失效了
// 为了使得token等信息永久有效，建议使用 localStorage

// 导出三个操作
const USER_KEY = 'hm-toutiao-m-user-92'
export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
  },
  mutations: {
    // 修改vuex数据
    updateUser (state, data) {
      state.user = data
      window.localStorage.setItem(USER_KEY, JSON.stringify(data))
    },

    // 清除数据
    ClearUser: function (state, data) {
      state.user = {}
      window.localStorage.removeItem(USER_KEY)
    }
  },
  actions: {
  },
  modules: {
  }
})
