<template>
  <div class="settings-page">
    <div class="page-header">
      <h2>账号设置</h2>
    </div>
    
    <div class="settings-section">
      <h3>基本信息</h3>
      <n-form :model="userForm" label-placement="left" label-width="80">
        <n-form-item label="头像">
          <div class="avatar-upload" @click="triggerAvatarUpload">
            <n-avatar :size="72" :src="userStore.userInfo?.avatar" round>
              {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
            </n-avatar>
            <div class="avatar-overlay">
              <n-icon size="20" color="#fff"><CameraOutline /></n-icon>
            </div>
          </div>
          <input ref="avatarInputRef" type="file" accept="image/*" style="display:none" @change="handleAvatarChange" />
        </n-form-item>
        <n-form-item label="昵称">
          <n-input v-model:value="userForm.nickname" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="手机号">
          <n-input :value="userStore.userInfo?.phone" disabled />
        </n-form-item>
        <n-form-item label="邮箱">
          <n-input v-model:value="userForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSave">保存修改</n-button>
        </n-form-item>
      </n-form>
    </div>
    
    <n-divider />
    
    <div class="settings-section">
      <h3>隐私设置</h3>
      <n-form label-placement="left" label-width="120">
        <n-form-item label="简历默认可见性">
          <n-select 
            v-model:value="privacySettings.defaultVisibility" 
            :options="visibilityOptions"
          />
        </n-form-item>
        <n-form-item label="允许被搜索">
          <n-switch v-model:value="privacySettings.allowSearch" />
        </n-form-item>
      </n-form>
    </div>
    
    <n-divider />
    
    <div class="settings-section danger-zone">
      <h3>危险操作</h3>
      <n-button type="error" @click="handleLogout">退出登录</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { CameraOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const avatarInputRef = ref<HTMLInputElement | null>(null)

const userForm = ref({
  nickname: '',
  email: ''
})

const privacySettings = ref({
  defaultVisibility: 'private',
  allowSearch: true
})

const visibilityOptions = [
  { label: '公开可见', value: 'public' },
  { label: '仅自己可见', value: 'private' },
  { label: '密码访问', value: 'password' }
]

function triggerAvatarUpload() {
  avatarInputRef.value?.click()
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    message.error('图片大小不能超过5MB')
    return
  }

  try {
    const data = await authApi.uploadAvatar(file)
    if (userStore.user) {
      userStore.user.avatar = data.url
    }
    message.success('头像上传成功')
  } catch (error) {
    message.error('头像上传失败')
  }

  input.value = ''
}

async function handleSave() {
  try {
    await userStore.updateProfile({
      nickname: userForm.value.nickname,
      email: userForm.value.email
    })
    message.success('保存成功')
  } catch (error) {
    message.error('保存失败')
  }
}

function handleLogout() {
  userStore.logout()
  router.push('/')
  message.success('已退出登录')
}

onMounted(() => {
  if (userStore.userInfo) {
    userForm.value.nickname = userStore.userInfo.nickname
    userForm.value.email = userStore.userInfo.email || ''
  }
})
</script>

<style lang="scss" scoped>
.settings-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-header {
  margin-bottom: 24px;
  
  h2 {
    font-size: 20px;
  }
}

.settings-section {
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    margin-bottom: 16px;
  }
}

.avatar-upload {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;

  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.danger-zone {
  padding: 20px;
  background: #fff2f0;
  border-radius: 8px;
  border: 1px solid #ffccc7;
}
</style>
