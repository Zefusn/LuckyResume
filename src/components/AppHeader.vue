<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo" @click="router.push('/')">
        <n-icon size="28" color="#18a058">
          <DocumentTextOutline />
        </n-icon>
        <span class="logo-text">幸运简历</span>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
          首页
        </router-link>
        <router-link to="/templates" class="nav-item" :class="{ active: route.path.startsWith('/templates') }">
          模板中心
        </router-link>
      </nav>

      <div class="header-actions">
        <template v-if="userStore.isLoggedIn">
          <n-button type="primary" @click="router.push('/editor')">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            创建简历
          </n-button>
          
          <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
            <div class="user-avatar">
              <n-avatar 
                :size="36" 
                :src="userStore.userInfo?.avatar" 
                round
              >
                {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
              </n-avatar>
            </div>
          </n-dropdown>
        </template>
        
        <template v-else>
          <n-button @click="router.push('/login')">登录</n-button>
          <n-button type="primary" @click="router.push('/login')">注册</n-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import { DocumentTextOutline, AddOutline, PersonOutline, SettingsOutline, LogOutOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userMenuOptions = [
  {
    label: '个人中心',
    key: 'user',
    icon: () => h(NIcon, null, { default: () => h(PersonOutline) })
  },
  {
    label: '账号设置',
    key: 'settings',
    icon: () => h(NIcon, null, { default: () => h(SettingsOutline) })
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogOutOutline) })
  }
]

function handleUserMenuSelect(key: string) {
  switch (key) {
    case 'user':
      router.push('/user')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
}

.nav-menu {
  display: flex;
  gap: 32px;
  
  .nav-item {
    color: #666;
    font-size: 15px;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    
    &:hover, &.active {
      color: #18a058;
      border-bottom-color: #18a058;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
