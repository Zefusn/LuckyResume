<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>专业技能</h3>
      <n-button type="primary" size="small" @click="handleAdd">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        添加技能
      </n-button>
    </div>
    <div class="item-list">
      <div v-for="(item, index) in data" :key="item.id" class="list-item">
        <div class="item-info">
          <span class="skill-name">{{ item.name }}</span>
          <n-rate :value="item.level" :count="5" readonly size="small" />
        </div>
        <n-space>
          <n-button text size="small" @click="handleEdit(index)">编辑</n-button>
          <n-button text type="error" size="small" @click="handleDelete(index)">删除</n-button>
        </n-space>
      </div>
      <n-empty description="暂无技能" v-if="!data || data.length === 0" />
    </div>

    <n-modal v-model:show="showModal" preset="dialog" :title="isEdit ? '编辑技能' : '添加技能'">
      <n-form label-placement="left" label-width="80">
        <n-form-item label="技能名称"><n-input v-model:value="editForm.name" placeholder="请输入技能名称" /></n-form-item>
        <n-form-item label="熟练程度"><n-rate v-model:value="editForm.level" :count="5" /></n-form-item>
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
import type { Skill } from '@/types'

const props = defineProps<{ data: Skill[] }>()
const emit = defineEmits<{ update: [data: Skill[]] }>()

const showModal = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const editForm = ref<Skill>({ id: '', name: '', level: 3 })

function handleAdd() {
  isEdit.value = false
  editForm.value = { id: Date.now().toString(), name: '', level: 3 }
  showModal.value = true
}

function handleEdit(index: number) {
  isEdit.value = true
  editIndex.value = index
  editForm.value = { ...props.data[index] }
  showModal.value = true
}

function handleDelete(index: number) {
  const list = [...props.data]
  list.splice(index, 1)
  emit('update', list)
}

function handleSave() {
  const list = [...props.data]
  if (isEdit.value) {
    list[editIndex.value] = { ...editForm.value }
  } else {
    list.push({ ...editForm.value })
  }
  emit('update', list)
  showModal.value = false
}
</script>

<style lang="scss" scoped>
.section-editor { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; h3 { font-size: 16px; } }
.item-list { display: flex; flex-direction: column; gap: 12px; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8f9fa; border-radius: 6px; .item-info { display: flex; align-items: center; gap: 16px; .skill-name { font-weight: 500; } } }
</style>
