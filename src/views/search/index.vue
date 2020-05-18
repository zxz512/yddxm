<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()"/>
    <!--
      van-search搜索的组件标签
        v-model：获得、设置 表单域搜索的关键内容
        形式上：输入框+放大镜图标
    -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词" @search="onSearch(searchText)"/>
    <!--
      van-cell搜索的组件标签
        title：单元格标题内容
        icon：单元格项目前边的图标
    -->
    <van-cell-group v-if="suggestionList.length>0">
      <van-cell :title='item' icon="search"
      v-for="(item,k) in suggestionList"
      :key="k"
      @click="onSearch(item)">
      <div slot="title" v-html="gaoliang(item,searchText)"></div>
      </van-cell>
      <!-- <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/> -->
    </van-cell-group>
    <van-cell-group v-else>
  <!-- 联想历史记录管理 -->
  <van-cell title="历史记录">
    <!-- 删除图标
      slot="right-icon" 命名插槽 给 cell单元格的右边显示内容(垃圾桶图标)
      name="delete" 垃圾桶图标
      style="line-height:inherit" 设置内容高度与父级一致
      -->
    <van-icon
              @click="isDeleteData=true"
              v-show="!isDeleteData"
              slot="right-icon"
              name="delete"
              style="line-height:inherit"
              ></van-icon>
    <div v-show="isDeleteData">
      <span style="margin-right:10px" @click="delAllSugguest()">全部删除</span>
      <span @click="isDeleteData=false">完成</span>
    </div>
  </van-cell>
  <!-- 历史联想项目数据展示 -->
  <!-- <van-cell :title="item" v-for="(item,k) in sugguestHistories :key='k'> -->
    <van-cell :title="item" v-for="(item,k) in sugguestHistories" :key="k">
    <!-- 删除按钮 -->
    <van-icon v-show="isDeleteData" slot="right-icon" name="close" style="line-height:inherit" @click="delSugguest(k)"></van-icon>
  </van-cell>
</van-cell-group>
  </div>
</template>

<script>
import { apiSuggestionList } from '@/api/search.js'
const SH = 'sugguest-histories'
export default {
  name: 'search-index',
  watch: {
    searchText: async function (newV) {
      // this.getSuggestionList()
      if (!newV) {
        this.suggestionList = []
        return false
      }
      // 加上定时器来进行防抖操作
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        const result = await apiSuggestionList({ q: newV })
        // console.log(result)
        this.suggestionList = result.options
      }, 1000)
    }
  },
  // methods: {
  //   async getSuggestionList () {
  //     const result = await apiSuggestionList({ q: this.searchText })
  //     // console.log(result)
  //     this.suggestionList = result.options
  //   }
  // },
  data () {
    return {
      sugguestHistories: JSON.parse(localStorage.getItem(SH)) || [],
      searchText: '', // 搜索关键字,
      suggestionList: [],
      isDeleteData: false // 历史记录开关
    }
  },
  methods: {
    delAllSugguest () {
      this.sugguestHistories = []
      localStorage.removeItem(SH)
    },
    delSugguest (index) {
      this.sugguestHistories.splice(index, 1)
      localStorage.setItem(SH, JSON.stringify(this.sugguestHistories))
    },
    onSearch (keywords) {
      if (!keywords) {
        return false
      }
      const data = new Set(this.sugguestHistories)
      data.add(keywords)
      this.sugguestHistories = Array.from(data)
      localStorage.setItem(SH, JSON.stringify(this.sugguestHistories))
      this.$router.push({ name: 'result', params: { q: keywords } })
    },
    gaoliang (item, keywords) {
      const reg = new RegExp(`${keywords}`, 'i') // 正则，忽略大小写
      const rst = item.match(reg)
      return item.replace(reg, `<span style="color:red">${rst[0]}</span>`)
    }
  }
}
</script>

<style scoped lang='less'></style>
