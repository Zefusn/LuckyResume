<template>
  <div class="user-page">
    <div class="container">
      <div class="user-layout">
        <!-- 侧边栏 -->
        <aside class="user-sidebar">
          <div class="user-info">
            <n-avatar :size="64" :src="userStore.userInfo?.avatar" round>
              {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
            </n-avatar>
            <h3>{{ userStore.userInfo?.nickname || '用户' }}</h3>
            <p>{{ userStore.userInfo?.phone }}</p>
          </div>
          
          <nav class="sidebar-nav">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ active: route.path === item.path }"
            >
              <n-icon><component :is="item.icon" /></n-icon>
              <span>{{ item.label }}</span>
            </router-link>
          </nav>
        </aside>
        
        <!-- 内容区 -->
        <main class="user-content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { 
  DocumentTextOutline, 
  HeartOutline, 
  TimeOutline, 
  TrashOutline, 
  SettingsOutline 
} from '@vicons/ionicons5'
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
  padding: 40px 0;
}

.user-layout {
  display: flex;
  gap: 24px;
}

.user-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.user-info {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin-top: 12px;
    font-size: 16px;
  }
  
  p {
    color: #999;
    font-size: 13px;
    margin-top: 4px;
  }
}

.sidebar-nav {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 6px;
    color: #333;
    transition: all 0.2s;
    
    &:hover {
      background: #f5f7fa;
    }
    
    &.active {
      background: #e8f5e9;
      color: #18a058;
    }
  }
}

.user-content {
  flex: 1;
  min-width: 0;
}
</style>
