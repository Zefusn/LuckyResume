import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Resume, ResumeContent } from '@/types'
import { resumeApi } from '@/api/resume'

function createDefaultContent(): ResumeContent {
  return {
    basic: { name: '', gender: '', birthDate: '', phone: '', email: '', location: '', workYears: 0 },
    intention: { position: '', city: '', salary: '', jobType: '', industry: '' },
    education: [],
    work: [],
    project: [],
    awards: [],
    skills: [],
    training: [],
    selfEvaluation: '',
    hobbies: [],
    languages: [],
    portfolio: []
  }
}

export { createDefaultContent }

export const useResumeStore = defineStore('resume', () => {
  const currentResume = ref<Resume | null>(null)
  const resumeList = ref<Resume[]>([])
  const trashList = ref<Resume[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const initialized = ref(false)
  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

  const content = computed(() => {
    if (!currentResume.value) return createDefaultContent()
    return currentResume.value.content
  })

  async function fetchResumeList() {
    loading.value = true
    try {
      const data = await resumeApi.getList()
      resumeList.value = data.list
    } catch (error) {
      console.error('获取简历列表失败', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchResume(id: string) {
    loading.value = true
    try {
      const data = await resumeApi.getById(id)
      currentResume.value = data
      initialized.value = true
    } catch (error) {
      console.error('获取简历失败', error)
    } finally {
      loading.value = false
    }
  }

  async function createResume(data: { title: string; templateId: string }) {
    const result = await resumeApi.create(data)
    resumeList.value.unshift(result)
    currentResume.value = result
    initialized.value = true
    return result
  }

  async function ensureResume() {
    if (currentResume.value && initialized.value) return currentResume.value
    return await createResume({ title: '未命名简历', templateId: 'default' })
  }

  async function saveResume() {
    if (!currentResume.value) return
    saving.value = true
    try {
      const result = await resumeApi.updateContent(currentResume.value.id, currentResume.value.content, {
        templateColor: currentResume.value.templateColor,
        templateStyle: currentResume.value.templateStyle
      })
      currentResume.value = result
    } catch (error) {
      console.error('保存简历失败', error)
    } finally {
      saving.value = false
    }
  }

  function updateContent(section: keyof ResumeContent, data: any) {
    if (!currentResume.value) return
    if (!currentResume.value.content) {
      currentResume.value.content = createDefaultContent()
    }
    currentResume.value.content = { ...currentResume.value.content, [section]: data }
    scheduleAutoSave()
  }

  function updateTemplateColor(color: string) {
    if (!currentResume.value) return
    currentResume.value.templateColor = color
    scheduleAutoSave()
  }

  function scheduleAutoSave() {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    autoSaveTimer = setTimeout(() => {
      saveResume()
    }, 3000)
  }

  async function deleteResume(id: string) {
    await resumeApi.delete(id)
    await fetchResumeList()
    if (currentResume.value?.id === id) {
      currentResume.value = null
      initialized.value = false
    }
  }

  async function clearAllResumes() {
    await resumeApi.clearAll()
    resumeList.value = []
    currentResume.value = null
    initialized.value = false
  }

  async function fetchTrashList() {
    try {
      const data = await resumeApi.getTrashList()
      trashList.value = data.list
    } catch (error) {
      console.error('获取回收站失败', error)
    }
  }

  async function restoreResume(id: string) {
    await resumeApi.restore(id)
    trashList.value = trashList.value.filter(r => r.id !== id)
    await fetchResumeList()
  }

  async function permanentDelete(id: string) {
    await resumeApi.permanentDelete(id)
    trashList.value = trashList.value.filter(r => r.id !== id)
  }

  return {
    currentResume,
    resumeList,
    trashList,
    loading,
    saving,
    content,
    initialized,
    fetchResumeList,
    fetchResume,
    createResume,
    ensureResume,
    saveResume,
    updateContent,
    updateTemplateColor,
    deleteResume,
    clearAllResumes,
    fetchTrashList,
    restoreResume,
    permanentDelete
  }
})
