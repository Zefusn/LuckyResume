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
          海量专业模板 · AI智能优化 · 一键导出分享
          <br />
          助你打造完美简历，赢得理想工作
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
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">1000+</span>
            <span class="stat-label">专业模板</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50万+</span>
            <span class="stat-label">用户使用</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">98%</span>
            <span class="stat-label">好评率</span>
          </div>
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
            <n-icon size="32" color="#fff">
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
              <span class="download-count">{{ template.downloadCount }}次使用</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- AI Section -->
    <section class="ai-section">
      <div class="ai-content">
        <div class="ai-info">
          <h2>AI 智能助手</h2>
          <p>基于大语言模型，为你提供专业的简历优化服务</p>
          <ul class="ai-features">
            <li>
              <n-icon color="#18a058"><CheckmarkCircleOutline /></n-icon>
              一键生成完整简历内容
            </li>
            <li>
              <n-icon color="#18a058"><CheckmarkCircleOutline /></n-icon>
              智能润色优化语句表达
            </li>
            <li>
              <n-icon color="#18a058"><CheckmarkCircleOutline /></n-icon>
              岗位匹配度分析诊断
            </li>
            <li>
              <n-icon color="#18a058"><CheckmarkCircleOutline /></n-icon>
              自动生成求职自荐信
            </li>
          </ul>
          <n-button type="primary" size="large" @click="handleCreateResume">
            立即体验 AI 功能
          </n-button>
        </div>
        
        <div class="ai-demo">
          <div class="demo-card">
            <div class="demo-header">
              <n-icon color="#18a058"><SparklesOutline /></n-icon>
              <span>AI 正在为您生成简历...</span>
            </div>
            <div class="demo-content">
              <div class="typing-text">
                <span class="line">• 负责公司核心电商平台的后端系统架构设计与开发</span>
                <span class="line">• 主导微服务架构重构，系统吞吐量提升 200%</span>
                <span class="line">• 带领5人团队完成3个重要项目，按时交付率 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { 
  AddOutline, 
  ArrowForwardOutline,
  CheckmarkCircleOutline,
  SparklesOutline,
  DocumentTextOutline,
  ColorPaletteOutline,
  BulbOutline,
  CloudDownloadOutline,
  ShareSocialOutline,
  ShieldCheckmarkOutline
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
    title: '海量模板',
    desc: '覆盖各行业、各风格的专业简历模板，ATS系统兼容',
    icon: DocumentTextOutline,
    color: '#18a058'
  },
  {
    title: 'AI 智能生成',
    desc: '输入岗位信息，AI 自动生成专业简历内容',
    icon: BulbOutline,
    color: '#f0a020'
  },
  {
    title: '实时预览',
    desc: '编辑过程中实时查看最终效果，所见即所得',
    icon: ColorPaletteOutline,
    color: '#2080f0'
  },
  {
    title: '多格式导出',
    desc: '支持 PDF、Word、图片等多种格式导出下载',
    icon: CloudDownloadOutline,
    color: '#d03050'
  },
  {
    title: '在线分享',
    desc: '一键生成分享链接，支持二维码和微信分享',
    icon: ShareSocialOutline,
    color: '#8a2be2'
  },
  {
    title: '隐私安全',
    desc: '简历数据加密存储，三级隐私权限保护',
    icon: ShieldCheckmarkOutline,
    color: '#20b2aa'
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
    margin-bottom: 48px;
  }
  
  .hero-stats {
    display: flex;
    gap: 48px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      
      .stat-number {
        font-size: 32px;
        font-weight: 700;
        color: #18a058;
      }
      
      .stat-label {
        font-size: 14px;
        color: #999;
      }
    }
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
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 48px;
  }
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.feature-card {
  padding: 32px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-size: 14px;
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
    font-size: 32px;
    font-weight: 600;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.template-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  .template-preview {
    height: 240px;
    background: #f0f2f5;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      
      .download-count {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.ai-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 80px 24px;
}

.ai-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}

.ai-info {
  flex: 1;
  color: #fff;
  
  h2 {
    font-size: 36px;
    margin-bottom: 16px;
  }
  
  > p {
    color: #aaa;
    font-size: 16px;
    margin-bottom: 32px;
  }
  
  .ai-features {
    list-style: none;
    margin-bottom: 32px;
    
    li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }
}

.ai-demo {
  flex: 1;
}

.demo-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .demo-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #18a058;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .demo-content {
    .typing-text {
      .line {
        display: block;
        color: #e0e0e0;
        font-size: 14px;
        line-height: 2;
        opacity: 0;
        animation: fadeIn 0.5s forwards;
        
        &:nth-child(1) { animation-delay: 0.5s; }
        &:nth-child(2) { animation-delay: 1s; }
        &:nth-child(3) { animation-delay: 1.5s; }
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
