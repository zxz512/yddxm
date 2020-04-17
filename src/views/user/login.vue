<template>
  <div class="user-login">
    <van-nav-bar title="登录"></van-nav-bar>
    <ValidationObserver ref="loginFormRef">
    <van-cell-group>
      <ValidationProvider v-slot="{errors}" rules="required|phone" name="手机号码">
      <van-field
        v-model="loginForm.mobile"
        type="text"
        placeholder="请输入手机号码"
        label="手机号"
        required
        clearable
         :error-message="errors[0]"
      />
        </ValidationProvider>
      <ValidationProvider v-slot="{errors}" rules="required" name="密码">
      <van-field
        v-model="loginForm.code"
        type="password"
        placeholder="请输入验证码"
        label="验证码"
        required
        clearable
         :error-message="errors[0]"
      >

        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
        </ValidationProvider>
    </van-cell-group>
    </ValidationObserver>
    <div class="login-btn">
      <van-button type="info" size="small" round block @click="login()" :loading="isLogin"
            loading-text="登录中...">登录</van-button>
    </div>
  </div>
</template>

<script>
// 导入校验
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { apiUserLogin } from '@/api/user.js'
export default {
  name: 'user-login',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      loginForm: {
        mobile: '13582596640',
        code: '246810'
      },
      isLogin: false // 登录等待
    }
  },
  methods: {
    // 登录系统

    async login () {
      const valid = await this.$refs.loginFormRef.validate()
      if (!valid) {
        return false // 校验失败停止后续代码执行
      }
      this.isLogin = true // 关闭等待效果
      try {
        const result = await apiUserLogin(this.loginForm)
        this.$toast.success('登陆成功')
        this.$router.push('/')
        // console.log(result)
      } catch (err) {
        this.$toast.fail('手机或者验证码错误' + err)
      }
      this.isLogin = false // 关闭等待效果
    }
  }
}
</script>

<style scoped lang='less'>
.login-btn{margin:40px;}
</style>
