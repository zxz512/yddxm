<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>

    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="article.aut_photo"
        />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | formatTime}}</p>
        </div>
        <van-button round size="small" @click="followMe()"
            :loading="followLoading" :type="article.is_followed?'default':'info'">{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content">
    <p v-html="article.content"></p>
  </div>
      <div class="zan">
        <van-button
                    round
                    size="small"
                    :class="{active:article.attitude===1}"
                    plain
                    icon="like-o"
                    style="margin-right:8px;">点赞</van-button>
        <van-button round size="small" plain icon="delete" :class="{active:article.attitude===0}">不喜欢</van-button>
      </div>
      <com-comment></com-comment>
    </div>
  </div>
</template>
<script>
import { apiArticleDetail } from '@/api/article.js'
import { apiFollow, apiUnFollow } from '@/api/user.js'
import ComComment from './components/com-comment'
export default {
  name: 'article-index',
  components: { ComComment },
  data () {
    return {
      followLoading: false, // 关注活动加载标志
      article: {}
    }
  },
  computed: {
    aid: function () {
      return this.$route.params.aid
    }
  },
  created () {
    this.getArticleDetail()
  },
  methods: {
    async getArticleDetail () {
      const result = await apiArticleDetail(this.aid)
      console.log(result)
      this.article = result
    },
    // 关注作者、取消关注作者
    async followMe () {
      this.followLoading = true

      await this.$sleep(800) // 暂停一会

      if (this.article.is_followed) {
        // 取消关注
        try {
          await apiUnFollow(this.article.aut_id)
        } catch (err) {
          console.dir(err)
        }
        this.article.is_followed = false // 同步更新状态
      } else {
        // 关注
        await apiFollow(this.article.aut_id)
        this.article.is_followed = true // 同步更新状态
      }
      this.followLoading = false
    }
  }

}

</script>
<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  margin-top:92px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 20px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p{
      font-size:28px;
    }
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
