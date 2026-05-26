<template>
  <div class="history-page">
    <div class="page-header">
      <h2>历史记录</h2>
    </div>
    
    <n-spin :show="loading">
      <n-timeline v-if="historyList.length">
        <n-timeline-item 
          v-for="item in historyList" 
          :key="item.id"
          :title="item.title"
          :content="formatDate(item.updatedAt)"
          :time="formatTime(item.updatedAt)"
        >
          <template #icon>
            <n-icon><DocumentTextOutline /></n-icon>
          </template>
          <n-button size="small" @click="handleView(item)">查看</n-button>
        </n-timeline-item>
      </n-timeline>
      
      <n-empty description="暂无历史记录" v-else />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DocumentTextOutline } from '@vicons/ionicons5'
import { resumeApi } from '@/api/resume'
import type { Resume } from '@/types'

const router = useRouter()
const loading = ref(false)
const historyList = ref<Resume[]>([])

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('zh-CN')
}

function handleView(resume: Resume) {
  router.push(`/editor/${resume.id}`)
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await resumeApi.getList({ limit: 50 })
    historyList.value = data.list
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.history-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-header {
  margin-bottom: 24px;
  h2 { font-size: 20px; }
}
</style>
