<template>
  <div class="tpl-page">
    <div class="container">
      <h1 class="page-title">模板中心</h1>
      <p class="page-desc">为你精选的专业简历模板，适配不同行业与岗位</p>

      <div class="filter-bar">
        <div class="filter-row">
          <span class="filter-label">分类</span>
          <div class="filter-pills">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="pill"
              :class="{ active: selectedCategory === cat.value }"
              @click="selectedCategory = cat.value"
            >{{ cat.label }}</button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">风格</span>
          <div class="filter-pills">
            <button
              v-for="s in styles"
              :key="s.value"
              class="pill"
              :class="{ active: selectedStyle === s.value }"
              @click="selectedStyle = s.value"
            >{{ s.label }}</button>
          </div>
        </div>
      </div>

      <div class="tpl-grid" v-if="!loading">
        <div
          class="tpl-card"
          v-for="tpl in templates"
          :key="tpl.id"
          @click="router.push(`/templates/${tpl.id}`)"
        >
          <div class="tpl-img">
            <img :src="getThumb(tpl.thumbnail)" :alt="tpl.name" />
            <div class="tpl-overlay">
              <n-button type="primary" round size="small" @click.stop="handleUse(tpl)">使用此模板</n-button>
            </div>
          </div>
          <div class="tpl-meta">
            <span class="tpl-name">{{ tpl.name }}</span>
            <span class="tpl-count">{{ formatNum(tpl.downloadCount) }}人使用</span>
          </div>
        </div>
      </div>

      <div class="loading" v-else>
        <n-spin />
      </div>

      <div class="pagination" v-if="total > pageSize">
        <n-pagination v-model:page="currentPage" :page-count="Math.ceil(total / pageSize)" @update:page="fetchTemplates" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
const selectedCategory = ref('all')
const selectedStyle = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '应届生', value: 'fresh' },
  { label: '社招', value: 'experienced' },
  { label: '互联网', value: 'internet' },
  { label: '技术岗', value: 'tech' },
  { label: '非技术岗', value: 'non-tech' }
]

const styles = [
  { label: '全部', value: 'all' },
  { label: '商务简约', value: 'business' },
  { label: '经典正式', value: 'classic' },
  { label: '极简风', value: 'minimal' }
]

function getThumb(t: string) {
  if (!t) return ''
  if (t.startsWith('http')) return t
  return `http://localhost:3001${t}`
}

function formatNum(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

async function fetchTemplates() {
  loading.value = true
  try {
    const res = await templateApi.getList({
      page: currentPage.value,
      limit: pageSize,
      category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
      style: selectedStyle.value === 'all' ? undefined : selectedStyle.value,
      sort: 'popular'
    })
    templates.value = res.list
    total.value = res.total
  } catch (e) {
    message.error('获取模板失败')
  } finally {
    loading.value = false
  }
}

function handleUse(tpl: Template) {
  if (!userStore.isLoggedIn) { router.push('/login'); return }
  router.push(`/editor?templateId=${tpl.id}`)
}

watch([selectedCategory, selectedStyle], () => {
  currentPage.value = 1
  fetchTemplates()
})

onMounted(() => fetchTemplates())
</script>

<style lang="scss" scoped>
.tpl-page {
  padding: 40px 0 80px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: $text-title;
  text-align: center;
  margin-bottom: 8px;
}

.page-desc {
  font-size: 15px;
  color: $text-muted;
  text-align: center;
  margin-bottom: 36px;
}

.filter-bar {
  background: $white;
  border-radius: $r-card;
  padding: 20px 24px;
  margin-bottom: 28px;
  box-shadow: $shadow-card;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  &:last-child { margin-bottom: 0; }
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: $text-muted;
  width: 36px;
  flex-shrink: 0;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 5px 14px;
  border-radius: $r-pill;
  border: none;
  background: $gray-50;
  color: $text-body;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s $ease;

  &:hover {
    background: $gray-100;
  }

  &.active {
    background: $blue;
    color: $white;
  }
}

.tpl-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tpl-card {
  cursor: pointer;
  transition: all 0.25s $ease;

  &:hover {
    transform: translateY(-3px);
    .tpl-img { box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
    .tpl-overlay { opacity: 1; }
  }
}

.tpl-img {
  position: relative;
  border-radius: $r-card;
  overflow: hidden;
  background: $gray-100;
  height: 240px;
  box-shadow: $shadow-card;
  transition: box-shadow 0.25s $ease;

  img { width: 100%; height: 100%; object-fit: cover; }
}

.tpl-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s;
}

.tpl-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  .tpl-name {
    font-size: 14px;
    font-weight: 500;
    color: $text-body;
  }

  .tpl-count {
    font-size: 12px;
    color: $text-ghost;
  }
}

.loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .tpl-page { padding: 24px 0 60px; }
  .page-title { font-size: 22px; }
  .tpl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .tpl-img { height: 180px; }
  .filter-bar { padding: 16px; }
}
</style>
