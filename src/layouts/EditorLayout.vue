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
          <n-tag v-if="saving" type="info" size="small">保存中...</n-tag>
          <n-tag v-else type="success" size="small">已保存</n-tag>
        </n-space>
      </div>
      
      <div class="header-right">
        <n-space>
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

    <div ref="exportContainer" class="export-container">
      <div class="export-page">
        <ResumePreview v-if="resumeStore.currentResume" :content="resumeStore.content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import { NIcon, useMessage } from 'naive-ui'
import { 
  ArrowBackOutline, 
  EyeOutline,
  DownloadOutline,
  DocumentOutline,
  ImageOutline,
  CodeSlashOutline
} from '@vicons/ionicons5'
import { useResumeStore } from '@/stores/resume'
import ResumePreview from '@/views/editor/components/ResumePreview.vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const router = useRouter()
const message = useMessage()
const resumeStore = useResumeStore()

const resumeTitle = ref(resumeStore.currentResume?.title || '未命名简历')
const saving = computed(() => resumeStore.saving)
const exportContainer = ref<HTMLElement | null>(null)

const exportOptions = [
  {
    label: '导出 PDF',
    key: 'pdf',
    icon: () => h(NIcon, null, { default: () => h(DocumentOutline) })
  },
  {
    label: '导出图片',
    key: 'image',
    icon: () => h(NIcon, null, { default: () => h(ImageOutline) })
  },
  {
    label: '导出 Word',
    key: 'word',
    icon: () => h(NIcon, null, { default: () => h(CodeSlashOutline) })
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

function handlePreview() {
  if (resumeStore.currentResume) {
    window.open(`/preview/${resumeStore.currentResume.id}`, '_blank')
  }
}

async function handleExport(key: string) {
  message.info('正在导出，请稍候...')

  try {
    if (key === 'word') {
      exportWord()
      return
    }

    const el = exportContainer.value?.querySelector('.export-page') as HTMLElement
    if (!el) {
      message.error('导出失败')
      return
    }

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794
    })

    if (key === 'pdf') {
      await exportPdf(canvas)
    } else if (key === 'image') {
      exportImage(canvas)
    }
  } catch (error) {
    console.error('导出失败', error)
    message.error('导出失败，请重试')
  }
}

async function exportPdf(canvas: HTMLCanvasElement) {
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

  const title = resumeStore.currentResume?.title || '简历'
  pdf.save(`${title}.pdf`)
  message.success('PDF 导出成功')
}

function exportImage(canvas: HTMLCanvasElement) {
  const link = document.createElement('a')
  const title = resumeStore.currentResume?.title || '简历'
  link.download = `${title}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
  message.success('图片导出成功')
}

function exportWord() {
  const title = resumeStore.currentResume?.title || '简历'
  const content = resumeStore.content

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
body { font-family: 'Microsoft YaHei', sans-serif; font-size: 12px; color: #333; line-height: 1.6; padding: 40px; }
h1 { color: #18a058; font-size: 26px; margin-bottom: 4px; }
h2 { color: #18a058; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-top: 18px; }
.contact { color: #555; margin-bottom: 16px; }
.item { margin-bottom: 12px; }
.item-header { display: flex; justify-content: space-between; font-weight: bold; }
.date { color: #999; font-weight: normal; }
ul { padding-left: 20px; }
</style>
</head>
<body>
<h1>${content.basic.name || ''}</h1>
<div class="contact">
${content.basic.phone ? `电话: ${content.basic.phone}` : ''}
${content.basic.email ? ` | 邮箱: ${content.basic.email}` : ''}
${content.basic.location ? ` | 城市: ${content.basic.location}` : ''}
</div>
${content.intention.position ? `<h2>求职意向</h2><p>${[content.intention.position, content.intention.city, content.intention.salary, content.intention.jobType].filter(Boolean).join(' | ')}</p>` : ''}
${content.education.length ? `<h2>教育背景</h2>${content.education.map(e => `<div class="item"><div class="item-header"><span>${e.school}</span><span class="date">${e.startDate} - ${e.endDate}</span></div><div>${e.major} ${e.degree}${e.gpa ? ` GPA: ${e.gpa}` : ''}</div>${e.description ? `<p>${e.description}</p>` : ''}</div>`).join('')}` : ''}
${content.work.length ? `<h2>工作经历</h2>${content.work.map(w => `<div class="item"><div class="item-header"><span>${w.company}</span><span class="date">${w.startDate} - ${w.isCurrent ? '至今' : w.endDate}</span></div><div>${w.position}</div>${w.description ? `<p>${w.description}</p>` : ''}${w.achievements?.length ? `<ul>${w.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}</div>`).join('')}` : ''}
${content.project.length ? `<h2>项目经历</h2>${content.project.map(p => `<div class="item"><div class="item-header"><span>${p.name}</span><span class="date">${p.startDate} - ${p.endDate}</span></div><div>${p.role}</div>${p.description ? `<p>${p.description}</p>` : ''}${p.technologies?.length ? `<p>技术栈: ${p.technologies.join(', ')}</p>` : ''}${p.achievements?.length ? `<ul>${p.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}</div>`).join('')}` : ''}
${content.skills.length ? `<h2>专业技能</h2>${content.skills.map(s => `<span>${s.name} (${'★'.repeat(s.level)}${'☆'.repeat(5 - s.level)}) </span>`).join('')}` : ''}
${content.selfEvaluation ? `<h2>自我评价</h2><p>${content.selfEvaluation}</p>` : ''}
</body>
</html>`

  const blob = new Blob([htmlContent], { type: 'application/msword' })
  const link = document.createElement('a')
  link.download = `${title}.doc`
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
  message.success('Word 导出成功')
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

.export-container {
  position: fixed;
  left: -9999px;
  top: 0;
  z-index: -1;
}

.export-page {
  width: 794px;
  background: #fff;
}
</style>
