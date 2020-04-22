import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// rem 基准值适配
import 'amfe-flexible/index.min.js'

// 导入Vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入全局样式控制文件(注意：在vant的样式文件之后做引入)
import '@/assets/css/global.less'

// 对vee-validate校验规则到导入
import '@/utils/validate.js'

// 注册，一次性把全部的应用组件都注册好，插件机制
Vue.use(Vant)

// 创建一个延迟器，
// 给Vue增加继承成员，名称$sleep，也可以自定义为其他
Vue.prototype.$sleep = time => {
  // 返回一个Promise对象，应用端可以设置async/await使得异步变为同步
  // ，同步可以使得后续代码都按照先后顺序执行
  return new Promise((resolve) => {
    // 定时器，规定在多久之后做一点事情，可以设定当前的延迟器等待的时间
    window.setTimeout(() => {
      // 该resolve()没有任何实质数据，应用端也不用接受
      resolve()
    }, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
