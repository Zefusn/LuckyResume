<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>基本信息</h3>
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
          <n-form-item label="个人网站">
            <n-input :value="data.personalWebsite" placeholder="请输入个人网站" @update:value="v => emit('update', { ...data, personalWebsite: v })" />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { BasicInfo } from '@/types'
import { toTimestamp, fromDateTimestampDay } from '@/utils/date'

defineProps<{ data: BasicInfo }>()
const emit = defineEmits<{ update: [data: BasicInfo] }>()
</script>

<style lang="scss" scoped>
.section-editor { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.section-header { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; h3 { font-size: 16px; color: #333; } }
</style>
