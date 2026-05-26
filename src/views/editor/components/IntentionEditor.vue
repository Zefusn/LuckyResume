<template>
  <div class="section-editor">
    <div class="section-header">
      <h3>求职意向</h3>
    </div>
    <n-form label-placement="left" label-width="80">
      <n-grid :cols="2" :x-gap="16">
        <n-gi>
          <n-form-item label="期望职位">
            <n-input :value="data.position" placeholder="请输入期望职位" @update:value="v => emit('update', { ...data, position: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="期望城市">
            <n-input :value="data.city" placeholder="请输入期望城市" @update:value="v => emit('update', { ...data, city: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="期望薪资">
            <n-select :value="data.salary" :options="salaryOptions" @update:value="v => emit('update', { ...data, salary: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="工作类型">
            <n-select :value="data.jobType" :options="jobTypeOptions" @update:value="v => emit('update', { ...data, jobType: v })" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="行业">
            <n-input :value="data.industry" placeholder="请输入期望行业" @update:value="v => emit('update', { ...data, industry: v })" />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import type { JobIntention } from '@/types'

defineProps<{ data: JobIntention }>()
const emit = defineEmits<{ update: [data: JobIntention] }>()

const salaryOptions = [
  { label: '面议', value: '面议' },
  { label: '5-10K', value: '5-10K' },
  { label: '10-15K', value: '10-15K' },
  { label: '15-20K', value: '15-20K' },
  { label: '20-30K', value: '20-30K' },
  { label: '30-50K', value: '30-50K' },
  { label: '50K+', value: '50K+' }
]

const jobTypeOptions = [
  { label: '全职', value: '全职' },
  { label: '兼职', value: '兼职' },
  { label: '实习', value: '实习' },
  { label: '远程', value: '远程' }
]
</script>

<style lang="scss" scoped>
.section-editor { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.section-header { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; h3 { font-size: 16px; color: #333; } }
</style>
