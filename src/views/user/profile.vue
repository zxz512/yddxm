<template>
  <div class="page-user-profile">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
       @click-right="saveProfile()"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <!--
        slot="default" 自定义单元格右侧内容
        fit="cover"  图片填充模式 保持宽高缩放图片，使图片的短边能完全显示出来，裁剪长边
        -->
        <van-image
          slot="default"
          width="56"
          height="56"
          fit="cover"
          round
          :src="userProfile.photo"
          @click="showPhoto=true"
        />
      </van-cell>
      <!-- value=xxx 设置单元格右侧内容部分 -->
      <van-cell is-link title="名称" :value="userProfile.name" @click="showName=true"/>
      <van-cell is-link title="性别" :value="userProfile.gender===0?'男':'女'" @click="showSex=true"/>
      <van-cell is-link title="生日" :value="userProfile.birthday" @click="showDateDeal()"/>
    </van-cell-group>
    <!-- 弹头像 -->
<van-popup v-model="showPhoto" position="bottom" >
  <!-- 内容 -->
  <!-- 1 本地相册选择图片 -->
  <!-- 2 拍照 -->
  <van-cell is-link title="本地相册选择图片" @click="readyUpload"></van-cell>
  <van-cell is-link title="拍照"></van-cell>
</van-popup>
<!-- 弹昵称 -->
<van-popup v-model="showName" position="bottom">
  <!-- 编辑用户昵称  双向绑定用户的昵称-->
  <van-field v-model.trim="userProfile.name" type="textarea" rows="3"></van-field>
</van-popup>
<van-action-sheet
                  v-model="showSex"
                  @select="onSelect"
                  :actions="actions"
                  cancel-text="取消">
</van-action-sheet>
<!-- 弹生日 -->
<van-popup v-model="showBirthday" position="bottom">
  <!-- 时间选择器
    v-model：默认显示时间
    type 时间类型
    :min-date="minDate" 允许选取的最小时间
    @cancel 取消回调
    @confirm 确认选取时间回调
    -->
  <van-datetime-picker
                       v-model="nowDate"
                       type="date"
                       :min-date="minDate"
                       @cancel="showBirthday=false"
                       @confirm="confirmDate"
                       ></van-datetime-picker>
</van-popup>
<input ref="mypic" @change="startUpload()" type="file" style="display:none">
  </div>
</template>

<script>
import { apiProfile, apiSaveProfile, apiUserPhoto } from '@/api/user.js'
export default {
  name: 'profile',
  data () {
    return {
      nowDate: new Date(), // 当前时间
      minDate: new Date('1900-01-01'), // 允许选取的最小时间
      showBirthday: false,
      actions: [{ name: '男' }, { name: '女' }],
      showSex: false, // 是否显示选择头像弹层
      showPhoto: false,
      showName: false,
      userProfile: {
        photo: '',
        name: '我是华仔',
        gender: 0, // 0 男 1 女
        birthday: '1993-09-01'
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    async startUpload () {
      const fd = new FormData()
      fd.append('photo', this.$refs.mypic.files[0]) // 往FormData对象中添加参数
      const result = await apiUserPhoto(fd)
      // 应该 把地址 同步设置给 当前页面的数据
      this.userProfile.photo = result.photo // 将上传成功的头像设置给当前头像
      this.showPhoto = false // 关闭弹层
    },
    readyUpload () {
      this.$refs.mypic.click()
    },
    // 展示生日弹框的处理
    showDateDeal () {
      this.showBirthday = true
      // 日期组件要求时间格式为字符串，所以对目标生日时间转化处理
      this.nowDate = new Date(this.userProfile.birthday)
    },
    // 确认生日
    confirmDate (val) {
      // 转化时间
      this.userProfile.birthday = dayjs(val).format('YYYY-MM-DD')
      // 关闭
      this.showBirthday = false
    },

    // 性别被选中回调处理
    onSelect (val) {
      // console.log(val) // {name:'男'}
      this.userProfile.gender = val.name === '男' ? 0 : 1
      this.showSex = false
    },
    async getUserProfile () {
      this.userProfile = await apiProfile()
    },
    async saveProfile () {
      await apiSaveProfile(this.userProfile)
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
