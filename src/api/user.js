// 用户相关的请求函数
import request from '@/utils/request.js' // 引入封装的模块
export function apiUserLogin ({ mobile, code }) {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data: {
      mobile,
      code
    }
  })
}
