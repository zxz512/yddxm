<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{ height: '95%' }"
    close-icon-position="top-left"
  >
  <!--
    弹出层组件van-popup
    v-model="布尔变量"  设置弹出层是否显示
    现在 通过 :value 和 @input 把v-model给体现出来的，因为具体的控制开关
    @input="$emit('input',$event)" 当前popup允许这样操作，直接传递$event就可以了
    @input="$emit('input')" 当前popup允许这样操作，直接传递$event就可以了
    我们自己设计底层代码，那么 要这样设置 @input="$emit('input',$event.target.value)"

    是要放到父组件的v-model里边的
    现在这个弹出层是否显示的控制模式 与 之前的弹出框的操作完全一致

    closeable 有关闭图标
    round  圆角
    position="bottom" 弹出层是从底部弹出
    :style="{ height: '20%' }"  弹出层高度
    close-icon-position="top-left" 关闭按钮要在左上脚显示
  -->
   <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini" round @click="isEdit=!isEdit"> {{isEdit?'完成':'编辑'}}</van-button>
        </div>
      </div>
      <!--van-grid 没有设置column-num属性，默认是4列-->
      <van-grid class="channel-content" :gutter="10" clickable>
        <!-- grid-item宫格单元
            宫格内容表现：
            1. text属性,设置简单内容
            2. 匿名插槽，设置复杂内容
        -->
        <van-grid-item v-for="(item,k) in channelList" :key="item.id" @click="clkChannel(item.id,k)">
          <span class="text"
            :style="{color:k===activeChannelIndex?'red':''}">
            {{item.name}}
          </span>
          <van-icon  class="close-icon" name="close" v-show="isEdit && k>0"  @click="userToRest(item.id,k)"/>
          <!-- <van-icon class="close-icon" name="close" /> -->
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
// 获得所有频道的api函数
import { apiChannelAll, apiChannelAdd, apiChannelDel } from '@/api/channel.js'

export default {
  name: 'com-channel',
  props: {
    // 接收父组件v-model的数据信息
    value: {
      type: Boolean,
      default: false
    },
    // 父传递过来的"我的频道"数据
    channelList: {
      type: Array,
      // 数组的默认值要通过如下箭头函数方式设置
      default: () => []
    },
    // 当前激活频道的下标
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 把"剩余频道"给制作出来(全部频道 减去 我的频道)
    restChannel () {
      // 把“我的频道”的全部id获得到，以数组格式返回
      // 如下map方法对 channelList 做遍历，返回一个新数组，
      // 元素就是channelList数组各个元素的id值，数组长度 与 channelList 一致
      // [10,15,23,107,56……]
      const userChannelIds = this.channelList.map(item => {
        return item.id
      })
      // 遍历全部频道，返回不在“我的频道”出现的频道
      // filter：对 channelAll 做过滤，把id值不在 userChannelIds 数组中出现的元素通过
      // 新数组给返回出来
      // [{id:33,name:xx},{id:34,name:xx},{id:45,name:xx}…………]
      const rest = this.channelAll.filter(item => {
        // Array.includes判断是否包含该元素
        return !userChannelIds.includes(item.id)
      })
      // 返回过滤好的 剩余的频道
      return rest
    }
  },
  data () {
    return {
      isEdit: false, // 是否进入编辑状态
      // 全部频道
      channelAll: []
    }
  },
  created () {
    this.getChannelAll()
  },
  methods: {
    // 我的频道 单击后要激活显示该频道
    clkChannel (channelID, index) {
      // 1. 频道弹出层消失
      this.$emit('input', false)
      // 2. home/index.vue页面要"激活"当前单击到的频道并展示
      // 修改 activeChannelIndex的值为 index 即可(就是子组件修改父组件传递的变量)
      this.$emit('update:activeChannelIndex', index)
      if (this.isEdit && index > 0) {
        this.userToRest(channelID, index)
        return false
      }
    },
    userToRest (channelID, index) {
      // 1. 页面级删除channelList 父组件给传递过来的，本身是一个对象，那么它们的传值模式是“引用”
      //    方式(父、子组件关于channelList共同操作，一方修改，另一方也可以感知到)
      this.channelList.splice(index, 1)

      // 2. localStorage删除
      apiChannelDel(channelID)
      // 判断是删除最后一个项目，算法：项目删除后的长度 ====  删除下标
      if (this.channelList.length === index) {
        this.$emit('update:activeChannelIndex', index - 1)
      }
    },
    // 获得全部频道
    async getChannelAll () {
      // 调用api
      const result = await apiChannelAll()
      // data接收
      this.channelAll = result.channels
    },
    restToUser (channel) {
      this.channelList.push(channel)
      apiChannelAdd(channel)
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  margin-top:70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color:gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
