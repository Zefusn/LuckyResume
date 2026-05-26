<template>
  <div class="trash-page">
    <div class="page-header">
      <h2>回收站</h2>
      <n-text depth="3" style="font-size: 13px">删除的简历将保留7天</n-text>
    </div>
    
    <n-spin :show="loading">
      <div class="trash-list" v-if="trashList.length">
        <div v-for="resume in trashList" :key="resume.id" class="trash-item">
          <div class="item-info">
            <n-icon><DocumentTextOutline /></n-icon>
            <div>
              <h4>{{ resume.title }}</h4>
              <span class="delete-time">删除于 {{ formatDate(resume.updatedAt) }}</span>
            </div>
          </div>
          <n-space>
            <n-button size="small" type="primary" @click="handleRestore(resume)">恢复</n-button>
            <n-button size="small" type="error" @click="handlePermanentDelete(resume)">永久删除</n-button>
          </n-space>
        </div>
      </div>
      
      <n-empty description="回收站为空" v-else />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { DocumentTextOutline } from '@vicons/ionicons5'
import { useResumeStore } from '@/stores/resume'
import type { Resume } from '@/types'

const message = useMessage()
const dialog = useDialog()
const resumeStore = useResumeStore()

const loading = computed(() => resumeStore.loading)
const trashList = computed(() => resumeStore.trashList)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

async function handleRestore(resume: Resume) {
  await resumeStore.restoreResume(resume.id)
  message.success('已恢复')
}

function handlePermanentDelete(resume: Resume) {
  dialog.warning({
    title: '永久删除',
    content: '此操作不可撤销，确定删除？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      await resumeStore.permanentDelete(resume.id)
      message.success('已永久删除')
    }
  })
}

onMounted(() => {
  resumeStore.fetchTrashList()
})
</script>

<style lang="scss" scoped>
.trash-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  h2 { font-size: 20px; }
}

.trash-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  .item-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    h4 { font-size: 15px; margin-bottom: 4px; }
    .delete-time { font-size: 12px; color: #999; }
  }
}
</style>
