<template>
  <div class="user-page">
    <div class="container">
      <div class="user-layout">
        <aside class="sidebar">
          <div class="user-card">
            <n-avatar :size="56" :src="userStore.userInfo?.avatar" round class="user-avatar">
              {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
            </n-avatar>
            <h3>{{ userStore.userInfo?.nickname || '用户' }}</h3>
            <p>{{ userStore.userInfo?.phone }}</p>
          </div>

          <nav class="side-nav">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ active: route.path === item.path }"
            >
              <n-icon size="16"><component :is="item.icon" /></n-icon>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </aside>

        <main class="user-main">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { DocumentTextOutline, HeartOutline, TimeOutline, TrashOutline, SettingsOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const navItems = [
  { path: '/user', label: '我的简历', icon: DocumentTextOutline },
  { path: '/user/favorites', label: '收藏模板', icon: HeartOutline },
  { path: '/user/history', label: '历史记录', icon: TimeOutline },
  { path: '/user/trash', label: '回收站', icon: TrashOutline },
  { path: '/user/settings', label: '账号设置', icon: SettingsOutline }
]
</script>

<style lang="scss" scoped>
.user-page {
  padding: 36px 0 80px;
}

.user-layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
}

.user-card {
  background: $white;
  border-radius: $r-card;
  padding: 28px 20px;
  text-align: center;
  box-shadow: $shadow-card;
  margin-bottom: 16px;

  .user-avatar {
    margin-bottom: 12px;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: $text-title;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: $text-ghost;
  }
}

.side-nav {
  background: $white;
  border-radius: $r-card;
  padding: 6px;
  box-shadow: $shadow-card;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: $r-sm;
  font-size: 14px;
  color: $text-body;
  transition: all 0.2s $ease;

  &:hover {
    background: $gray-50;
    color: $text-title;
  }

  &.active {
    background: $blue-light;
    color: $blue;
    font-weight: 500;
  }
}

.user-main {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .user-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: 20px;
  }

  .side-nav {
    display: flex;
    overflow-x: auto;
    gap: 4px;
    padding: 4px;
  }

  .nav-item {
    white-space: nowrap;
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
