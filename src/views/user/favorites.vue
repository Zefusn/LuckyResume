<template>
  <div class="favorites-page">
    <div class="page-header">
      <h2>收藏模板</h2>
    </div>
    
    <n-spin :show="loading">
      <div class="template-grid" v-if="templateList.length">
        <div 
          v-for="template in templateList" 
          :key="template.id" 
          class="template-card"
          @click="router.push(`/templates/${template.id}`)"
        >
          <div class="card-preview">
            <img :src="getTemplateThumbnail(template.thumbnail)" :alt="template.name" />
          </div>
          <div class="card-info">
            <h4>{{ template.name }}</h4>
            <n-button text type="error" size="small" @click.stop="handleUnfavorite(template)">
              取消收藏
            </n-button>
          </div>
        </div>
      </div>
      
      <n-empty description="暂无收藏模板" v-else />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { templateApi } from '@/api/template'
import type { Template } from '@/types'

const router = useRouter()
const message = useMessage()

const loading = ref(false)
const templateList = ref<Template[]>([])

function getTemplateThumbnail(thumbnail: string) {
  if (!thumbnail) return ''
  if (thumbnail.startsWith('http')) return thumbnail
  return `http://localhost:3001${thumbnail}`
}

async function fetchFavorites() {
  loading.value = true
  try {
    const data = await templateApi.getFavorites()
    templateList.value = data.list
  } catch (error) {
    message.error('获取收藏失败')
  } finally {
    loading.value = false
  }
}

async function handleUnfavorite(template: Template) {
  try {
    await templateApi.unfavorite(template.id)
    templateList.value = templateList.value.filter(t => t.id !== template.id)
    message.success('已取消收藏')
  } catch (error) {
    message.error('操作失败')
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style lang="scss" scoped>
.favorites-page {
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

.template-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.template-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-preview {
    height: 180px;
    background: #f8f9fa;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .card-info {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h4 {
      font-size: 14px;
    }
  }
}
</style>
