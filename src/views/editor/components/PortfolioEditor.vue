<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>作品集</h3>
      <n-button type="primary" size="small" @click="handleAdd">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        添加作品
      </n-button>
    </div>
    <div class="item-list">
      <div v-for="(item, index) in data" :key="item.id" class="list-item">
        <div class="item-header">
          <span class="item-title">{{ item.title }}</span>
          <n-space>
            <n-button text size="small" @click="handleEdit(index)">编辑</n-button>
            <n-button text type="error" size="small" @click="handleDelete(index)">删除</n-button>
          </n-space>
        </div>
        <a v-if="item.url" :href="item.url" target="_blank" class="item-link">{{ item.url }}</a>
        <p v-if="item.description" style="font-size:13px;color:#666;margin-top:4px">{{ item.description }}</p>
      </div>
      <n-empty description="暂无作品" v-if="!data || data.length === 0" />
    </div>

    <n-modal v-model:show="showModal" preset="dialog" :title="isEdit ? '编辑作品' : '添加作品'">
      <n-form label-placement="left" label-width="80">
        <n-form-item label="作品名称"><n-input v-model:value="editForm.title" placeholder="请输入作品名称" /></n-form-item>
        <n-form-item label="链接"><n-input v-model:value="editForm.url" placeholder="https://" /></n-form-item>
        <n-form-item label="描述"><n-input v-model:value="editForm.description" type="textarea" placeholder="请描述作品" /></n-form-item>
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
import type { Portfolio } from '@/types'

const props = defineProps<{ data: Portfolio[] }>()
const emit = defineEmits<{ update: [data: Portfolio[]] }>()

const showModal = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const editForm = ref<Portfolio>({ id: '', title: '', url: '', description: '' })

function handleAdd() {
  isEdit.value = false
  editForm.value = { id: Date.now().toString(), title: '', url: '', description: '' }
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
.list-item { padding: 16px; background: #f8f9fa; border-radius: 6px; .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; .item-title { font-weight: 500; } } .item-link { font-size: 13px; color: #3B82F6; } }
</style>
