<template>
  <header class="nav">
    <div class="nav-inner">
      <div class="logo" @click="router.push('/')">
        <div class="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16v16H4V4z" fill="white" opacity="0.3"/>
            <path d="M7 8h10M7 12h8M7 16h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="logo-text">LuckyResume</span>
      </div>

      <nav class="nav-links">
        <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">首页</router-link>
        <router-link to="/templates" class="nav-link" :class="{ active: route.path.startsWith('/templates') }">模板中心</router-link>
      </nav>

      <div class="nav-actions">
        <template v-if="userStore.isLoggedIn">
          <n-button type="primary" round size="small" class="btn-create" @click="router.push('/editor')">
            创建简历
          </n-button>
          <n-dropdown :options="menuOpts" @select="onMenu">
            <n-avatar :size="30" :src="userStore.userInfo?.avatar" round class="nav-avatar">
              {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
            </n-avatar>
          </n-dropdown>
        </template>
        <template v-else>
          <n-button type="primary" round size="small" class="btn-create" @click="router.push('/login')">创建简历</n-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import { PersonOutline, SettingsOutline, LogOutOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const menuOpts = [
  { label: '个人中心', key: 'user', icon: () => h(NIcon, null, { default: () => h(PersonOutline) }) },
  { label: '账号设置', key: 'settings', icon: () => h(NIcon, null, { default: () => h(SettingsOutline) }) },
  { type: 'divider', key: 'd1' },
  { label: '退出登录', key: 'logout', icon: () => h(NIcon, null, { default: () => h(LogOutOutline) }) }
]

function onMenu(key: string) {
  if (key === 'user') router.push('/user')
  else if (key === 'settings') router.push('/user/settings')
  else if (key === 'logout') { userStore.logout(); router.push('/') }
}
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $header-h;
  background: $bg-nav;
  border-bottom: 0.5px solid $border-subtle;
  z-index: 100;
}

.nav-inner {
  max-width: $max-w;
  margin: 0 auto;
  padding: 0 $pad-section;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  &:hover .logo-mark {
    transform: rotate(-4deg) scale(1.05);
  }
}

.logo-mark {
  width: 30px;
  height: 30px;
  border-radius: $r-sm;
  background: linear-gradient(135deg, $blue 0%, #8B5CF6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: $text-title;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 14px;
  border-radius: $r-nav;
  font-size: 14px;
  font-weight: 400;
  color: $text-muted;
  transition: all 0.2s $ease;

  &:hover {
    color: $text-body;
    background: $gray-50;
  }

  &.active {
    color: $text-title;
    font-weight: 500;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-create {
  background: $blue;
  border-color: $blue;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
  height: 34px;

  &:hover {
    background: $blue-hover;
    border-color: $blue-hover;
    transform: scale(1.02);
  }
}

.nav-avatar {
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .nav-inner {
    padding: 0 16px;
  }
}
</style>
