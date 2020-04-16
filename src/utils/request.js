import axios from 'axios'
import JSONBig from 'json-bigint'
import router from '@/router/index.js'
import store from '@/store'

const instance = axios.create({
  //   配置公共地址
  baseURL: 'http://ttapi.research.itcast.cn/', // 设置请求地址常量
  // 配置超大型解析
  transformResponse: [function (data) {
    //   data就是后端响应的字符串 默认的转化是 JSON.parse 处理大数字是有问题的额 需要用JSONBIG替换
    // return data ? JSONBig.parse(data) : {}
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 配置请求拦截器
instance.interceptors.request.use(function (config) {
  // config就是请求的参数
  if (store.state.user.token) {
    //   统一注入token
    // config.headers.Authorization = `Bearer ${store.state.user.token}`
    config.headers.Authorization = 'Bearer ' + store.state.user.token
  }
  return config
}, function (error) {
  // 返回失败
  return Promise.reject(error)
})

// 配置响应拦截器
instance.interceptors.response.use(function (response) {
  // 响应数据  返回得到的响应数据  第一层data是axios默认包data, 第二个data是接口返回里面的包的data
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (error) {
  // 非正常响应处理(包括401)
  // console.dir(error) // 对象： config request response isAxiosError toJSON
  if (error.response.status === 401) {
    // token不ok(token在服务器端已经失效了，2个小时时效)
    // 强制用户重新登录系统，以刷新服务器端的token时效
    router.push('/login')
    // 错误的时候 token容易失效
    //   return Promise.reject(error)
    // 不要给做错误提示了
    return new Promise(function () {}) // 空的Promise对象，没有机会执行catch，进而不做错误提示了
  }
  return Promise.reject(error)
})
export default instance
