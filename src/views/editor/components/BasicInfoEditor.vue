<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>基本信息</h3>
    </div>

    <div class="avatar-section">
      <div class="avatar-upload" @click="triggerFileInput">
        <img v-if="data.avatar" :src="data.avatar" class="avatar-img" />
        <div v-else class="avatar-placeholder">
          <n-icon size="32"><CameraOutline /></n-icon>
          <span>上传照片</span>
        </div>
        <div class="avatar-overlay">
          <n-icon size="24" color="#fff"><CameraOutline /></n-icon>
        </div>
      </div>
      <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="handleFileChange" />
      <n-button v-if="data.avatar" size="small" quaternary type="error" @click="removeAvatar">移除照片</n-button>
    </div>

    <n-form label-placement="left" label-width="80">
      <n-grid :cols="2" :x-gap="16">
        <n-gi>
          <n-form-item label="姓名">
            <n-input :value="data.name" placeholder="请输入姓名" @update:value="v => emit('update', { ...data, name: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="性别">
            <n-radio-group :value="data.gender" @update:value="v => emit('update', { ...data, gender: v })">
              <n-radio value="male">男</n-radio>
              <n-radio value="female">女</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="出生日期">
            <n-date-picker :value="toTimestamp(data.birthDate)" @update:value="v => emit('update', { ...data, birthDate: fromDateTimestampDay(v) })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="工作年限">
            <n-input-number :value="data.workYears" :min="0" :max="50" @update:value="v => emit('update', { ...data, workYears: v || 0 })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="手机号">
            <n-input :value="data.phone" placeholder="请输入手机号" @update:value="v => emit('update', { ...data, phone: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="邮箱">
            <n-input :value="data.email" placeholder="请输入邮箱" @update:value="v => emit('update', { ...data, email: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="所在城市">
            <n-input :value="data.location" placeholder="请输入所在城市" @update:value="v => emit('update', { ...data, location: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="求职头衔">
            <n-input :value="data.jobTitle" placeholder="如：前端开发工程师" @update:value="v => emit('update', { ...data, jobTitle: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="个人网站">
            <n-input :value="data.personalWebsite" placeholder="请输入个人网站" @update:value="v => emit('update', { ...data, personalWebsite: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="期望薪资">
            <n-input :value="data.expectSalary" placeholder="如：15-20K" @update:value="v => emit('update', { ...data, expectSalary: v })" />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CameraOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import type { BasicInfo } from '@/types'
import { toTimestamp, fromDateTimestampDay } from '@/utils/date'

const props = defineProps<{ data: BasicInfo }>()
const emit = defineEmits<{ update: [data: BasicInfo] }>()

const message = useMessage()
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    message.error('图片大小不能超过5MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string
    emit('update', { ...props.data, avatar: base64 })
    message.success('照片上传成功')
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function removeAvatar() {
  emit('update', { ...props.data, avatar: undefined })
}
</script>

<style lang="scss" scoped>
.section-editor {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;

  h3 {
    font-size: 16px;
    color: #333;
  }
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-upload {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s;

  &:hover {
    border-color: #18a058;

    .avatar-overlay {
      opacity: 1;
    }
  }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
</style>
