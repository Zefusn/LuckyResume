<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          智能简历制作
          <span class="highlight">轻松求职</span>
        </h1>
        <p class="hero-desc">
          专业模板 · 实时预览 · 一键导出
          <br />
          助你打造完美简历
        </p>
        <div class="hero-actions">
          <n-button type="primary" size="large" @click="handleCreateResume">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            免费创建简历
          </n-button>
          <n-button size="large" @click="router.push('/templates')">
            浏览模板
          </n-button>
        </div>
      </div>
      
      <div class="hero-image">
        <img src="@/assets/images/hero-resume.svg" alt="简历预览" />
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon" :style="{ background: feature.color }">
            <n-icon size="28" color="#fff">
              <component :is="feature.icon" />
            </n-icon>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>
    
    <!-- Templates Preview Section -->
    <section class="templates-section">
      <div class="section-header">
        <h2 class="section-title">热门模板</h2>
        <n-button text type="primary" @click="router.push('/templates')">
          查看更多
          <template #icon>
            <n-icon><ArrowForwardOutline /></n-icon>
          </template>
        </n-button>
      </div>
      
      <div class="templates-grid">
        <div 
          class="template-card" 
          v-for="template in hotTemplates" 
          :key="template.id"
          @click="router.push(`/templates/${template.id}`)"
        >
          <div class="template-preview">
            <img :src="getTemplateThumbnail(template.thumbnail)" :alt="template.name" />
          </div>
          <div class="template-info">
            <h4>{{ template.name }}</h4>
            <div class="template-meta">
              <n-tag size="small" :bordered="false">{{ template.style }}</n-tag>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>开始制作你的简历</h2>
        <p>选择模板，填写内容，即可生成专业简历</p>
        <n-button type="primary" size="large" @click="handleCreateResume">
          立即开始
        </n-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  AddOutline, 
  ArrowForwardOutline,
  DocumentTextOutline,
  ColorPaletteOutline,
  BulbOutline,
  CloudDownloadOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import { templateApi } from '@/api/template'
import type { Template } from '@/types'

const router = useRouter()
const userStore = useUserStore()

const hotTemplates = ref<Template[]>([])

async function fetchHotTemplates() {
  try {
    const data = await templateApi.getList({ limit: 4, sort: 'popular' })
    hotTemplates.value = data.list
  } catch (error) {
    console.error('获取模板失败', error)
  }
}

onMounted(() => {
  fetchHotTemplates()
})

const features = [
  {
    title: '专业模板',
    desc: '多款精心设计的简历模板，适配不同行业和岗位',
    icon: DocumentTextOutline,
    color: '#18a058'
  },
  {
    title: '实时预览',
    desc: '编辑过程中实时查看最终效果，所见即所得',
    icon: ColorPaletteOutline,
    color: '#2080f0'
  },
  {
    title: '智能优化',
    desc: 'AI 辅助润色内容，诊断简历问题，提升质量',
    icon: BulbOutline,
    color: '#f0a020'
  },
  {
    title: '多格式导出',
    desc: '支持 PDF、Word、图片等多种格式导出下载',
    icon: CloudDownloadOutline,
    color: '#d03050'
  }
]

function getTemplateThumbnail(thumbnail: string) {
  if (!thumbnail) return ''
  if (thumbnail.startsWith('http')) return thumbnail
  return `http://localhost:3001${thumbnail}`
}

function handleCreateResume() {
  if (userStore.isLoggedIn) {
    router.push('/editor')
  } else {
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  overflow-x: hidden;
}

.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px 60px;
  display: flex;
  align-items: center;
  gap: 60px;
}

.hero-content {
  flex: 1;
  
  .hero-title {
    font-size: 48px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 20px;
    
    .highlight {
      color: #18a058;
    }
  }
  
  .hero-desc {
    font-size: 18px;
    color: #666;
    line-height: 1.8;
    margin-bottom: 32px;
  }
  
  .hero-actions {
    display: flex;
    gap: 16px;
  }
}

.hero-image {
  flex: 1;
  
  img {
    width: 100%;
    max-width: 500px;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
  }
}

.features-section {
  background: #fff;
  padding: 80px 24px;
  
  .section-title {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 48px;
  }
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  padding: 28px;
  border-radius: 12px;
  background: #f8f9fa;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
  
  .feature-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }
  
  h3 {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-size: 13px;
    line-height: 1.6;
  }
}

.templates-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 28px;
    font-weight: 600;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.template-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eee;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
  
  .template-preview {
    height: 240px;
    background: #f5f7fa;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .template-info {
    padding: 14px;
    
    h4 {
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .template-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.cta-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%);
  padding: 80px 24px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  p {
    color: #666;
    font-size: 16px;
    margin-bottom: 24px;
  }
}
</style>
