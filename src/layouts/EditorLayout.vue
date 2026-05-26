<template>
  <div class="editor-layout">
    <header class="editor-header">
      <div class="header-left">
        <n-button quaternary @click="goBack">
          <template #icon>
            <n-icon><ArrowBackOutline /></n-icon>
          </template>
          返回
        </n-button>
        <n-divider vertical />
        <n-input 
          v-model:value="resumeTitle" 
          placeholder="请输入简历标题"
          style="width: 240px"
          @blur="handleTitleBlur"
        />
      </div>
      
      <div class="header-center">
        <n-space>
          <n-button @click="handleUndo" :disabled="!canUndo">
            <template #icon>
              <n-icon><ArrowUndoOutline /></n-icon>
            </template>
          </n-button>
          <n-button @click="handleRedo" :disabled="!canRedo">
            <template #icon>
              <n-icon><ArrowRedoOutline /></n-icon>
            </template>
          </n-button>
        </n-space>
      </div>
      
      <div class="header-right">
        <n-space>
          <n-tag v-if="saving" type="info" size="small">保存中...</n-tag>
          <n-tag v-else type="success" size="small">已保存</n-tag>
          
          <n-button @click="handlePreview">
            <template #icon>
              <n-icon><EyeOutline /></n-icon>
            </template>
            预览
          </n-button>
          
          <n-dropdown :options="exportOptions" @select="handleExport">
            <n-button type="primary">
              <template #icon>
                <n-icon><DownloadOutline /></n-icon>
              </template>
              导出
            </n-button>
          </n-dropdown>
        </n-space>
      </div>
    </header>
    
    <div class="editor-body">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { 
  ArrowBackOutline, 
  ArrowUndoOutline, 
  ArrowRedoOutline,
  EyeOutline,
  DownloadOutline,
  DocumentOutline,
  ImageOutline,
  CodeSlashOutline
} from '@vicons/ionicons5'
import { useResumeStore } from '@/stores/resume'

const router = useRouter()
const resumeStore = useResumeStore()

const resumeTitle = ref(resumeStore.currentResume?.title || '未命名简历')
const saving = computed(() => resumeStore.saving)
const canUndo = ref(false)
const canRedo = ref(false)

const exportOptions = [
  {
    label: '导出 PDF',
    key: 'pdf',
    icon: () => h(NIcon, null, { default: () => h(DocumentOutline) })
  },
  {
    label: '导出 Word',
    key: 'word',
    icon: () => h(NIcon, null, { default: () => h(CodeSlashOutline) })
  },
  {
    label: '导出图片',
    key: 'image',
    icon: () => h(NIcon, null, { default: () => h(ImageOutline) })
  }
]

function goBack() {
  router.push('/user')
}

function handleTitleBlur() {
  if (resumeStore.currentResume) {
    resumeStore.currentResume.title = resumeTitle.value
    resumeStore.saveResume()
  }
}

function handleUndo() {
  // TODO: 实现撤销
}

function handleRedo() {
  // TODO: 实现重做
}

function handlePreview() {
  if (resumeStore.currentResume) {
    window.open(`/preview/${resumeStore.currentResume.id}`, '_blank')
  }
}

function handleExport(key: string) {
  // TODO: 实现导出功能
  console.log('导出', key)
}
</script>

<style lang="scss" scoped>
.editor-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.editor-header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header-left, .header-center, .header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-body {
  flex: 1;
  overflow: hidden;
}
</style>
