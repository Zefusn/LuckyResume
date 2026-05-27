<template>
  <div class="resumes-page">
    <div class="page-header">
      <h2>我的简历</h2>
      <n-space>
        <n-button quaternary type="error" size="small" @click="handleClearAll" v-if="resumeList.length">
          清空全部
        </n-button>
        <n-button type="primary" @click="handleCreate">
          <template #icon>
            <n-icon><AddOutline /></n-icon>
          </template>
          创建简历
        </n-button>
      </n-space>
    </div>
    
    <n-spin :show="loading">
      <div class="resume-grid" v-if="resumeList.length">
        <div 
          v-for="resume in resumeList" 
          :key="resume.id" 
          class="resume-card"
          @click="handleEdit(resume)"
        >
          <div class="card-preview">
            <div class="preview-placeholder">
              <n-icon size="48" color="#ccc"><DocumentTextOutline /></n-icon>
            </div>
            <div class="card-overlay">
              <n-button type="primary" size="small" @click="handleEdit(resume)">编辑</n-button>
              <n-button size="small" @click="handlePreview(resume)">预览</n-button>
            </div>
          </div>
          
          <div class="card-info">
            <h4>{{ resume.title }}</h4>
            <div class="card-meta">
              <span>模板: {{ resume.templateId }}</span>
              <span>{{ formatDate(resume.updatedAt) }}</span>
            </div>
            <div class="card-actions">
              <n-dropdown :options="getActionOptions(resume)" @select="(key) => handleAction(key, resume)">
                <n-button text size="small">更多</n-button>
              </n-dropdown>
            </div>
          </div>
        </div>
      </div>
      
      <n-empty description="暂无简历，点击创建" v-else>
        <template #extra>
          <n-button type="primary" @click="handleCreate">创建简历</n-button>
        </template>
      </n-empty>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { h, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { AddOutline, DocumentTextOutline, CopyOutline, ShareOutline, TrashOutline } from '@vicons/ionicons5'
import { useResumeStore } from '@/stores/resume'
import { resumeApi } from '@/api/resume'
import type { Resume } from '@/types'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const resumeStore = useResumeStore()

const loading = computed(() => resumeStore.loading)
const resumeList = computed(() => resumeStore.resumeList)

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

function getActionOptions(_resume: Resume) {
  return [
    { label: '复制', key: 'copy', icon: () => h(NIcon, null, { default: () => h(CopyOutline) }) },
    { label: '分享', key: 'share', icon: () => h(NIcon, null, { default: () => h(ShareOutline) }) },
    { type: 'divider', key: 'd1' },
    { label: '删除', key: 'delete', icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
  ]
}

function handleCreate() {
  router.push('/editor')
}

function handleClearAll() {
  dialog.warning({
    title: '清空全部简历',
    content: `确定清空所有 ${resumeList.value.length} 份简历？清空后可在回收站恢复。`,
    positiveText: '清空',
    negativeText: '取消',
    onPositiveClick: async () => {
      await resumeStore.clearAllResumes()
      message.success('已清空全部简历')
    }
  })
}

function handleEdit(resume: Resume) {
  router.push(`/editor/${resume.id}`)
}

function handlePreview(resume: Resume) {
  window.open(`/preview/${resume.id}`, '_blank')
}

async function handleAction(key: string, resume: Resume) {
  switch (key) {
    case 'copy':
      await handleCopy(resume)
      break
    case 'share':
      await handleShare(resume)
      break
    case 'delete':
      dialog.warning({
        title: '确认删除',
        content: '删除后可在回收站恢复，确定删除？',
        positiveText: '删除',
        negativeText: '取消',
        onPositiveClick: async () => {
          await resumeStore.deleteResume(resume.id)
          message.success('已移至回收站')
        }
      })
      break
  }
}

async function handleCopy(resume: Resume) {
  try {
    await resumeApi.duplicate(resume.id)
    await resumeStore.fetchResumeList()
    message.success('复制成功')
  } catch (error) {
    message.error('复制失败')
  }
}

async function handleShare(resume: Resume) {
  try {
    const data = await resumeApi.getShareLink(resume.id, '7d')
    await navigator.clipboard.writeText(data.link)
    message.success('分享链接已复制到剪贴板，7天内有效')
  } catch (error) {
    message.error('分享失败')
  }
}

onMounted(() => {
  resumeStore.fetchResumeList()
})
</script>

<style lang="scss" scoped>
.resumes-page {
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
  
  h2 {
    font-size: 20px;
  }
}

.resume-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.resume-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .card-overlay {
      opacity: 1;
    }
  }
  
  .card-preview {
    position: relative;
    height: 200px;
    background: #f8f9fa;
    
    .preview-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
  
  .card-info {
    padding: 16px;
    
    h4 {
      font-size: 15px;
      margin-bottom: 8px;
    }
    
    .card-meta {
      display: flex;
      justify-content: space-between;
      color: #999;
      font-size: 12px;
      margin-bottom: 12px;
    }
    
    .card-actions {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
