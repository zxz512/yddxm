import axios from 'axios'
import JSONBig from 'json-bigint'

// 导入路由，使得可以执行路由跳转
import router from '@/router/index.js'

// 引入vuex(用于判断用户是否登录系统)
import store from '@/store'
// store对象 就是组件内部的 this.$store

// 创建一个新的“axios实例对象” 和原来的axios没有关系
// 给instance 配置公共请求根地址、请求/响应拦截器、401处理、大整型数字转换
// 所有的配置都是给instance对象赋予的
// 为什么不直接对axios进行操作
// 当前的instance是经过各种配置的axios对象
// 如果系统中还需要使用“原生的axios”，此时就直接用就可以
// 如果我们不使用instance，直接对axios做各种配置，那么系统中就
// 没有纯净的axios的，axios被多个组件引入时候，它们在系统中是同一个
// 一个文件给修改，其他文件都会感知到
// instance的出现，可以保证axios是纯净的
const instance = axios.create({
  // 请求根地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 请求完毕的数据【转换器】，超大整型数字多转换处理的
  transformResponse: [function (data) {
    // JSON.parse(字符串)
    // data的返回形式有两种
    // 1. 实体字符串
    // 2. 空字符串(不能转的)
    // JSONbig.parse针对大整型进行处理，其他信息不给处理
    // if (data) {
    //   return JSONBig.parse(data)
    // }
    // return data

    // 升级上述代码
    try {
      // 报错，就说明data是空字符串，parse处理不来，会被catch捕捉处理
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 配置【请求拦截器】
instance.interceptors.request.use(function (config) {
  // 判断token存在再做配置(vuex判断)
  // store.user.token 根据是否有值，就知道用户是否登录系统
  if (store.state.user.token) {
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 配置【响应拦截器】
instance.interceptors.response.use(function (response) {
  // 正常响应处理
  // 有时返回data、有时返回data.data
  try {
    // data.data如果报错，没有获得到，错误信息会被catch步骤，就走data了
    return response.data.data
  } catch (err) {
    return response.data
  }
}, function (error) {
  // 非正常响应处理(包括401)
  // console.dir(error) // 对象： config request response isAxiosError toJSON
  if (error.response.status === 401) {
    // token不ok(token在服务器端已经失效了，2个小时时效)
    // 强制用户重新登录系统，以刷新服务器端的token时效
    router.push('/login')
    // 不要给做错误提示了
    return new Promise(function () {}) // 空的Promise对象，没有机会执行catch，进而不做错误提示了
  }
  // return new Promise((resolve,reject)=>{
  // reject('获得文章失败！')
  // })
  return Promise.reject(error)
})

// es6默认导出动作
export default instance

// 业务组件使用axios
// import request from '@/utils/request.js'
// request({url/data/method})
