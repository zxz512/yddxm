<template>
  <div class='container'>
    <van-tabs v-model="activeChannelIndex">
  <van-tab title="推荐">
    <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell v-for="item in list" :key="item" :title="item" />
</van-list>
  </van-tab>
  <van-tab title="标签 2">内容 2</van-tab>
  <van-tab title="标签 3">内容 3</van-tab>

</van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home-index',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      activeChannelIndex: 0
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'></style>
