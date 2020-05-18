<template>
  <div class="comment">
    <!--van-list：实现瀑布加载效果-->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="item in commentlist" :key="item.com_id.toString()">
        <!-- 作者头像 -->
        <div slot="icon">
          <img class="avatar"
               :src="item.aut_photo" alt="">
        </div>
        <!-- 作者名称 -->
        <div slot="title">
          <span>只是为了好玩儿</span>
        </div>
        <!-- 点赞 -->
        <div slot="default">
          <van-button icon="like-o" size="mini" plain :type="item.is_likeing?'danger':'default'">
               &nbsp;{{item.like_count}}</van-button>
        </div>
        <!-- 评论内容和时间 -->
        <div slot="label">
          <p>{{item.content}}</p>
             <p>
               <span>{{item.pubdate | formatTime}}</span>
               ·
               <span @click="openReply(item.com_id.toString())">{{item.reply_count}}&nbsp;回复</span>
             </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表展示-弹出层/瀑布 -->
<van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }" round>
  <!-- 瀑布加载效果 -->
  <van-list
            v-model="reply.loading"
            :finished="reply.finished"
            finished-text="没有更多了"
            @load="onLoadReply"
            >
    <van-cell v-for="item in replyList" :key="item.com_id.toString()" >
      <!-- 作者头像 -->
      <div slot="icon">
        <img class="avatar"
             :src="item.aut_photo" alt>
      </div>
      <!-- 作者名称 -->
      <div slot="title">
        <span>{{item.aut_name}}</span>
      </div>
      <!-- 评论内容和时间 -->
      <div slot="label">
        <p v-html="item.content"></p>
        <p>
          <span>{{item.pubdate | formatTime}}</span>
        </p>
      </div>
    </van-cell>
  </van-list>
</van-popup>
  </div>
</template>

<script>
import { apiComment } from '@/api/comment.js'
import { apiReplyList } from '@/api/reply.js'
export default {
  name: 'ComComment',
  data () {
    return {
      // 回复相关
      nowComID: '', // 被单击激活的评论
      lastID: null, // 分页标志(null、前一次返回的last_id)
      replyList: [], // 回复列表
      showReply: false, // 回复弹出层是否展示
      // 回复瀑布相关
      reply: {
        list: [],
        loading: false,
        finished: false
      },
      commentlist: [],
      loading: false,
      finished: false,
      commentID: null
    }
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
    openReply (commentID) {
      this.nowComID = commentID
      this.showReply = true
    },
    async onLoadReply () {
      // 暂停0.8秒
      await this.$sleep(800)

      // 获取指定评论对应的回复信息
      const result = await apiReplyList({
        commentID: this.nowComID,
        lastID: this.lastID
      })

      // 加载动画消失
      this.reply.loading = false

      // 数据加载完成
      if (result.results.length === 0) {
        this.reply.finished = true
        return false
      }
      this.replyList.push(...result.results)
      // 接收分页标志的last_id信息
      this.lastID = result.last_id
    },
    async onLoad () {
      await this.$sleep(1000)
      const result = await apiComment({
        articleID: this.aid,
        commentID: this.commentID

      })
      //   this.loading = false
      // 加载动画消失
      this.loading = false

      // 数据加载完成
      if (result.results.length === 0) {
        this.finished = true // 瀑布停止
        return false
      }

      // 把数据追加给data
      this.commentlist.push(...result.results)
      // 接收commentID
      this.commentID = result.last_id
    }
  }
}
</script>

<style lang="less" scoped>
.comment{
  margin-top:15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }
  /deep/ .van-cell__title{
    .van-cell__label{
      width:400px;
    }
  }
}
</style>
