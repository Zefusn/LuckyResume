<template>
  <div class="page">
    <section class="hero">
      <h1>LuckyResume</h1>
      <p>做出让人眼前一亮的简历</p>
      <div class="btns">
        <n-button type="primary" round size="large" class="btn-main" @click="handleCreate">免费开始</n-button>
        <n-button round size="large" class="btn-sub" @click="router.push('/templates')">浏览模板</n-button>
      </div>
    </section>

    <section class="tpl">
      <div class="tpl-head">
        <h2>精选模板</h2>
        <n-button text type="primary" @click="router.push('/templates')">查看全部</n-button>
      </div>
      <div class="tpl-grid">
        <div class="tpl-card" v-for="tpl in hotTemplates" :key="tpl.id" @click="router.push(`/templates/${tpl.id}`)">
          <div class="tpl-thumb"><img :src="getThumb(tpl.thumbnail)" :alt="tpl.name" /></div>
          <div class="tpl-name">{{ tpl.name }}</div>
        </div>
      </div>
    </section>

    <footer><span>LuckyResume</span></footer>
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
  try { hotTemplates.value = (await templateApi.getList({ limit: 4, sort: 'popular' })).list } catch (e) {}
}
onMounted(() => fetchHotTemplates())

function getThumb(t: string) {
  if (!t) return ''
  return t.startsWith('http') ? t : `http://localhost:3001${t}`
}

function handleCreate() {
  router.push(userStore.isLoggedIn ? '/editor' : '/login')
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $white; }

.hero {
  padding: 200px 24px 160px;
  text-align: center;
  background: $white;

  h1 {
    font-size: 56px;
    font-weight: 700;
    color: $gray-900;
    letter-spacing: -2px;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    color: $gray-500;
    margin-bottom: 40px;
  }
}

.btns {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn-main {
  background: $blue !important;
  border-color: $blue !important;
  height: 48px;
  padding: 0 32px;
  font-size: 16px;

  &:hover {
    background: $blue-hover !important;
    border-color: $blue-hover !important;
  }
}

.btn-sub {
  height: 48px;
  padding: 0 28px;
  font-size: 16px;
  color: $gray-600 !important;
  border-color: $gray-200 !important;

  &:hover {
    color: $blue !important;
    border-color: $blue !important;
  }
}

.tpl {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 24px 120px;
}

.tpl-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 40px;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: $gray-900;
    letter-spacing: -0.5px;
  }
}

.tpl-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.tpl-card {
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    .tpl-thumb { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08); }
  }
}

.tpl-thumb {
  border-radius: 12px;
  overflow: hidden;
  background: $gray-50;
  height: 280px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

.tpl-name {
  font-size: 14px;
  font-weight: 500;
  color: $gray-600;
  text-align: center;
  padding: 12px 0;
}

footer {
  padding: 40px 24px;
  text-align: center;
  border-top: 1px solid $gray-100;

  span {
    font-size: 13px;
    font-weight: 600;
    color: $gray-400;
    letter-spacing: -0.3px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 140px 20px 100px;
    h1 { font-size: 36px; }
    p { font-size: 16px; }
  }
  .btns { flex-direction: column; align-items: center; gap: 8px; }
  .btn-main, .btn-sub { width: 260px; }
  .tpl { padding: 0 20px 80px; }
  .tpl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .tpl-thumb { height: 180px; }
  .tpl-head h2 { font-size: 22px; }
}
</style>
