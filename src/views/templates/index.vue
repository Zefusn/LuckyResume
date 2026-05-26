<template>
  <div class="templates-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>模板中心</h1>
        <p>海量专业简历模板，助你轻松求职</p>
      </div>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">分类：</span>
          <n-space>
            <n-button 
              v-for="cat in categories" 
              :key="cat.value"
              :type="selectedCategory === cat.value ? 'primary' : 'default'"
              size="small"
              @click="selectedCategory = cat.value"
            >
              {{ cat.label }}
            </n-button>
          </n-space>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">风格：</span>
          <n-space>
            <n-button 
              v-for="style in styles" 
              :key="style.value"
              :type="selectedStyle === style.value ? 'primary' : 'default'"
              size="small"
              @click="selectedStyle = style.value"
            >
              {{ style.label }}
            </n-button>
          </n-space>
        </div>
        
        <div class="filter-actions">
          <n-input 
            v-model:value="keyword" 
            placeholder="搜索模板..."
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <n-icon><SearchOutline /></n-icon>
            </template>
          </n-input>
          
          <n-select 
            v-model:value="sortBy" 
            :options="sortOptions"
            style="width: 120px"
          />
        </div>
      </div>
      
      <!-- 模板列表 -->
      <div class="templates-grid" v-if="!loading">
        <div 
          class="template-card" 
          v-for="template in templates" 
          :key="template.id"
          @click="router.push(`/templates/${template.id}`)"
        >
          <div class="template-preview">
            <img :src="getTemplateThumbnail(template.thumbnail)" :alt="template.name" />
            <div class="template-overlay">
              <n-button type="primary" @click.stop="handleUseTemplate(template)">
                使用此模板
              </n-button>
              <n-button @click.stop="handlePreview(template)">
                预览
              </n-button>
            </div>
            <div class="template-badge" v-if="!template.isFree">会员</div>
          </div>
          
          <div class="template-info">
            <h4>{{ template.name }}</h4>
            <div class="template-meta">
              <n-space size="small">
                <n-tag v-for="tag in template.tags.slice(0, 2)" :key="tag" size="tiny" :bordered="false">
                  {{ tag }}
                </n-tag>
              </n-space>
              <span class="stats">
                <n-icon size="14"><EyeOutline /></n-icon>
                {{ formatNumber(template.downloadCount) }}
              </span>
            </div>
            
            <div class="template-actions">
              <n-button 
                text 
                :type="isFavorite(template.id) ? 'error' : 'default'"
                @click.stop="handleFavorite(template)"
              >
                <template #icon>
                  <n-icon>
                    <component :is="isFavorite(template.id) ? Heart : HeartOutline" />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div class="loading-state" v-else>
        <n-spin size="large" />
      </div>
      
      <!-- 空状态 -->
      <n-empty description="暂无模板" v-if="!loading && templates.length === 0" />
      
      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <n-pagination 
          v-model:page="currentPage" 
          :page-count="Math.ceil(total / pageSize)"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutline, EyeOutline, HeartOutline, Heart } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { templateApi } from '@/api/template'
import type { Template } from '@/types'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const loading = ref(false)
const templates = ref<Template[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20
const keyword = ref('')
const selectedCategory = ref('all')
const selectedStyle = ref('all')
const sortBy = ref('popular')
const favoriteIds = ref<Set<string>>(new Set())

const categories = [
  { label: '全部', value: 'all' },
  { label: '应届生', value: 'fresh' },
  { label: '实习', value: 'intern' },
  { label: '社招', value: 'experienced' },
  { label: '互联网', value: 'internet' },
  { label: '国企', value: 'state' },
  { label: '外企', value: 'foreign' },
  { label: '技术岗', value: 'tech' },
  { label: '非技术岗', value: 'non-tech' },
  { label: '英文', value: 'english' }
]

const styles = [
  { label: '全部', value: 'all' },
  { label: '商务简约', value: 'business' },
  { label: '经典正式', value: 'classic' },
  { label: '极简风', value: 'minimal' },
  { label: '学术风', value: 'academic' },
  { label: '轻创意', value: 'creative' }
]

const sortOptions = [
  { label: '最热门', value: 'popular' },
  { label: '最新', value: 'newest' },
  { label: '下载最多', value: 'downloads' }
]

function getTemplateThumbnail(thumbnail: string) {
  if (!thumbnail) return ''
  if (thumbnail.startsWith('http')) return thumbnail
  return `http://localhost:3001${thumbnail}`
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function isFavorite(id: string): boolean {
  return favoriteIds.value.has(id)
}

async function fetchTemplates() {
  loading.value = true
  try {
    const res = await templateApi.getList({
      page: currentPage.value,
      limit: pageSize,
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      style: selectedStyle.value === 'all' ? undefined : selectedStyle.value,
      keyword: keyword.value || undefined,
      sort: sortBy.value as any
    })
    templates.value = res.list
    total.value = res.total
  } catch (error) {
    message.error('获取模板列表失败')
  } finally {
    loading.value = false
  }
}

async function handleUseTemplate(template: Template) {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  router.push(`/editor?templateId=${template.id}`)
}

function handlePreview(_template: Template) {
  // TODO: 打开预览弹窗
  message.info('预览功能开发中')
}

async function handleFavorite(template: Template) {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  try {
    if (isFavorite(template.id)) {
      await templateApi.unfavorite(template.id)
      favoriteIds.value.delete(template.id)
    } else {
      await templateApi.favorite(template.id)
      favoriteIds.value.add(template.id)
    }
  } catch (error) {
    message.error('操作失败')
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchTemplates()
}

onMounted(() => {
  fetchTemplates()
})
</script>

<style lang="scss" scoped>
.templates-page {
  padding: 40px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-size: 16px;
  }
}

.filter-bar {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  
  .filter-group {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    &:last-of-type {
      margin-bottom: 0;
    }
    
    .filter-label {
      width: 50px;
      color: #666;
    }
  }
  
  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.template-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    
    .template-overlay {
      opacity: 1;
    }
  }
  
  .template-preview {
    position: relative;
    height: 280px;
    background: #f5f7fa;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .template-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .template-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, #f0a020, #e08010);
      color: #fff;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
    }
  }
  
  .template-info {
    padding: 16px;
    
    h4 {
      font-size: 15px;
      margin-bottom: 8px;
    }
    
    .template-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .stats {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #999;
        font-size: 12px;
      }
    }
    
    .template-actions {
      margin-top: 12px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
