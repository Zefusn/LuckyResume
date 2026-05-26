<template>
  <div class="editor-page">
    <!-- 左侧模块列表 -->
    <aside class="editor-sidebar">
      <div class="sidebar-header">
        <h3>简历模块</h3>
      </div>

      <div class="module-list">
        <div
          v-for="(section, index) in sections"
          :key="section.key"
          class="module-item"
          :class="{ active: activeSection === section.key }"
          draggable="true"
          @dragstart="handleDragStart(index)"
          @dragover.prevent
          @drop="handleDrop(index)"
          @click="activeSection = section.key"
        >
          <div class="module-info">
            <n-icon size="18"><component :is="section.icon" /></n-icon>
            <span>{{ section.title }}</span>
          </div>
          <div class="module-actions">
            <n-switch v-model:value="section.visible" size="small" @click.stop />
          </div>
        </div>
      </div>

      <!-- AI 功能区 -->
      <div class="ai-tools">
        <h3>AI 助手</h3>
        <div class="ai-buttons">
          <n-button block @click="handleAIGenerate">
            <template #icon><n-icon><SparklesOutline /></n-icon></template>
            AI 生成简历
          </n-button>
          <n-button block @click="handleAIOptimize">
            <template #icon><n-icon><BulbOutline /></n-icon></template>
            AI 润色优化
          </n-button>
          <n-button block @click="handleAIDiagnose">
            <template #icon><n-icon><AnalyticsOutline /></n-icon></template>
            简历诊断
          </n-button>
        </div>
      </div>
    </aside>

    <!-- 中间编辑区 -->
    <main class="editor-main">
      <div class="editor-content" v-if="resumeStore.currentResume">
        <template v-for="section in visibleSections" :key="section.key">
          <BasicInfoEditor
            v-if="section.key === 'basic'"
            :data="resumeStore.content.basic"
            @update="(d: any) => resumeStore.updateContent('basic', d)"
          />
          <IntentionEditor
            v-else-if="section.key === 'intention'"
            :data="resumeStore.content.intention"
            @update="(d: any) => resumeStore.updateContent('intention', d)"
          />
          <EducationEditor
            v-else-if="section.key === 'education'"
            :data="resumeStore.content.education"
            @update="(d: any) => resumeStore.updateContent('education', d)"
          />
          <WorkEditor
            v-else-if="section.key === 'work'"
            :data="resumeStore.content.work"
            @update="(d: any) => resumeStore.updateContent('work', d)"
          />
          <ProjectEditor
            v-else-if="section.key === 'project'"
            :data="resumeStore.content.project"
            @update="(d: any) => resumeStore.updateContent('project', d)"
          />
          <AwardsEditor
            v-else-if="section.key === 'awards'"
            :data="resumeStore.content.awards"
            @update="(d: any) => resumeStore.updateContent('awards', d)"
          />
          <SkillsEditor
            v-else-if="section.key === 'skills'"
            :data="resumeStore.content.skills"
            @update="(d: any) => resumeStore.updateContent('skills', d)"
          />
          <TrainingEditor
            v-else-if="section.key === 'training'"
            :data="resumeStore.content.training"
            @update="(d: any) => resumeStore.updateContent('training', d)"
          />
          <SelfEvaluationEditor
            v-else-if="section.key === 'selfEvaluation'"
            :data="resumeStore.content.selfEvaluation"
            @update="(d: any) => resumeStore.updateContent('selfEvaluation', d)"
          />
          <HobbiesEditor
            v-else-if="section.key === 'hobbies'"
            :data="resumeStore.content.hobbies"
            @update="(d: any) => resumeStore.updateContent('hobbies', d)"
          />
          <LanguagesEditor
            v-else-if="section.key === 'languages'"
            :data="resumeStore.content.languages"
            @update="(d: any) => resumeStore.updateContent('languages', d)"
          />
          <PortfolioEditor
            v-else-if="section.key === 'portfolio'"
            :data="resumeStore.content.portfolio"
            @update="(d: any) => resumeStore.updateContent('portfolio', d)"
          />
        </template>
      </div>
      <div v-else class="editor-loading">
        <n-spin size="large" />
        <p>正在创建简历...</p>
      </div>
    </main>

    <!-- 右侧预览区 -->
    <aside class="editor-preview">
      <div class="preview-header">
        <h3>实时预览</h3>
        <n-space>
          <n-button size="small" @click="handleZoomOut">
            <template #icon><n-icon><RemoveOutline /></n-icon></template>
          </n-button>
          <span class="zoom-level">{{ zoomLevel }}%</span>
          <n-button size="small" @click="handleZoomIn">
            <template #icon><n-icon><AddOutline /></n-icon></template>
          </n-button>
        </n-space>
      </div>

      <div class="preview-container" :style="{ transform: `scale(${zoomLevel / 100})` }">
        <div class="resume-preview">
          <ResumePreview :content="resumeStore.content" />
        </div>
      </div>
    </aside>

    <!-- AI 生成弹窗 -->
    <n-modal v-model:show="showAIModal" preset="dialog" title="AI 生成简历">
      <n-form :model="aiForm" label-placement="left" label-width="80">
        <n-form-item label="目标岗位">
          <n-input v-model:value="aiForm.position" placeholder="如：前端开发工程师" />
        </n-form-item>
        <n-form-item label="工作年限">
          <n-input-number v-model:value="aiForm.workYears" :min="0" :max="30" />
        </n-form-item>
        <n-form-item label="学历背景">
          <n-select v-model:value="aiForm.education" :options="educationOptions" />
        </n-form-item>
        <n-form-item label="核心技能">
          <n-dynamic-tags v-model:value="aiForm.skills" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showAIModal = false">取消</n-button>
        <n-button type="primary" :loading="aiLoading" @click="handleGenerate">开始生成</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  AddOutline, SparklesOutline, BulbOutline, AnalyticsOutline, RemoveOutline,
  PersonOutline, BriefcaseOutline, SchoolOutline, BuildOutline, CodeWorkingOutline,
  TrophyOutline, RibbonOutline, BookOutline, ChatboxOutline, HeartOutline,
  LanguageOutline, FolderOpenOutline
} from '@vicons/ionicons5'
import { useResumeStore } from '@/stores/resume'
import { aiApi } from '@/api/ai'
import BasicInfoEditor from './components/BasicInfoEditor.vue'
import IntentionEditor from './components/IntentionEditor.vue'
import EducationEditor from './components/EducationEditor.vue'
import WorkEditor from './components/WorkEditor.vue'
import ProjectEditor from './components/ProjectEditor.vue'
import AwardsEditor from './components/AwardsEditor.vue'
import SkillsEditor from './components/SkillsEditor.vue'
import TrainingEditor from './components/TrainingEditor.vue'
import SelfEvaluationEditor from './components/SelfEvaluationEditor.vue'
import HobbiesEditor from './components/HobbiesEditor.vue'
import LanguagesEditor from './components/LanguagesEditor.vue'
import PortfolioEditor from './components/PortfolioEditor.vue'
import ResumePreview from './components/ResumePreview.vue'

const route = useRoute()
const message = useMessage()
const resumeStore = useResumeStore()

const activeSection = ref('basic')
const zoomLevel = ref(75)
const showAIModal = ref(false)
const aiLoading = ref(false)

const aiForm = ref({
  position: '',
  workYears: 1,
  education: 'bachelor',
  skills: [] as string[]
})

const educationOptions = [
  { label: '高中', value: 'highschool' },
  { label: '大专', value: 'college' },
  { label: '本科', value: 'bachelor' },
  { label: '硕士', value: 'master' },
  { label: '博士', value: 'phd' }
]

const sections = ref([
  { key: 'basic', title: '基本信息', icon: markRaw(PersonOutline), visible: true },
  { key: 'intention', title: '求职意向', icon: markRaw(BriefcaseOutline), visible: true },
  { key: 'education', title: '教育背景', icon: markRaw(SchoolOutline), visible: true },
  { key: 'work', title: '工作经历', icon: markRaw(BuildOutline), visible: true },
  { key: 'project', title: '项目经历', icon: markRaw(CodeWorkingOutline), visible: true },
  { key: 'awards', title: '获奖荣誉', icon: markRaw(TrophyOutline), visible: true },
  { key: 'skills', title: '技能证书', icon: markRaw(RibbonOutline), visible: true },
  { key: 'training', title: '培训经历', icon: markRaw(BookOutline), visible: true },
  { key: 'selfEvaluation', title: '自我评价', icon: markRaw(ChatboxOutline), visible: true },
  { key: 'hobbies', title: '兴趣爱好', icon: markRaw(HeartOutline), visible: true },
  { key: 'languages', title: '语言能力', icon: markRaw(LanguageOutline), visible: true },
  { key: 'portfolio', title: '作品集', icon: markRaw(FolderOpenOutline), visible: true }
])

const visibleSections = computed(() => sections.value.filter(s => s.visible))

let dragIndex = -1

function handleDragStart(index: number) {
  dragIndex = index
}

function handleDrop(index: number) {
  if (dragIndex === -1) return
  const item = sections.value.splice(dragIndex, 1)[0]
  sections.value.splice(index, 0, item)
  dragIndex = -1
}

function handleZoomIn() {
  if (zoomLevel.value < 150) zoomLevel.value += 10
}

function handleZoomOut() {
  if (zoomLevel.value > 50) zoomLevel.value -= 10
}

function handleAIGenerate() {
  showAIModal.value = true
}

function handleAIOptimize() {
  message.info('AI 润色功能开发中')
}

function handleAIDiagnose() {
  message.info('AI 诊断功能开发中')
}

async function handleGenerate() {
  if (!aiForm.value.position) {
    message.warning('请输入目标岗位')
    return
  }
  aiLoading.value = true
  try {
    const res = await aiApi.generateResume({
      position: aiForm.value.position,
      workYears: aiForm.value.workYears,
      education: aiForm.value.education,
      skills: aiForm.value.skills
    })
    if (resumeStore.currentResume) {
      resumeStore.currentResume.content = { ...resumeStore.currentResume.content, ...res }
    }
    message.success('AI 生成完成')
    showAIModal.value = false
  } catch (error) {
    message.error('AI 生成失败')
  } finally {
    aiLoading.value = false
  }
}

onMounted(async () => {
  const id = route.params.id as string
  const templateId = route.query.templateId as string

  if (id) {
    await resumeStore.fetchResume(id)
  } else if (templateId) {
    await resumeStore.createResume({ title: '未命名简历', templateId })
  } else {
    await resumeStore.createResume({ title: '未命名简历', templateId: 'default' })
  }
})
</script>

<style lang="scss" scoped>
.editor-page {
  display: flex;
  height: calc(100vh - 56px);
  background: #f0f2f5;
}

.editor-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { font-size: 15px; }
}

.module-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.module-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f5f7fa; }
  &.active { background: #e8f5e9; color: #18a058; }

  .module-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .module-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .module-actions { opacity: 1; }
}

.ai-tools {
  padding: 16px;
  border-top: 1px solid #e8e8e8;

  h3 { font-size: 15px; margin-bottom: 12px; }

  .ai-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.editor-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.editor-content {
  max-width: 800px;
  margin: 0 auto;
}

.editor-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #999;
}

.editor-preview {
  width: 400px;
  background: #fff;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.preview-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 { font-size: 15px; }

  .zoom-level {
    font-size: 13px;
    color: #666;
    min-width: 40px;
    text-align: center;
  }
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
  transform-origin: top center;
}

.resume-preview {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
</style>
