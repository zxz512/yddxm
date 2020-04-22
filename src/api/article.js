// 导入axios模块
import request from '@/utils/request.js'

// 文章各种api创建

/**
 * 根据频道获得相关的文章列表信息
 * channel_id 频道ID
 * timestamp 时间戳整数 单位毫秒 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
 *           分页标志
 *           timestamp：当前时间戳  获得第1页数据(在返回的数据里边有pre_timestamp字段)
 *           timestamp=pre_timestamp  获得第2页数据(在返回的数据里边有pre_timestamp字段)
 *           timestamp=pre_timestamp  获得第3页数据(在返回的数据里边有pre_timestamp字段)
 *           ……
 *           timestamp要赋予上次返回数据里边的pre_timestamp字段内容，就代表获得下一页数据
 * with_top=1  0或1 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
 * 参数下边有红色波浪线，不用理会，eslint推荐变量名称使用小驼峰风格
 */
export function apiArticleList ({ channel_id, timestamp }) {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params: {
      channel_id,
      timestamp,
      with_top: 1
    }
  })
}
