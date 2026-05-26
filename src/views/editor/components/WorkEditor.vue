<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>工作经历</h3>
      <n-button type="primary" size="small" @click="handleAdd">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        添加工作经历
      </n-button>
    </div>
    <div class="work-list">
      <div v-for="(item, index) in data" :key="item.id" class="work-item">
        <div class="item-header">
          <span class="item-title">{{ item.company || '未填写公司' }}</span>
          <n-space>
            <n-button text size="small" @click="handleEdit(index)">编辑</n-button>
            <n-button text type="error" size="small" @click="handleDelete(index)">删除</n-button>
          </n-space>
        </div>
        <div class="item-info">
          <span v-if="item.position">{{ item.position }}</span>
          <span v-if="item.startDate">{{ item.startDate }} - {{ item.isCurrent ? '至今' : item.endDate }}</span>
        </div>
        <div class="item-desc" v-if="item.description"><p>{{ item.description }}</p></div>
        <div class="item-achievements" v-if="item.achievements?.length">
          <p class="achievements-title">工作业绩：</p>
          <ul><li v-for="(a, i) in item.achievements" :key="i">{{ a }}</li></ul>
        </div>
      </div>
      <n-empty description="暂无工作经历" v-if="!data || data.length === 0" />
    </div>

    <n-modal v-model:show="showModal" preset="dialog" :title="isEdit ? '编辑工作经历' : '添加工作经历'" style="width: 600px">
      <n-form label-placement="left" label-width="80">
        <n-form-item label="公司名称"><n-input v-model:value="editForm.company" placeholder="请输入公司名称" /></n-form-item>
        <n-form-item label="职位"><n-input v-model:value="editForm.position" placeholder="请输入职位" /></n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-gi>
            <n-form-item label="开始时间">
              <n-date-picker :value="toTimestamp(editForm.startDate)" @update:value="v => editForm.startDate = fromDateTimestamp(v)" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="结束时间">
              <n-date-picker :value="toTimestamp(editForm.endDate)" :disabled="editForm.isCurrent" @update:value="v => editForm.endDate = fromDateTimestamp(v)" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-form-item label="至今"><n-switch v-model:value="editForm.isCurrent" /></n-form-item>
        <n-form-item label="工作描述"><n-input v-model:value="editForm.description" type="textarea" :rows="3" placeholder="请描述您的工作内容" /></n-form-item>
        <n-form-item label="工作业绩"><n-dynamic-tags v-model:value="editForm.achievements" /></n-form-item>
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
import type { WorkExperience } from '@/types'
import { toTimestamp, fromDateTimestamp } from '@/utils/date'

const props = defineProps<{ data: WorkExperience[] }>()
const emit = defineEmits<{ update: [data: WorkExperience[]] }>()

const showModal = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const editForm = ref<WorkExperience>({ id: '', company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '', achievements: [] })

function handleAdd() {
  isEdit.value = false
  editForm.value = { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '', achievements: [] }
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
.work-list { display: flex; flex-direction: column; gap: 12px; }
.work-item { padding: 16px; background: #f8f9fa; border-radius: 6px; .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; .item-title { font-weight: 500; font-size: 15px; } } .item-info { display: flex; gap: 16px; color: #666; font-size: 13px; margin-bottom: 12px; } .item-desc { margin-bottom: 12px; p { color: #333; font-size: 14px; line-height: 1.8; } } .item-achievements { .achievements-title { font-size: 13px; color: #666; margin-bottom: 8px; } ul { list-style: disc; padding-left: 20px; li { font-size: 13px; color: #333; line-height: 1.8; } } } }
</style>
