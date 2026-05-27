<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <div class="brand-mark">LuckyResume</div>
        <p>智能简历制作平台</p>
      </div>

      <n-tabs v-model:value="loginType" animated class="login-tabs">
        <n-tab-pane name="phone" tab="手机号登录">
          <n-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules">
            <n-form-item path="phone">
              <n-input v-model:value="phoneForm.phone" placeholder="请输入手机号" size="large" />
            </n-form-item>
            <n-form-item path="code">
              <div class="code-row">
                <n-input v-model:value="phoneForm.code" placeholder="请输入验证码" size="large" />
                <n-button size="large" :disabled="countdown > 0" @click="handleSendCode">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </n-button>
              </div>
            </n-form-item>
            <n-form-item>
              <n-button type="primary" size="large" block round :loading="loading" @click="handlePhoneLogin">
                登录 / 注册
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="test" tab="测试登录">
          <div class="test-login">
            <p>开发模式快速登录，无需验证码</p>
            <n-button type="primary" size="large" block round :loading="loading" @click="handleTestLogin">
              一键测试登录
            </n-button>
          </div>
        </n-tab-pane>
      </n-tabs>

      <div class="login-footer">
        <p>登录即同意《用户协议》和《隐私政策》</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const userStore = useUserStore()

const loginType = ref('phone')
const loading = ref(false)
const countdown = ref(0)
const phoneFormRef = ref<FormInst | null>(null)

const phoneForm = ref({ phone: '', code: '' })

const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

let countdownTimer: number | null = null

async function handleSendCode() {
  try {
    await authApi.sendSmsCode(phoneForm.value.phone)
    message.success('验证码已发送')
    countdown.value = 60
    countdownTimer = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(countdownTimer!)
    }, 1000)
  } catch (e) { message.error('发送失败') }
}

async function handlePhoneLogin() {
  try {
    await phoneFormRef.value?.validate()
    loading.value = true
    const data = await authApi.loginByPhone({ phone: phoneForm.value.phone, code: phoneForm.value.code })
    userStore.setToken(data.token)
    userStore.setUser(data.user)
    message.success('登录成功')
    router.push((route.query.redirect as string) || '/')
  } catch (e) { message.error('登录失败') }
  finally { loading.value = false }
}

async function handleTestLogin() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3001/api/auth/login/test', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    if (data.code === 200) {
      userStore.setToken(data.data.token)
      userStore.setUser(data.data.user)
      message.success('登录成功')
      router.push((route.query.redirect as string) || '/')
    } else { message.error(data.message || '登录失败') }
  } catch (e) { message.error('登录失败，请确保后端已启动') }
  finally { loading.value = false }
}

onUnmounted(() => { if (countdownTimer) clearInterval(countdownTimer) })
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-page;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: $white;
  border-radius: $r-card;
  padding: 40px 32px;
  box-shadow: $shadow-card;
}

.login-brand {
  text-align: center;
  margin-bottom: 32px;

  .brand-mark {
    font-size: 22px;
    font-weight: 600;
    color: $text-title;
    margin-bottom: 6px;
  }

  p {
    font-size: 14px;
    color: $text-muted;
  }
}

.login-tabs {
  :deep(.n-tabs-tab) {
    font-size: 14px;
    font-weight: 500;
  }
}

.code-row {
  display: flex;
  gap: 10px;
  width: 100%;

  .n-input { flex: 1; }
}

.test-login {
  padding: 24px 0;

  p {
    font-size: 13px;
    color: $text-muted;
    margin-bottom: 16px;
    text-align: center;
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;

  p {
    font-size: 12px;
    color: $text-ghost;

    a { color: $blue; }
  }
}

@media (max-width: 768px) {
  .login-card {
    padding: 32px 24px;
  }
}
</style>
