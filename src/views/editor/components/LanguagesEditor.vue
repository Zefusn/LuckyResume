<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>语言能力</h3>
      <n-button type="primary" size="small" @click="handleAdd">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        添加语言
      </n-button>
    </div>
    <div class="item-list">
      <div v-for="(item, index) in data" :key="item.id" class="list-item">
        <span>{{ item.name }} - {{ item.level }}<span v-if="item.certificate">（{{ item.certificate }}）</span></span>
        <n-button text type="error" size="small" @click="handleDelete(index)">删除</n-button>
      </div>
      <n-empty description="暂无语言" v-if="!data || data.length === 0" />
    </div>

    <n-modal v-model:show="showModal" preset="dialog" title="添加语言">
      <n-form label-placement="left" label-width="80">
        <n-form-item label="语言"><n-input v-model:value="editForm.name" placeholder="如：英语" /></n-form-item>
        <n-form-item label="水平"><n-select v-model:value="editForm.level" :options="levelOptions" /></n-form-item>
        <n-form-item label="证书"><n-input v-model:value="editForm.certificate" placeholder="如：CET-6、雅思7.0" /></n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" @click="handleSave">保存</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AddOutline } from '@vicons/ionicons5'
import type { Language } from '@/types'

const props = defineProps<{ data: Language[] }>()
const emit = defineEmits<{ update: [data: Language[]] }>()

const showModal = ref(false)
const editForm = ref<Language>({ id: '', name: '', level: '', certificate: '' })

const levelOptions = [
  { label: '入门', value: '入门' },
  { label: '日常交流', value: '日常交流' },
  { label: '熟练', value: '熟练' },
  { label: '精通', value: '精通' },
  { label: '母语', value: '母语' }
]

function handleAdd() {
  editForm.value = { id: Date.now().toString(), name: '', level: '', certificate: '' }
  showModal.value = true
}

function handleDelete(index: number) {
  const list = [...props.data]
  list.splice(index, 1)
  emit('update', list)
}

function handleSave() {
  const list = [...props.data, { ...editForm.value }]
  emit('update', list)
  showModal.value = false
}
</script>

<style lang="scss" scoped>
.section-editor { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; h3 { font-size: 16px; } }
.item-list { display: flex; flex-direction: column; gap: 8px; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8f9fa; border-radius: 6px; }
</style>
