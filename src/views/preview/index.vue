<template>
  <div class="preview-page">
    <header class="preview-header">
      <n-button @click="router.back()">返回</n-button>
      <h1>{{ resume?.title || '简历预览' }}</h1>
      <n-space>
        <n-button @click="handlePrint">打印</n-button>
        <n-button type="primary" @click="handleExportPdf">导出 PDF</n-button>
      </n-space>
    </header>
    
    <main class="preview-content">
      <div class="resume-page" ref="resumeRef">
        <ResumePreview v-if="resume" :content="resume.content" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { resumeApi } from '@/api/resume'
import ResumePreview from '@/views/editor/components/ResumePreview.vue'
import type { Resume } from '@/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const resume = ref<Resume | null>(null)
const resumeRef = ref<HTMLElement | null>(null)

async function fetchResume() {
  const id = route.params.id as string
  try {
    const data = await resumeApi.getById(id)
    resume.value = data
  } catch (error) {
    message.error('获取简历失败')
  }
}

function handlePrint() {
  window.print()
}

async function handleExportPdf() {
  message.info('导出功能开发中')
}

onMounted(() => {
  fetchResume()
})
</script>

<style lang="scss" scoped>
.preview-page {
  min-height: 100vh;
  background: #f0f2f5;
}

.preview-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  
  h1 {
    font-size: 18px;
  }
}

.preview-content {
  padding-top: 56px;
  display: flex;
  justify-content: center;
}

.resume-page {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  margin: 24px auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

@media print {
  .preview-header {
    display: none;
  }
  
  .preview-content {
    padding: 0;
  }
  
  .resume-page {
    margin: 0;
    box-shadow: none;
  }
}
</style>
