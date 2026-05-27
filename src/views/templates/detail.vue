<template>
  <div class="template-detail-page">
    <div class="container">
      <n-spin :show="loading">
        <div class="detail-content" v-if="template">
          <div class="detail-left">
            <div class="preview-container">
              <div class="preview-images">
                <img 
                  v-for="(img, index) in template.previewImages" 
                  :key="index"
                  :src="getTemplateThumbnail(img)" 
                  :alt="`${template.name} 预览 ${index + 1}`"
                  class="preview-img"
                />
              </div>
            </div>
          </div>
          
          <div class="detail-right">
            <div class="template-header">
              <h1>{{ template.name }}</h1>
              <div class="template-tags">
                <n-tag v-for="tag in template.tags" :key="tag">{{ tag }}</n-tag>
              </div>
            </div>
            
            <div class="template-stats">
              <div class="stat-item">
                <n-icon><DownloadOutline /></n-icon>
                <span>{{ template.downloadCount }} 次使用</span>
              </div>
              <div class="stat-item">
                <n-icon><HeartOutline /></n-icon>
                <span>{{ template.favoriteCount }} 人收藏</span>
              </div>
            </div>
            
            <p class="template-desc">{{ template.description }}</p>
            
            <div class="template-features">
              <h3>模板特点</h3>
              <ul>
                <li>
                  <n-icon color="#3B82F6"><CheckmarkCircleOutline /></n-icon>
                  ATS 招聘系统兼容
                </li>
                <li>
                  <n-icon color="#3B82F6"><CheckmarkCircleOutline /></n-icon>
                  支持多语言内容
                </li>
                <li>
                  <n-icon color="#3B82F6"><CheckmarkCircleOutline /></n-icon>
                  自适应排版布局
                </li>
                <li>
                  <n-icon color="#3B82F6"><CheckmarkCircleOutline /></n-icon>
                  支持 PDF/Word 导出
                </li>
              </ul>
            </div>
            
            <div class="template-actions">
              <n-button type="primary" size="large" block @click="handleUseTemplate">
                使用此模板创建简历
              </n-button>
              <n-button size="large" block @click="handleFavorite">
                <template #icon>
                  <n-icon>
                    <component :is="isFavorite ? Heart : HeartOutline" />
                  </n-icon>
                </template>
                {{ isFavorite ? '已收藏' : '收藏模板' }}
              </n-button>
            </div>
            
            <div class="template-info">
              <div class="info-item">
                <span class="label">分类：</span>
                <span>{{ template.category }}</span>
              </div>
              <div class="info-item">
                <span class="label">风格：</span>
                <span>{{ template.style }}</span>
              </div>
              <div class="info-item">
                <span class="label">类型：</span>
                <span>{{ template.isFree ? '免费' : '会员专属' }}</span>
              </div>
            </div>
          </div>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  DownloadOutline, 
  HeartOutline, 
  Heart, 
  CheckmarkCircleOutline 
} from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import { templateApi } from '@/api/template'
import type { Template } from '@/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const loading = ref(false)
const template = ref<Template | null>(null)
const isFavorite = ref(false)

function getTemplateThumbnail(thumbnail: string) {
  if (!thumbnail) return ''
  if (thumbnail.startsWith('http')) return thumbnail
  return `http://localhost:3001${thumbnail}`
}

async function fetchTemplate() {
  const id = route.params.id as string
  loading.value = true
  try {
    const data = await templateApi.getById(id)
    template.value = data
  } catch (error) {
    message.error('获取模板详情失败')
  } finally {
    loading.value = false
  }
}

function handleUseTemplate() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (template.value) {
    router.push(`/editor?templateId=${template.value.id}`)
  }
}

async function handleFavorite() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (!template.value) return
  
  try {
    if (isFavorite.value) {
      await templateApi.unfavorite(template.value.id)
      isFavorite.value = false
      message.success('已取消收藏')
    } else {
      await templateApi.favorite(template.value.id)
      isFavorite.value = true
      message.success('收藏成功')
    }
  } catch (error) {
    message.error('操作失败')
  }
}

onMounted(() => {
  fetchTemplate()
})
</script>

<style lang="scss" scoped>
.template-detail-page {
  padding: 40px 0;
}

.detail-content {
  display: flex;
  gap: 40px;
}

.detail-left {
  flex: 1;
}

.preview-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.preview-images {
  .preview-img {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #eee;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.detail-right {
  width: 360px;
  flex-shrink: 0;
}

.template-header {
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  .template-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.template-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
  }
}

.template-desc {
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
}

.template-features {
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  ul {
    list-style: none;
    
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      color: #333;
    }
  }
}

.template-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.template-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  
  .info-item {
    display: flex;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      width: 50px;
      color: #999;
    }
  }
}
</style>
