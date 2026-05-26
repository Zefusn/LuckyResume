<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <div class="brand-info">
          <div class="logo">
            <n-icon size="40" color="#18a058">
              <DocumentTextOutline />
            </n-icon>
            <span>幸运简历</span>
          </div>
          <h1>智能简历制作平台</h1>
          <p>海量模板 · AI优化 · 一键导出</p>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-form">
          <h2>欢迎登录</h2>
          <p class="login-desc">登录后享受完整功能，云端保存简历数据</p>
          
          <n-tabs v-model:value="loginType" animated>
            <n-tab-pane name="phone" tab="手机号登录">
              <n-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules">
                <n-form-item path="phone">
                  <n-input 
                    v-model:value="phoneForm.phone" 
                    placeholder="请输入手机号"
                    size="large"
                  >
                    <template #prefix>
                      <n-icon><CallOutline /></n-icon>
                    </template>
                  </n-input>
                </n-form-item>
                
                <n-form-item path="code">
                  <div class="code-input">
                    <n-input 
                      v-model:value="phoneForm.code" 
                      placeholder="请输入验证码"
                      size="large"
                    >
                      <template #prefix>
                        <n-icon><ShieldCheckmarkOutline /></n-icon>
                      </template>
                    </n-input>
                    <n-button 
                      size="large" 
                      :disabled="countdown > 0"
                      @click="handleSendCode"
                    >
                      {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
                    </n-button>
                  </div>
                </n-form-item>
                
                <n-form-item>
                  <n-button 
                    type="primary" 
                    size="large" 
                    block 
                    :loading="loading"
                    @click="handlePhoneLogin"
                  >
                    登录 / 注册
                  </n-button>
                </n-form-item>
              </n-form>
            </n-tab-pane>
            
            <n-tab-pane name="wechat" tab="微信登录">
              <div class="wechat-login">
                <div class="qrcode-box">
                  <n-icon size="120" color="#ccc">
                    <QrCodeOutline />
                  </n-icon>
                  <p>请使用微信扫描二维码登录</p>
                </div>
              </div>
            </n-tab-pane>
            
            <n-tab-pane name="qq" tab="QQ登录">
              <div class="qq-login">
                <n-button size="large" block @click="handleQQLogin">
                  <template #icon>
                    <n-icon><LogoGithub /></n-icon>
                  </template>
                  QQ一键登录
                </n-button>
              </div>
            </n-tab-pane>
          </n-tabs>
          
          <div class="login-footer">
            <n-button block @click="handleTestLogin" style="margin-bottom: 12px;">
              测试登录（开发模式）
            </n-button>
            <p>
              登录即同意
              <a href="#">《用户协议》</a>
              和
              <a href="#">《隐私政策》</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { 
  DocumentTextOutline, 
  CallOutline, 
  ShieldCheckmarkOutline,
  QrCodeOutline,
  LogoGithub
} from '@vicons/ionicons5'
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

const phoneForm = ref({
  phone: '',
  code: ''
})

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
      if (countdown.value <= 0) {
        clearInterval(countdownTimer!)
      }
    }, 1000)
  } catch (error) {
    message.error('发送验证码失败')
  }
}

async function handlePhoneLogin() {
  try {
    await phoneFormRef.value?.validate()
    loading.value = true
    
    const data = await authApi.loginByPhone({
      phone: phoneForm.value.phone,
      code: phoneForm.value.code
    })
    
    userStore.setToken(data.token)
    userStore.setUser(data.user)
    
    message.success('登录成功')
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error) {
    message.error('登录失败，请检查手机号和验证码')
  } finally {
    loading.value = false
  }
}

function handleQQLogin() {
  message.info('QQ登录功能开发中')
}

async function handleTestLogin() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3001/api/auth/login/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()

    if (data.code === 200) {
      userStore.setToken(data.data.token)
      userStore.setUser(data.data.user)
      message.success('测试登录成功')
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } else {
      message.error(data.message || '登录失败')
    }
  } catch (error) {
    message.error('登录失败，请确保后端服务已启动')
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #18a058 0%, #0c7a43 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-info {
  color: #fff;
  
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    opacity: 0.9;
  }
}

.login-right {
  flex: 1;
  padding: 60px 40px;
}

.login-form {
  h2 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .login-desc {
    color: #999;
    margin-bottom: 32px;
  }
}

.code-input {
  display: flex;
  gap: 12px;
  width: 100%;
  
  .n-input {
    flex: 1;
  }
}

.wechat-login {
  text-align: center;
  padding: 40px 0;
  
  .qrcode-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    
    p {
      color: #999;
    }
  }
}

.qq-login {
  padding: 40px 0;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  
  p {
    color: #999;
    font-size: 12px;
    
    a {
      color: #18a058;
    }
  }
}
</style>
