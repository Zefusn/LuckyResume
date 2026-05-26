<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>培训经历</h3>
      <n-button type="primary" size="small" @click="handleAdd">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        添加培训
      </n-button>
    </div>
    <div class="item-list">
      <div v-for="(item, index) in data" :key="item.id" class="list-item">
        <div class="item-header">
          <span class="item-title">{{ item.institution }}</span>
          <n-space>
            <n-button text size="small" @click="handleEdit(index)">编辑</n-button>
            <n-button text type="error" size="small" @click="handleDelete(index)">删除</n-button>
          </n-space>
        </div>
        <div class="item-info">
          <span v-if="item.course">{{ item.course }}</span>
          <span v-if="item.startDate">{{ item.startDate }} - {{ item.endDate }}</span>
        </div>
      </div>
      <n-empty description="暂无培训" v-if="!data || data.length === 0" />
    </div>

    <n-modal v-model:show="showModal" preset="dialog" :title="isEdit ? '编辑培训' : '添加培训'">
      <n-form label-placement="left" label-width="80">
        <n-form-item label="培训机构"><n-input v-model:value="editForm.institution" placeholder="请输入培训机构" /></n-form-item>
        <n-form-item label="培训课程"><n-input v-model:value="editForm.course" placeholder="请输入培训课程" /></n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-gi>
            <n-form-item label="开始时间">
              <n-date-picker :value="toTimestamp(editForm.startDate)" @update:value="v => editForm.startDate = fromDateTimestamp(v)" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="结束时间">
              <n-date-picker :value="toTimestamp(editForm.endDate)" @update:value="v => editForm.endDate = fromDateTimestamp(v)" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-form-item label="证书"><n-input v-model:value="editForm.certificate" placeholder="请输入获得的证书" /></n-form-item>
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
import type { Training } from '@/types'
import { toTimestamp, fromDateTimestamp } from '@/utils/date'

const props = defineProps<{ data: Training[] }>()
const emit = defineEmits<{ update: [data: Training[]] }>()

const showModal = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const editForm = ref<Training>({ id: '', institution: '', course: '', startDate: '', endDate: '', certificate: '' })

function handleAdd() {
  isEdit.value = false
  editForm.value = { id: Date.now().toString(), institution: '', course: '', startDate: '', endDate: '', certificate: '' }
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
.list-item { padding: 16px; background: #f8f9fa; border-radius: 6px; .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; .item-title { font-weight: 500; } } .item-info { display: flex; gap: 16px; color: #666; font-size: 13px; } }
</style>
