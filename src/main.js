import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// rem基准值适配
import 'amfe-flexible/index.min.js'

// 导入移动端组件库vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入全局css样式
import '@/assets/css/global.less'

import '@/utils/validata' // 验证相关

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
