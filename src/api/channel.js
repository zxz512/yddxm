// 导入axios模块
import request from '@/utils/request.js'
// 导入localstorage处理
import store from '@/store'

// 频道各种api创建

/**
 * 获取用户频道列表数据
 */
// 本地持久化存储频道设置的key(游客 和 登录用户 分别设置)
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key

export function apiChannelList () {
  return new Promise(async (resolve) => {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
    // 获取本地频道数据
    const localChannels = localStorage.getItem(key)
    if (localChannels) {
      resolve({ channels: JSON.parse(localChannels) })
    } else {
      // 频道没有被缓存
      const result = await request({
        url: '/app/v1_0/user/channels',
        method: 'get'
      })
      localStorage.setItem(key, JSON.stringify(result.channels))
      resolve(result)
    }
  })
}

// export function apiChannelList () {
//   return request({
//     url: '/app/v1_0/user/channels',
//     method: 'get'
//   })
// }
export function apiChannelDel (id) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key

    // 频道不能通过localStorage直接对"某个项目"做删除，必须取出来操作
    // 操作完毕再把数据更新给localStorage
    const localChannels = localStorage.getItem(key) // 获取缓存

    // 缓存有数据
    let channels = JSON.parse(localChannels)
    // 通过id，把被删除的频道中全部的数据里边排除出去
    channels = channels.filter(item => item.id !== id)

    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels))
    resolve() // 成功执行
  })
}
// 添加频道
export function apiChannelAdd (channel) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key
    const localChannels = localStorage.getItem(key) // 获取缓存
    if (localChannels) {
      // 缓存有数据
      const channels = JSON.parse(localChannels)
      channels.push(channel) // 添加
      // 重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels))
      resolve() // 成功执行
    }
  })
}
/**
 * 获取所有频道数据
 */
export function apiChannelAll () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
