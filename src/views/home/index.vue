<template>
  <div class="page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">
          做一份好简历<br /><span class="accent">没那么难</span>
        </h1>
        <p class="hero-sub">选模板、填内容、导出 PDF，三步搞定</p>
        <div class="hero-actions">
          <n-button type="primary" round size="large" class="btn-main" @click="handleCreate">
            免费开始制作
          </n-button>
        </div>

        <div class="hero-visual">
          <div class="visual-card left">
            <div class="mock-row">
              <div class="mock-circle"></div>
              <div class="mock-stack"><div class="bar w-50"></div><div class="bar w-30"></div></div>
            </div>
            <div class="mock-divider"></div>
            <div class="bar w-100"></div>
            <div class="bar w-80"></div>
            <div class="bar w-90"></div>
            <div class="mock-divider"></div>
            <div class="bar w-70"></div>
            <div class="bar w-100"></div>
            <div class="bar w-60"></div>
          </div>
          <div class="visual-card center">
            <div class="mock-row">
              <div class="mock-circle lg"></div>
              <div class="mock-stack"><div class="bar w-60"></div><div class="bar w-40"></div></div>
            </div>
            <div class="mock-divider"></div>
            <div class="bar w-100"></div>
            <div class="bar w-90"></div>
            <div class="bar w-80"></div>
            <div class="mock-divider"></div>
            <div class="bar w-100"></div>
            <div class="bar w-70"></div>
            <div class="bar w-90"></div>
            <div class="mock-divider"></div>
            <div class="bar w-80"></div>
            <div class="bar w-100"></div>
          </div>
          <div class="visual-card right">
            <div class="mock-row">
              <div class="mock-circle"></div>
              <div class="mock-stack"><div class="bar w-50"></div><div class="bar w-40"></div></div>
            </div>
            <div class="mock-divider"></div>
            <div class="bar w-90"></div>
            <div class="bar w-100"></div>
            <div class="bar w-70"></div>
            <div class="mock-divider"></div>
            <div class="bar w-80"></div>
            <div class="bar w-60"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates -->
    <section class="templates">
      <div class="tpl-inner">
        <div class="tpl-head">
          <h2>精选模板</h2>
          <n-button text type="primary" class="tpl-link" @click="router.push('/templates')">
            查看全部
          </n-button>
        </div>
        <div class="tpl-grid">
          <div
            class="tpl-card"
            v-for="tpl in hotTemplates"
            :key="tpl.id"
            @click="router.push(`/templates/${tpl.id}`)"
          >
            <div class="tpl-thumb">
              <img :src="getThumb(tpl.thumbnail)" :alt="tpl.name" />
            </div>
            <div class="tpl-name">{{ tpl.name }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
  } catch (e) { console.error(e) }
}

onMounted(() => fetchHotTemplates())

function getThumb(t: string) {
  if (!t) return ''
  if (t.startsWith('http')) return t
  return `http://localhost:3001${t}`
}

function handleCreate() {
  router.push(userStore.isLoggedIn ? '/editor' : '/login')
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; }

// ========== Hero ==========
.hero {
  padding: 140px 24px 100px;
  text-align: center;
}

.hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: $text-title;
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 20px;

  .accent {
    background: linear-gradient(135deg, $blue, #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.hero-sub {
  font-size: 18px;
  color: $text-muted;
  margin-bottom: 40px;
  font-weight: 400;
}

.hero-actions {
  margin-bottom: 80px;
}

.btn-main {
  background: $blue !important;
  border-color: $blue !important;
  font-weight: 500;
  height: 50px;
  padding: 0 36px;
  font-size: 16px;

  &:hover {
    background: $blue-hover !important;
    border-color: $blue-hover !important;
    transform: scale(1.02);
  }
}

// Visual cards
.hero-visual {
  display: flex;
  justify-content: center;
  gap: 20px;
  perspective: 900px;
}

.visual-card {
  width: 220px;
  background: $white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid $gray-100;
  transition: all 0.5s $ease;

  &.left {
    transform: rotateY(8deg) translateX(-10px) translateY(20px);
    opacity: 0.5;
  }

  &.center {
    transform: translateY(-10px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
    z-index: 2;
    width: 240px;
  }

  &.right {
    transform: rotateY(-8deg) translateX(10px) translateY(20px);
    opacity: 0.5;
  }
}

.mock-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.mock-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: $blue-light;
  flex-shrink: 0;

  &.lg {
    width: 36px;
    height: 36px;
  }
}

.mock-stack {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bar {
  height: 5px;
  border-radius: 3px;
  background: $gray-100;

  &.w-30 { width: 30%; }
  &.w-40 { width: 40%; }
  &.w-50 { width: 50%; }
  &.w-60 { width: 60%; }
  &.w-70 { width: 70%; }
  &.w-80 { width: 80%; }
  &.w-90 { width: 90%; }
  &.w-100 { width: 100%; }
}

.mock-divider {
  height: 1px;
  background: $gray-100;
  margin: 12px 0;
}

// ========== Templates ==========
.templates {
  padding: 0 24px 100px;
}

.tpl-inner {
  max-width: $max-w;
  margin: 0 auto;
}

.tpl-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: $text-title;
    letter-spacing: -0.5px;
  }
}

.tpl-link {
  font-size: 15px;
  color: $blue !important;
  font-weight: 400;

  &:hover {
    text-decoration: underline;
  }
}

.tpl-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tpl-card {
  cursor: pointer;
  transition: all 0.3s $ease;

  &:hover {
    transform: translateY(-6px);
    .tpl-thumb {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }
  }
}

.tpl-thumb {
  border-radius: 16px;
  overflow: hidden;
  background: $gray-50;
  height: 280px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s $ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.tpl-name {
  font-size: 15px;
  font-weight: 500;
  color: $text-body;
  padding: 14px 0;
  text-align: center;
}

// ========== Responsive ==========
@media (max-width: 768px) {
  .hero {
    padding: 100px 20px 60px;
  }

  .hero-title {
    font-size: 36px;
    letter-spacing: -1px;
  }

  .hero-sub {
    font-size: 16px;
  }

  .hero-visual {
    display: none;
  }

  .hero-actions {
    margin-bottom: 0;
  }

  .templates {
    padding: 0 20px 60px;
  }

  .tpl-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .tpl-thumb {
    height: 200px;
  }

  .tpl-head h2 {
    font-size: 22px;
  }
}
</style>
