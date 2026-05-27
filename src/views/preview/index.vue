<template>
  <div class="preview-page">
    <header class="preview-header">
      <n-button @click="router.back()">
        <template #icon>
          <n-icon><ArrowBackOutline /></n-icon>
        </template>
        返回
      </n-button>
      <h1>{{ resume?.title || '简历预览' }}</h1>
      <n-space>
        <n-button @click="handlePrint">
          <template #icon>
            <n-icon><PrintOutline /></n-icon>
          </template>
          打印
        </n-button>
        <n-button type="primary" @click="handleExportPdf">
          <template #icon>
            <n-icon><DownloadOutline /></n-icon>
          </template>
          导出 PDF
        </n-button>
      </n-space>
    </header>
    
    <main class="preview-content">
      <div ref="resumeRef">
        <ResumePreview 
          v-if="resume" 
          :content="resume.content" 
          :color="resume.templateColor" 
          :template-style="resume.templateStyle" 
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { ArrowBackOutline, PrintOutline, DownloadOutline } from '@vicons/ionicons5'
import { resumeApi } from '@/api/resume'
import ResumePreview from '@/views/editor/components/ResumePreview.vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
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
  if (!resumeRef.value) {
    message.error('未找到简历内容')
    return
  }

  message.info('正在生成 PDF，请稍候...')

  try {
    const el = resumeRef.value.querySelector('.resume-page') as HTMLElement || resumeRef.value
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    const title = resume.value?.title || '简历'
    pdf.save(`${title}.pdf`)
    message.success('PDF 导出成功')
  } catch (error) {
    console.error('导出失败', error)
    message.error('导出失败，请重试')
  }
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

.preview-content > div {
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
  
  .preview-content > div {
    margin: 0;
    box-shadow: none;
  }
}
</style>
